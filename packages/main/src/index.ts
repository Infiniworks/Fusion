import { restoreOrCreateWindow } from "/@/mainWindow";
const mcData = require("minecraft-data");
const os = require("os");
const { autoUpdater } = require("electron-updater");
const { app, ipcMain } = require("electron");
const isSingleInstance = app.requestSingleInstanceLock();
import * as path from "path";

import mods from "./mods.json";
import { disc } from "./modules/hooks";
import { awaitUrl, getServerStats } from "./modules/server";
import { memoryGet } from "./modules/tools";
import { client } from "./modules/client";

let currentVersion, serverUrl;
const klaw = require("klaw");
const minecraftPath = path.join(__dirname, "..", "..", "..", "minecraft");

// Checks
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

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
    await disc.init();
  })
  .catch((e) => console.error("Failed:", e));

const thisClient = new client(path.normalize("C:\\Files\\Minecraft\\TestBench\\1.19"));

// Big Daddy Handler v1
ipcMain.handle("get", async (event, command, arg1, arg2) => {
  switch (command) {
    case "devmode":
      return process.env.IS_DEV === "true";
    case "clients":
      const clients = [];
      for await (const file of klaw(path.join(minecraftPath,"clients"), {depthLimit: 0})) {
        if (file.path != "C:\\Files\\Minecraft\\TestBench") {
          clients.push(file.path.replace("C:\\Files\\Minecraft\\TestBench\\", ""));
        }
      }
      return clients;
    case "collections":
      https://github.com/AlphaUpstream/FusionRepo/blob/main/defaults.zip
      const collections = []
      for await (const file of klaw(path.join(minecraftPath,"collections"), {depthLimit: 0})) {

        if (file.path != "C:\\Files\\Minecraft\\TestBench") {
          clients.push(file.path.replace("C:\\Files\\Minecraft\\TestBench\\", ""));
        }
      }
      return instances;
    case "serverStats":
      return await getServerStats(arg1, arg2);
    case "minecraftVersions":
      return mcData.versions.pc;
    case "modloaders":
      return mods.map((data) => data.modloader);
    case "freeMemory":
      return memoryGet(os.freemem(), arg1);
    case "maxMemory":
      return memoryGet(os.totalmem(), arg1);
    case "login":
      return await thisClient.login();
    case "startClient": {
      await thisClient.init(arg1);
      await thisClient.start();
      break;
    }
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