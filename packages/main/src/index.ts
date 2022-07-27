// ES Imports
import got from "got";
import * as path from "path";
import * as util from "minecraft-server-util";
import { Curseforge } from "node-curseforge";
import { installFabric, getFabricLoaderArtifact } from "@xmcl/installer";
import { restoreOrCreateWindow } from "/@/mainWindow";
import { ModsSearchSortField } from "node-curseforge/dist/objects/enums";
// Const Imports
const decompress = require("decompress");
const DiscordRPC = require("discord-rpc-patch");
const fs = require("fs-extra");
const mcData = require("minecraft-data");
const msmc = require("msmc");
const ngrok = require("ngrok");
const os = require("os");
const stream = require("stream");
const { autoUpdater } = require("electron-updater");
const { app, ipcMain } = require("electron");
const { Client } = require("minecraft-launcher-core");
const { createWriteStream } = require("fs-extra");
const { promisify } = require("util");

const cf = new Curseforge(
  "$2a$10$Qdq6OGz.jQstDijKEkly0ee.XXygyKvZIakSvUyRcc1NLad7rT6fW"
);

const modsList = [
  "cf/better-controls", 
  "cf/sodium-shadowy-path-blocks",
  "cf/custom-splash-screen@1.18.2",
  "cf/vulkanmod",
  // "gh/xCollateral_VulkanMod$latest",
  "cf/logical-zoom",
  "cf/better-sodium-video-settings-button",
  "cf/recipe-cache",
  "cf/enhanced-block-entities",
  "cf/perspective-mod-redux",
  "cf/kappa",
  "cf/dark-loading-screen",

  "c2me-fabric",
  "cloth-config",
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
  "reeses-sodium-options",
  "appleskin",
  "amecs",
  "dynamic-fps",
  "indium",
  "borderless-mining",
  "morechathistory",
  "cull-less-leaves",
  "debugify",
  "purpurclient",
  "thorium",
  "continuity",
  "language-reload",
];

if (process.platform === "win32") {
  modsList.push("cf/vulkanmod@1.18.2");
}
if (process.platform === "darwin") {
  // Do nothing
}

const launcher = new Client();
const clientId = "1001858478618447952";
const rpc = new DiscordRPC.Client({ transport: "ipc" });
const startTimestamp = new Date();
const isSingleInstance = app.requestSingleInstanceLock();
const minecraftPath = path.join(__dirname, "..", "..", "..", "minecraft");

let currentVersion, serverUrl, authResult;

// Checks
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

