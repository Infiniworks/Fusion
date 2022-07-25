/* eslint-disable @typescript-eslint/no-unused-vars */
import { installFabric, getFabricLoaderArtifact } from "@xmcl/installer";
import { Curseforge } from "node-curseforge";

const { app, ipcMain } = require("electron");
const ngrok = require("ngrok");
const { Client } = require("minecraft-launcher-core");
const msmc = require("msmc");
const os = require("os");
const DiscordRPC = require("discord-rpc-patch");
const mcData = require("minecraft-data");
const fs = require("fs-extra");
const { createWriteStream } = require("fs-extra");
const stream = require("stream");
const { promisify } = require("util");
const extract = require("extract-zip");

import * as path from "path";
import { autoUpdater } from "electron";
import got from "got";

import * as util from "minecraft-server-util";
import { restoreOrCreateWindow } from "/@/mainWindow";
import { ModsSearchSortField } from "node-curseforge/dist/objects/enums";
const cf = new Curseforge(
  "$2a$10$Qdq6OGz.jQstDijKEkly0ee.XXygyKvZIakSvUyRcc1NLad7rT6fW"
);

const modsList = [
  "better-controls/cf@1.18.2",
  "c2me-fabric",
  "cloth-config",
  "cull-leaves",
  "dashloader",
  "entityculling",
  "fabric-api",
  "fastload",
  "ferrite-core",
  "iris",
  "krypton",
  "lambdynamiclights",
  "lazydfu",
  "logical-zoom/@1.18.2",
  "memoryleakfix",
  "modmenu",
  "moreculling",
  "no-chat-reports",
  "not-enough-animations",
  "notenoughcrashes",
  "smoothboot-fabric",
  "sodium",
  "sodium-extra",
  "starlight",
];
const launcher = new Client();
const statuses = [
  "Enjoying a purple lollipop?",
  "Parkour with an Orange Fruit.",
  "Technoblade Never Dies.",
  "Minecraft Anyone?",
  "Pure, powerful bondoonglery",
  "Disco with a Purple Grape.",
];
const clientId = "999073734486925382";
const rpc = new DiscordRPC.Client({ transport: "ipc" });
const startTimestamp = new Date();
const isSingleInstance = app.requestSingleInstanceLock();
const minecraftPath = path.join(__dirname, "..", "..", "..", "minecraft");

let currentVersion, serverUrl, authResult;

// Auto Updater
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
  autoUpdater.quitAndInstall();
}

// Checks
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

// Async Functions
async function setActivity() {
  rpc.setActivity({
    details: `Playing ${currentVersion || "Launcher Screen"}`,
    state: `${statuses[Math.floor(Math.random() * statuses.length)]}`,
    buttons: [{ label: "Downloads", url: "https://github.com/AarushX/Fusion" }],
    startTimestamp,
    largeImageKey: "fusion",
    largeImageText: "Try Fusion out!",
    smallImageKey: "sun",
    smallImageText: "Starlike Performance!",
  });
}

// const getMods = async (client) => {
//   const file = "./minecraft/instances/"+client+"/settings.json";
//   let result;
//   await addSettings(client, { mods: [] });
//   await jsonfile.readFile(file).then((obj) => {
//     console.dir(obj);
//     result = obj.mods;
//   });
//   return result;
// };

const getServerStats = async (server, port) => {
  console.log(server, port);
  return await util
    .status(server, port, {
      timeout: 1000 * 5,
      enableSRV: true,
    })
    .then((result) => {
      return result;
    })
    .catch((error) => console.error(error));
};

const login = async () => {
  await msmc
    .fastLaunch("electron", (update) => {
      console.log(update);
    })
    .then((result) => {
      authResult = result;
    });
  return JSON.stringify(authResult);
};

