import got from "got";
import * as path from "path";
import * as util from "minecraft-server-util";
import { installFabric, getFabricLoaderArtifact} from "@xmcl/installer";
import { restoreOrCreateWindow } from "/@/mainWindow";

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

// Download Function
const { createWriteStream } = require("fs-extra");
const { promisify } = require("util");

const launcher = new Client();
const clientId = "1001858478618447952";
const rpc = new DiscordRPC.Client({ transport: "ipc" });
const startTimestamp = new Date();
const isSingleInstance = app.requestSingleInstanceLock();

const minecraftPath = path.join(__dirname, "..", "..", "..", "minecraft");
const resourcesPath = path.join(minecraftPath, "resources");

let currentVersion, serverUrl, authResult;


// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
let macCompatMode = true, skipMods = false;

import mods from "./mods.json";

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

const startClient = async (options) => {
  const startTime = performance.now();
  const installation = await install(options.modloader, options.version, options.clientName, options);
  const version = installation.versionName;

  const rootDir = path.join(
    minecraftPath,
    "instances",
    options.clientName,
  );

  const opts = {
    clientPackage: null,
    authorization: msmc.getMCLC().getAuth(options.authentication),
    root: rootDir,
    version: {
      number: options.version,
    },
    memory: {
      min: options.memMin,
      max: options.memMax,
    },
    javaPath: installation.java+".exe",
    overrides: {
      maxSockets: options.maxSockets,
      libraryRoot: path.join(resourcesPath, "libraries"),
      assetRoot: path.join(resourcesPath, "assets"),
      gameDirectory: path.join(minecraftPath, "shared"),
    },
    customArgs: [
      "-XX:+UseG1GC",
      "-XX:+ParallelRefProcEnabled", 
      "-XX:MaxGCPauseMillis=200", 
      "-XX:+UnlockExperimentalVMOptions", 
      "-XX:+DisableExplicitGC", 
      "-XX:+AlwaysPreTouch", 
      "-XX:G1NewSizePercent=30", 
      "-XX:G1MaxNewSizePercent=40", 
      "-XX:G1HeapRegionSize=8M", 
      "-XX:G1ReservePercent=20", 
      "-XX:G1HeapWastePercent=5", 
      "-XX:G1MixedGCCountTarget=4", 
      "-XX:InitiatingHeapOccupancyPercent=15", 
      "-XX:G1MixedGCLiveThresholdPercent=90", 
      "-XX:G1RSetUpdatingPauseTimePercent=5",
      "-XX:SurvivorRatio=32",
      "-XX:+PerfDisableSharedMem",
      "-XX:MaxTenuringThreshold=1",
      "-Dorg.lwjgl.util.Debug=true",
    ],
  };

  if (options.modloader == "forge") {
    opts["forge"] = path.join(rootDir,"forge.jar");
  }
  if (options.modloader == "fabric") {
    opts["version"]["custom"] = version;
  }

  console.error(`Starting Fusion Client ${version}!`);
  currentVersion = options.version;
  await setActivity("Minecraft " + options.version);

  console.error(`Time taken: ${(performance.now() - startTime).toFixed(2)}ms`);
  launcher.launch(opts);
  launcher.on("debug", (e) => {
    console.log(e);
  });
  launcher.on("data", (e) => {
    console.log(e);
    if (e.includes("[main/INFO]") || e.includes("[Render thread/INFO]")) {
      console.log(e);
    }
    if (e.includes("Sound engine started")) {
      console.error(`Total Launch Time taken: ${(performance.now() - startTime).toFixed(2)}ms`);
    }
  });
  launcher.on("close", async (e) => {
    console.log("Closed:", e);
    currentVersion = "Launcher Screen";
    await setActivity(currentVersion);
  });
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
  const pipeline = await promisify(stream.pipeline);
  await fs.ensureFile(dest);
  const downloadStream = got.stream(url);
  const fileWriterStream = await createWriteStream(dest);
  await pipeline(downloadStream, fileWriterStream);
};