// Async Functions
async function setActivity(activity) {
  rpc.setActivity({
    details: `Playing ${activity || "Launcher Screen"}`,
    buttons: [{ label: "Downloads", url: "https://github.com/AarushX/Fusion" }],
    startTimestamp,
    largeImageKey: "fusion",
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
  await msmc.fastLaunch("electron").then((result) => {
    authResult = result;
  });
  return JSON.stringify(authResult);
};

const startClient = async (o) => {
  const startTime = performance.now();
  const installation = await install(modsList);
  const version = installation.fabricName;
  let java;
  if (process.platform === "darwin") {
    java = path.join(installation.javaPath, "Contents", "Home", "bin", "java");
  } else {
    java = path.join(installation.javaPath, "bin", "javaw");
  }

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
      min: 1024 || o.memMin,
      max: 3072 || o.memMax,
    },
    javaPath: java,
    overrides: {
      maxSockets: o.maxSockets || 3,
    },
  };

  console.error(`Starting Fusion Client ${version}!`);
  currentVersion = o.version;
  await setActivity("Minecraft " + o.version);
  console.error(`Time taken: ${(performance.now() - startTime).toFixed(2)}ms`);
  launcher.launch(opts);
  launcher.on("debug", (e) => console.log(e));
  launcher.on("data", (e) => {
    console.log(e);
    if (e.includes("Sound engine started")) {
      console.error(`Total Launch Time taken: ${(performance.now() - startTime).toFixed(2)}ms`);
    }
    
  });
  launcher.on("close", (e) => {
    console.log("Closed:", e);
    currentVersion = "Launcher Screen";
    setActivity(currentVersion);
  });
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
  const javaVersion = "17";
  const arch = process.arch.replace("arm", "aarch");

  let os = process.platform + "";
  const mcVersion = 1.19 + "";
  let fabName = mcVersion + "-fabric" + fabricVersion;

  if (os == "win32") {
    os = "windows";
  } else if (os == "darwin") {
    os = "mac";
  }

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

  // Install Java
  const response = await got(
    `https://api.adoptium.net/v3/assets/latest/${javaVersion}/hotspot?image_type=jre&vendor=eclipse&os=${os}&architecture=${arch}`
  );
  const info = JSON.parse(response.body)[0];
  const filename = `jdk-${info.version.semver}-jre`;

  const javaTemp = path.join(minecraftPath, "java", "temp");
  const javaPath = path.join(minecraftPath, "java", javaVersion);
  if (!(await fs.pathExists(javaPath))) {
    await download(
      info.binary.package.link,
      path.join(javaTemp, `${filename}.zip`)
    );
    await decompress(path.join(javaTemp, `${filename}.zip`), javaTemp);
    await fs.move(path.join(javaTemp, filename), javaPath);
    await fs.remove(path.join(javaTemp));
  }
  console.log("Java installed!");

  // Install Mods
  for (const modIndex in mods) {
    let mod0, modPlatform, modVersion, complexVersion;

    // Parse mod info
    const platformSPLT = mods[modIndex].split("/");
    if (platformSPLT.length > 1) {
      mod0 = platformSPLT[1];
      modPlatform = platformSPLT[0];
    } else {
      mod0 = platformSPLT[0];
      modPlatform = "mr";
    }
    const complexSPLT = mod0.split("$");
    const versionSPLT = mod0.split("@");

    if (versionSPLT.length > 1) {
      modVersion = versionSPLT[1];
      mod0 = versionSPLT[0];
    } else if (complexSPLT.length > 1) {
      complexVersion = complexSPLT[2];
      modVersion = complexSPLT[1];
      mod0 = complexSPLT[0];
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
          //slug: mod0,
        })
      .then((mods) => {
        for (const mod in mods) {
          if (mods[mod]["slug"] == mod0) {
            const latestFiles = mods[mod]["latestFiles"];
            for (const latestFile in latestFiles) {
              const file = mods[mod][latestFile];
              console.log(file);
              if(file["gameVersions"].includes("Fabric") || file["gameVersions"].includes("fabric")) {
                const downloadURL = file["downloadUrl"];
                const name = file["fileName"] || `${file["slug"]}-${file["slug"]}.jar`;
                const filename = path.join(modsPath, name);
                if (!fs.pathExistsSync(filename)) {
                  console.error(`Downloading CringeForge ${modVersion || mcVersion} Mod! *CF`);
                  console.log(`${mod0} <== npm @ (node-curseforge)`);
                  download(downloadURL, filename);
                } else {
                  console.error(`File ${filename} already exists! *CF`);
                }
              }
            }
          }
      }});
    } else {
      const url = `https://api.modrinth.com/v2/project/${mod0}/version?game_versions=["${
        modVersion || mcVersion
      }"]
      &loaders=["fabric"]`;
      const response = await got(url);
      const results = JSON.parse(response.body);
      for (const result in results) {
        const file = results[result];
        if (
          !complexVersion ||
          file["version_number"].includes(complexVersion)
        ) {
          // || file["loaders"].includes("quilt") <-- removed quilt support temporarily
          let files = file["files"].filter((x) => x["primary"] == true);
          if (files.length < 1) {
            files = file["files"];
          }
          const downloadURL = files[0]["url"];
          const filename = path.join(modsPath, files[0]["filename"]);
          if (!(await fs.pathExists(filename))) {
            console.error(
              `Downloading Modrinth ${modVersion || mcVersion} Mod!`
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
  // Timer

  // Returns
  return {
    javaPath: javaPath,
    fabricName: fabName,
  };
};

app.on("second-instance", restoreOrCreateWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", restoreOrCreateWindow);

app
  .whenReady()
  .then(() => {
    console.log("App is ready!");
    if (import.meta.env.PROD) {
      console.log("Checking for updates:");
      autoUpdater.checkForUpdatesAndNotify();
    } else {
      console.log("Running in development mode.");
    }

    restoreOrCreateWindow();
    start();
  })
  .catch((e) => console.error("Failed:", e));

DiscordRPC.register(clientId);

rpc.on("ready", () => {
  setActivity(currentVersion);

  setInterval(() => {
    setActivity(currentVersion);
  }, 6e4);
});

rpc.login({ clientId }).catch(console.error);

// Big Daddy Handler v1
ipcMain.handle("get", async (event, command, arg1, arg2) => {
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
  }
});