const startClient = async (o) => {
  // if (!(await fs.exists(path.join(dir)))) {
  const version = (await install(modsList)).fabricName;
  // }

  // const version = o.customVersion || o.version;
  const rootDir = path.join(
    minecraftPath,
    "instances",
    o.clientName || "default"
  );
  // const dir = path.join(rootDir, "versions", version);
  // fs.ensureDir(dir);

  if (msmc.errorCheck(o.authentication)) {
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
    javaPath: path.join(
      minecraftPath,
      "java",
      "OpenJDK17U",
      "bin",
      "javaw.exe"
    ),
    overrides: {
      maxSockets: o.maxSockets || 3,
    },
  };

  console.log(`Starting Fusion Client ${version}!`);
  currentVersion = o.version;
  launcher.launch(opts);

  launcher.on("debug", (e) => console.log(e));
  launcher.on("data", (e) => console.log(e));
  launcher.on("close", (e) => console.log("Closed:", e));
};

const start = async () => {
  console.log("Starting Fusion client and crew!");
};

const awaitUrl = async () => {
  const urlServer = await ngrok.connect({
    proto: "tcp",
    addr: 25565,
    authtoken: "1r7Om4dKZGppn414jclOabclLsV_5MfjTVsiTBXmwQqZp7QBK",
  });
  if (urlServer) return urlServer;
  else return "urlServer fetch rejected";
};

// const addSettings = async (clientName, options) => {
//   const file = ".minecraft/instances/" + clientName + "/settings.json";
//   await jsonfile.writeFile(file, options, { flag: "a" }, (e) => console.log(e));
// };

const installJava = async (mcVersion) => {
  // let javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/17/ga";
  // if (mcVersion < 1.14) javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/8/ga";
  // else if (mcVersion <  1.16) javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/11/ga";
  // else if (mcVersion >  1.16) javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/17/ga";

  const javaUrl = "https://api.adoptium.net/v3/assets/feature_releases/17/ga";
  const result: JSON = await got(javaUrl).json();
  const downloadLink = result[0]["binaries"][11]["package"]["link"];
  const version = result[0]["binaries"][11]["scm_ref"];
  const downDir = "./minecraft/java/downloading/" + version + ".zip";
  await download(downloadLink, downDir);
  await extract(downDir, { dir: "./minecraft/java" + version });
  await fs.remove(downDir);
};

const download = async (url, dest) => {
  await fs.ensureFile(dest);
  await promisify(stream.pipeline)(
    got.stream(url),
    await createWriteStream(dest)
  );
};

const install = async (mods) => {
  // Variables
  const fabricVersion = "0.14.8";
  const mcVersion = 1.19 + "";
  const fabricLoaderName = `fabric-loader-${fabricVersion}`;
  const fabName = mcVersion + "-fabric" + fabricVersion;

  // Paths
  const instancesPath = path.join(minecraftPath, "instances", "default");
  const modsPath = path.join(instancesPath, "mods");
  const versionsPath = path.join(
    instancesPath,
    "versions",
    `${fabricLoaderName}-${mcVersion}`
  );

  // Safeguards
  fs.ensureDir(instancesPath);
  fs.ensureDir(modsPath);
  fs.ensureDir(versionsPath);

  // Install Fabric
  const versionList = await getFabricLoaderArtifact(mcVersion, fabricVersion);
  await installFabric(versionList, instancesPath).then((result) => {
    console.log(result);
  });
  console.log("Fabric installed!");

  // Install Mods
  for (const modIndex in mods) {
    const splitSource = mods[modIndex].split("/");
    let modPlatform, modVersion;
    if (splitSource.length > 1) {
      const splitInfo = splitSource[1].split("@");
      modPlatform = splitInfo.length > 1 ? splitInfo[0] : "mr";
      modVersion =
        (splitInfo.length > 1 ? splitInfo[1] : undefined) ||
        (splitInfo.length == 1 ? splitInfo[0] : mcVersion);
    }
    const mod0 = splitSource[0];

    if (modPlatform === "cf") {
      console.log(`Getting CringeForge ${modVersion} Mod!`);
      (await cf.get_game("minecraft"))
        .search_mods({
          searchFilter: mod0,
          gameVersion: modVersion,
          sortField: ModsSearchSortField.NAME,
        })
        .then((mods) => {
          for (const mod in mods) {
            if (mods[mod]["slug"] == mod0) {
              console.log(`${mod0} <== npm @ (node-curseforge)`);
              const latestFiles = mods[mod]["latestFiles"];
              for (const latestFile in latestFiles) {
                const file = latestFiles[latestFile];
                if (file["gameVersions"].includes("fabric")) {
                  const downloadURL = file["downloadUrl"];
                  const name = `${file["slug"]}-${file["slug"]}.jar`;
                  const fileName = path.join(modsPath, name);
                  download(downloadURL, fileName);
                }
              }
            }
          }
        });
    } else {
      console.error(`Getting YayRinth ${modVersion || mcVersion} Mod!`);
      const url = `https://api.modrinth.com/v2/project/${mod0}/version?game_versions=["${
        modVersion || mcVersion
      }"]`;
      console.log(`${mod0} <== (${url})`);
      const response = await got(url);
      const results = JSON.parse(response.body)[0];

      if (results["loaders"].includes("fabric")) {
        const downloadURL = results["files"][0]["url"];
        const name = `${mod0}-${results["version_number"]}.jar`;
        const fileName = path.join(modsPath, name);
        await download(downloadURL, fileName);
      }
    }
  }
  console.log("Mods installed!");
  return {
    fabricName: fabName,
  };
};
// const install = async (type, installDir, version, rootDir) => {
//   if (type == "fabric") {
//     const fabricPath = installDir + "/fabric-installer.jar";
//     console.log(`Downloading Fabric to ${fabricPath}`);
//     await fs.ensureFile(fabricPath);
//     // xhr.open("GET", "https://maven.fabricmc.net/net/fabricmc/fabric-installer/maven-metadata.xml"); <-- Gets latest version