const install = async (modloader, version, instance, fullOptions) => {
  let versionName;
  // Get Information
  const modloaderMatch = mods.filter(input => input.modloader === modloader)[0];
  const filteredResult = modloaderMatch.versions.filter(input => {
      const versionCheck = input.version === version;
      return versionCheck;
  });

  // Install Java
  const javaVersion  = filteredResult[0].java;
  const javaPath = path.join(minecraftPath, "java", javaVersion);
  const javaTemp = path.join(minecraftPath, "java", "temp");
  const arch = process.arch.replace("arm", "aarch");
  await getJava(javaVersion, javaPath, javaTemp, arch).then(() => console.log("Java installed!"));

  let java = path.join(javaPath, "bin", "javaw");

  if (process.platform === "darwin" && macCompatMode == false) {
    java = path.join(javaPath, "Contents", "Home", "bin", "java");
  }

  // Install Minecraft
  const loaderVersion = filteredResult[0].loaderVersion;
  const instancesPath = path.join(minecraftPath, "instances", instance);
  const modsPath = path.join(resourcesPath, "mods");
  version = filteredResult[0].version ? filteredResult[0].version : version;

  fs.remove(path.join(minecraftPath, "shared", "mods"));
  if (modloader == "fabric") {
    versionName = version + "-fabric" + loaderVersion;
    const versionList = await getFabricLoaderArtifact(version, loaderVersion);
    await installFabric(versionList, instancesPath).then((result) => {
      versionName = result;
      console.log("Fabric installed!");
    });
  }
  if (modloader == "forge") {
    await download(filteredResult[0].loaderUrl, path.join(instancesPath, "forge.jar"));
    console.log("Forge Installed!");
  }
  skipMods = fullOptions.skipMods;
  await Promise.allSettled(filteredResult[0].mods.map(async (mod) => {
    let modFilePath;
    const modVersion = mod.version ? mod.version : version;
    if (mod.source === "modrinth") {
      modFilePath = await getModrinthMod(mod.slug, modVersion, modsPath, modloader);
    }
    else if (mod.source === "curseforge") {
      modFilePath = await getCurseforgeMod(mod.slug, modVersion, modsPath, modloader);
    }
    else if (mod.source === "link") {
      modFilePath = path.join(modsPath,mod.name+".jar");
      if (!(await fs.pathExists(mod.name+".jar"))) {
        console.log(`Special download: ${mod.name}`);
        await download(mod.link, modFilePath);
      } else {
        console.log(`Special download already exists: ${mod.name}`); 
      }
    }
    if (mod.overrides) {
      const overrides = mod.overrides;
      if (overrides.filename) {
        const newFilename = path.join(path.dirname(modFilePath), overrides.filename);
        await fs.move(modFilePath, newFilename);
        modFilePath = newFilename;
      }
    }
    await fs.ensureSymlink(modFilePath, path.join(minecraftPath, "shared", "mods", path.basename(modFilePath)), "file");
  })).then(() => console.log("Mods installed!"));
  console.log("Installation complete!");

  return {
    java,
    javaPath,
    versionName,
  };
};

