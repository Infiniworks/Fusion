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
  "cf/better-controls",
  "ok-zoomer", // replaces "cf/logical-zoom"
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
  "lithium",
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

  "cf/better-sodium-video-settings-button",
  "reeses-sodium-options",
  "cf/recipe-cache",
  "forgetmechunk",
  "cf/lazy-language-loader",
  "cf/enhanced-block-entities",
  "cf/fastopenlinksandfolders",
  // cf/clumps@latest <-- any time?
  "appleskin",
  "amecs",
  "cf/perspective-mod-redux",
  "dynamic-fps",
  "cf/kappa",
  "indium",
  "cf/dark-loading-screen",
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
  console.log("Starting Fusion client!");
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

const installJava = async () => {
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
  let fabName = mcVersion + "-fabric" + fabricVersion;

  // Paths
  const instancesPath = path.join(minecraftPath, "instances", "default");
  const modsPath = path.join(instancesPath, "mods");

  // Safeguards
  fs.ensureDir(instancesPath);
  fs.ensureDir(modsPath);

  // Install Fabric
  const versionList = await getFabricLoaderArtifact(mcVersion, fabricVersion);
  await installFabric(versionList, instancesPath).then((result) => {
    fabName = result;
  });

  console.log("Fabric installed!");

  // Install Mods
  for (const modIndex in mods) {
    let mod0, modPlatform, modVersion;

    // Parse mod info
    const platformSPLT = mods[modIndex].split("cf/");
    if (platformSPLT.length > 1) {
      mod0 = platformSPLT[1];
      modPlatform = "cf";
    } else {
      mod0 = platformSPLT[0];
      modPlatform = "mr";
    }
    const versionSPLT = mod0.split("@");
    if (versionSPLT.length > 1) {
      modVersion = versionSPLT[1];
      mod0 = versionSPLT[0];
    } else {
      modVersion = mcVersion;
    }

    // Check platforms and download accordingly
    if (modPlatform === "cf") {
      (await cf.get_game("minecraft"))
        .search_mods({
          searchFilter: mod0,
          gameVersion: modVersion,
          sortField: ModsSearchSortField.NAME,
        })
        .then((mods) => {
          for (const mod in mods) {
            if (mods[mod]["slug"] == mod0) {
              const latestFiles = mods[mod]["latestFiles"];
              for (const latestFile in latestFiles) {
                const file = latestFiles[latestFile];
                if (file["gameVersions"].includes("Fabric")) {
                  const downloadURL = file["downloadUrl"];
                  const name = file["fileName"];
                  const filename = path.join(modsPath, name);
                  if (!fs.pathExistsSync(filename)) {
                    console.error(
                      `Downloading CringeForge ${
                        modVersion || mcVersion
                      } Mod! *CF`
                    );
                    console.log(`${mod0} <== npm @ (node-curseforge)`);
                    download(downloadURL, filename);
                  } else {
                    console.error(`File ${filename}} already exists! *CF`);
                  }
                }
              }
            }
          }
        });
    } else {
      const url = `https://api.modrinth.com/v2/project/${mod0}/version?game_versions=["${
        modVersion || mcVersion
      }"]`;
      const response = await got(url);
      const results = JSON.parse(response.body);
      for (const result in results) {
        const file = results[result];
        if (file["loaders"].includes("fabric")) {
          let files = file["files"];
          if (files.length > 1) {
            files = file["files"].filter((x) => x["primary"] == true);
          }
          const downloadURL = files[0]["url"];
          const filename = path.join(modsPath, files[0]["filename"]);
          if (!(await fs.pathExists(filename))) {
            console.error(
              `Downloading YayRinth ${modVersion || mcVersion} Mod!`
            );
            console.log(`${mod0} <== (${url})`);
            download(downloadURL, filename);
          } else {
            console.error(`File ${filename} already exists!`);
          }
          break;
        }
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
