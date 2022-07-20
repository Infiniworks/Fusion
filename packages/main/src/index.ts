/* eslint-disable @typescript-eslint/no-unused-vars */
const { app, ipcMain } = require("electron");
const ngrok = require("ngrok");
const { Client } = require("minecraft-launcher-core");
const msmc = require("msmc");
const os = require("os");
const DiscordRPC  = require("discord-rpc");
const mcData = require("minecraft-data");
const jsonfile = require("jsonfile");
const fs = require("fs-extra");
const { createWriteStream } = require("fs-extra");
const stream = require("stream");
const { promisify } = require("util");
const { exec } = require("child_process");

import got from "got";

import * as util from "minecraft-server-util";
import {restoreOrCreateWindow} from "/@/mainWindow";

const launcher = new Client();
const statuses = [
  "Enjoying a lollipop",
  "Parkour with an Orange Fruit",
  "RIP Techno :(", "Minecraft?",
  "pure bondoonglery",
];
const clientId = "999073734486925382";
const rpc = new DiscordRPC.Client({ transport: "ipc" });
const startTimestamp = new Date();
const isSingleInstance = app.requestSingleInstanceLock();

let currentVersion, serverUrl, authResult;

// Auto Updater
if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import("electron-updater"))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}

// Checks
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

// Async Functions
async function getPlayingVersion() {
  return currentVersion || "Launcher Screen";
}

async function setActivity() {
  rpc.setActivity({
    details: `Playing ${await getPlayingVersion()}`,
    state: `${statuses[Math.floor(Math.random()*statuses.length)]}`,
    buttons: [ 
      { label: "Downloads", url: "https://github.com/AarushX/Fusion" }, 
    ], 
    startTimestamp,
    largeImageKey: "lite-sky",
    largeImageText: "Try Fusion out!",
    smallImageKey: "starframe",
    smallImageText: "Try Fusion out!",
  });
}

DiscordRPC.register(clientId);

rpc.on("ready", () => {
  setActivity();

  setInterval(() => {
    setActivity();
  }, 30001);
});

const awaitUrl = async () => {
  const urlServer = await ngrok.connect({ 
      proto: "tcp",
      addr: 25565,
      authtoken: "1r7Om4dKZGppn414jclOabclLsV_5MfjTVsiTBXmwQqZp7QBK",
  }); 
  if (urlServer) return urlServer;
  else return "urlServer fetch rejected";
};
const addSettings = async (clientName, options) => {
  const file = ".minecraft/instances/"+clientName+"/settings.json";
  await jsonfile.writeFile(file, options, { flag: "a" }, (e) => console.log(e));
};

const getJavaVersion = async (mcVersion) => {
  let javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/17/ga";
  if (mcVersion < 1.14) javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/8/ga";
  else if (mcVersion <  1.16) javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/11/ga";
  else if (mcVersion >  1.16) javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/17/ga";
  console.log(await got(javaUrl).then((res) => {return res;}));
};

const download = async (url, dest) => {
  console.time(`Downloading ${url} took`);
  const pipeline = promisify(stream.pipeline);
  fs.ensureFile(dest);
  const downloadStream = got.stream(url);
  const fileWriterStream = createWriteStream(dest);

  console.group(`Downloading ${url} to ${dest}`);
  

  downloadStream.on("downloadProgress", ({ transferred, total, percent }) => {
    const percentage = Math.round(percent * 100);
    console.log(`${dest} Download: ${transferred}/${total} (${percentage}%)`);
  });
  console.groupEnd();
  console.timeEnd(`Downloading ${url} took`);
  
  await pipeline(downloadStream, fileWriterStream);
};

const install = async (type, installDir, version, rootDir) => {
  if (type == "fabric") {
    const fabricPath = installDir+"/fabric-installer.jar";
    console.log(`Downloading Fabric to ${fabricPath}`);
    await download(
      "https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.11.0/fabric-installer-0.11.0.jar", 
      fabricPath,
    );
    console.log(`Installing Fabric from ${installDir} to ${rootDir}`);
    await exec(`java -jar ${fabricPath} client -dir ${rootDir} -mcversion ${version} -noprofile`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
    });
  }
};

app.on("second-instance", restoreOrCreateWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", restoreOrCreateWindow);
app.whenReady()
  .then(() => {
    restoreOrCreateWindow();
    start();
  })
  .catch((e) => console.error("Failed create window:", e));
rpc.login({ clientId }).catch(console.error);

// Handlers
ipcMain.handle("startServerV2", async () => {
  serverUrl = await awaitUrl();
  return serverUrl;
});

ipcMain.handle("doesExistServerURL", async () => {
  return await serverUrl;
});

ipcMain.handle("getServerStats", async (event, server, port) => {
  console.log(server,port);
  return await util.status(server, port, {
    timeout: 1000 * 5,
    enableSRV: true,
  })
  .then((result) => {return result;})
  .catch((error) => console.error(error));
});

ipcMain.handle("getDevmode", () => {
  return process.env.IS_DEV === "true";
});

ipcMain.handle("login", async () => {
  await msmc.fastLaunch("electron",
    (update) => { console.log(update); })
    .then(result => { 
      authResult = result;
    },
  );
  return JSON.stringify(authResult);
});

ipcMain.on("startClient", async (event, o) => {
  const version = o.customVersion || o.version;
  const rootDir = "./minecraft/instances/"+ (o.clientName || "default");
  const dir = rootDir + "/versions/"+version;
  fs.ensureDir(dir);

  await install("fabric", "./minecraft/installers", o.version, dir);
  if (msmc.errorCheck(o.authentication)){
    console.log(o.authentication.reason);
    return;
  }
  
  const opts = {
    clientPackage: null,
    authorization: msmc.getMCLC().getAuth(o.authentication),
    root: rootDir,
    version: {
      number: o.version,
      custom: version,
    },
    memory: {
      min: o.memMin,
      max: o.memMax,
    },
    window: {
      width: o.width,
      height: o.height,
      fullscreen: o.fullscreen,
    },
    javaPath: "javaw",
    overrides: {
      libraryRoot: "./minecraft/libraries",
      maxSockets: (o.maxSockets || 3),
    },
  };
  
  console.log("Starting!");
  launcher.launch(opts);
  currentVersion = o.version;
  launcher.on("debug", (e) => console.log(e));
  launcher.on("data", (e) => console.log(e));
  launcher.on("close", (e) => console.log("closed "+e));
});

ipcMain.handle("maxMemory", () => {
  return os.totalmem();
});

ipcMain.handle("getVersions", () => {
  return mcData.versions.pc;
});

ipcMain.handle("getMods", async (event, client) => {
  const jsonfile = require("jsonfile");
  const file = "./minecraft/instances/"+client+"/settings.json";
  let result;
  await addSettings(client, {mods: []});
  await jsonfile.readFile(file)
    .then(obj => {
      console.dir(obj);
      result = obj.mods;
    });
  return result;
});

const start = async () => {
  //await getJavaVersion(1.18);
};