//     download(
//       "https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.11.0/fabric-installer-0.11.0.jar",
//       fabricPath,
//     ).then(() => {
//       console.log(`Installing Fabric from ${installDir} to ${rootDir}`);
//       const cmd = `${path.join(
//         __dirname + "../../../../minecraft/java/OpenJDK17U/bin/javaw.exe",
//       )} -jar ${fabricPath} client -dir "${rootDir}" -mcversion ${version} -noprofile`;
//       exec(cmd, (error, stdout, stderr) => {
//         if (error) {
//           console.log(`error: ${error.message}`);
//           return;
//         }
//         if (stderr) {
//           console.log(`stderr: ${stderr}`);
//           return;
//         }
//         console.log(`stdout: ${stdout}`);
//       });
//       return;
//     });
//   }
// };

app.on("second-instance", restoreOrCreateWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", restoreOrCreateWindow);

app
  .whenReady()
  .then(() => {
    restoreOrCreateWindow();
    start();
  })
  .catch((e) => console.error("Failed create window:", e));

DiscordRPC.register(clientId);

rpc.on("ready", () => {
  setActivity();

  setInterval(() => {
    setActivity();
  }, 6e4);
});

rpc.login({ clientId }).catch(console.error);

// Big Daddy Handler v1
// getAPI V1
// BDH1
ipcMain.handle("get", async (event, command, arg1, arg2, arg3) => {
  switch (command) {
    case "devmode":
      return process.env.IS_DEV === "true";
    case "serverStats":
      return await getServerStats(arg1, arg2);
    case "minecraftVersions":
      return mcData.versions.pc;
    case "maxMemory":
      return os.totalmem();
    // case "clientMods":
    //   return await getMods(arg1);
    case "login":
      return await login();
    case "startClient":
      return await startClient(arg1);
    case "version":
      switch (arg1) {
        case "minecraft":
          return currentVersion || "Launcher Screen";
      }
      break;
    case "url":
      if (serverUrl) {
        return await serverUrl;
      }
      serverUrl = await awaitUrl();
      return serverUrl;
    case "freeMemory":
      switch (arg1) {
        case "B":
          return os.freemem();
        case "K":
          return Math.round(os.freemem() / 1024);
        case "M":
          return Math.round(os.freemem() / 1024 / 1024);
        case "G":
          return Math.round(os.freemem() / 1024 / 1024 / 1024);
      }
      break;
    case "install":
      await install(modsList);
      break;
  }
});
