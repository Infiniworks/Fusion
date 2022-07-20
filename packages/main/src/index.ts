const { app, ipcMain } = require("electron");
const ngrok = require("ngrok");
const { Client } = require("minecraft-launcher-core");
const msmc = require("msmc");
const os = require("os");
const DiscordRPC  = require("discord-rpc");
const mcData = require("minecraft-data");
const MCPATH = require("minecraft-folder-path");
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

let currentVersion;
let authResult;

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

const getJavaVersion = async (mcVersion) => {
  let javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/17/ga";
  if (mcVersion < 1.14) javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/8/ga";
  else if (mcVersion <  1.16) javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/11/ga";
  else if (mcVersion >  1.16) javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/17/ga";
  const {result} = await got(javaUrl).then((res) => {return res;});
  console.log(result);
};

app.on("second-instance", restoreOrCreateWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", restoreOrCreateWindow);
app.whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error("Failed create window:", e));
rpc.login({ clientId }).catch(console.error);

// Handlers
ipcMain.handle("startServerV2", async () => {
  return await awaitUrl();
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

ipcMain.on("startClient", (event, o) => {
  //getJavaVersion(o.version);
  if (msmc.errorCheck(o.authentication)){
    console.log(o.authentication.reason);
    return;
  }
  const opts = {
    clientPackage: null,
    authorization: msmc.getMCLC().getAuth(o.authentication),
    root: "./minecraft",
    version: {
      number: o.version,
      custom: "fabric-loader-"+"0.14.8"+"-"+o.version,
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
      libraryRoot: MCPATH+"/libraries",
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