app.on("second-instance", restoreOrCreateWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", restoreOrCreateWindow);

app
  .whenReady()
  .then(async () => {
    console.log("App is ready!");
    if (import.meta.env.PROD) {
      console.log("Checking for updates:");
      autoUpdater.checkForUpdatesAndNotify();
    } else {
      console.log("Running in development mode.");
    }

    await restoreOrCreateWindow();
  })
  .catch((e) => console.error("Failed:", e));

DiscordRPC.register(clientId);

rpc.on("ready", async () => {
  await setActivity(currentVersion);

  setInterval(async () => {
    await setActivity(currentVersion);
  }, 6e1);
});

rpc.login({ clientId }).catch(console.error);

const getJava = async (javaVersion, javaPath, javaTemp, arch) => {
  if (await fs.exists(javaPath)) return;
  
  let operatingSystem = process.platform + "";
  if (operatingSystem == "win32") {
    operatingSystem = "windows";
  } else if (operatingSystem == "darwin" && macCompatMode == false) {
    operatingSystem = "mac";
  }
  const response = await got(
    `https://api.adoptium.net/v3/assets/latest/${javaVersion}/hotspot?image_type=jre&vendor=eclipse&os=${operatingSystem}&architecture=${arch}`,
  );
  const info = JSON.parse(response.body)[0];
  const filename = `jdk-${info.version.semver}-jre`;
  await download(
    info.binary.package.link,
    path.join(javaTemp, `${filename}.zip`),
  );
  await decompress(path.join(javaTemp, `${filename}.zip`), javaTemp).then(
    async (e) => {
      await fs.move(path.join(javaTemp, e[0].path), javaPath);
    },
  );
  
  await fs.remove(path.join(javaTemp));
};
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCurseforgeMod = async (mod, version, modsPath, loader) => {
  loader = capitalizeFirstLetter(loader);
  const url = `https://api.curseforge.com/v1/mods/search?gameId=432&gameVersion=${version}&slug=${mod}`;
  const response = await got(url,{
    headers: {
      "x-api-key": "$2a$10$rb7JRBpgV5mt33y9zxOcouYDxQFE4jj9xK5bZsKd.uky8LdZTgTuO",
    },
  });
  const mods = JSON.parse(response.body);
  const data = mods["data"][0];
  if (data["slug"] == mod) {
    const latestFiles = data["latestFiles"];
    for (const latestFile in latestFiles) {
      const file = data["latestFiles"][latestFile];
      if(file["gameVersions"].includes(loader) && file["gameVersions"].includes(version)) {
        const downloadURL = file["downloadUrl"];
        const name = file["fileName"] || `${mod}-${file["id"]}.jar`;
        const filename = path.join(modsPath, name);
        if (!(await fs.pathExists(filename))) {
          console.error(`Downloading CringeForge ${version} Mod! *CF`);
          console.log(`${mod} <== npm @ (node-curseforge)`);
          await download(downloadURL, filename);
          return filename;
        } else {
          console.error(`File ${filename} already exists! *CF`);
          return filename;
        }
      }
    }
  }
};

const getModrinthMod = async (mod, version, modsPath, loader) => {
  const url = `https://api.modrinth.com/v2/project/${mod}/version?game_versions=["${
    version
  }"]
  &loaders=["${loader}"]`;
  const response = await got(url);
  const results = JSON.parse(response.body);
  for (const result in results) {
    const file = results[result];
    let files = file["files"].filter((x) => x["primary"] == true);
    if (files.length < 1) {
      files = file["files"];
    }
    const downloadURL = files[0]["url"];
    const filename = path.join(modsPath, files[0]["filename"]);
    if (!(await fs.pathExists(filename))) {
      console.error(
        `Downloading Modrinth ${version} Mod!`,
      );
      console.log(`${mod} <== (${url})`);
      await download(downloadURL, filename);
      return filename;
    } else {
      console.error(`File ${filename} already exists!`);
      return filename;
    }
  }
};

const getVersions = (modloader) => {
  const versions = mods.filter(data => data.modloader == modloader)[0].versions;
  const versionList : string[] = [];
  versions.forEach((version) => versionList.push(version.version));
  return versionList;
};

const memoryGet = async (memory, identifier) => {
  switch (identifier) {
    case "B":
      return memory;
    case "K":
      return Math.round(memory / 1024);
    case "M":
      return Math.round(memory / 1024 / 1024);
    case "G":
      return Math.round(memory / 1024 / 1024 / 1024);
  }
};

// Big Daddy Handler v1
ipcMain.handle("get", async (event, command, arg1, arg2) => {
  switch (command) {
    case "devmode":
      return process.env.IS_DEV === "true";
    case "versions":
      return getVersions(arg1);
    case "mods":
      return mods;
    case "serverStats":
      return await getServerStats(arg1, arg2);
    case "minecraftVersions":
      return mcData.versions.pc;
    case "modloaders":
      return mods.map(data => data.modloader);
    case "freeMemory":
      return memoryGet(os.freemem(), arg1);
    case "maxMemory":
      return memoryGet(os.totalmem(), arg1);
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
  }
});