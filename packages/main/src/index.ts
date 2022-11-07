import { restoreOrCreateWindow } from "/@/mainWindow";
const mcData = require("minecraft-data");
const os = require("os");
const { autoUpdater } = require("electron-updater");
const { app, ipcMain } = require("electron");
const isSingleInstance = app.requestSingleInstanceLock();

import mods from "./mods.json";
import { disc } from "./modules/hooks";
import { awaitUrl, getServerStats } from "./modules/server";
import { memoryGet } from "./modules/tools";
import { getVersions, login, startClient } from "./modules/client";

let currentVersion, serverUrl;

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
      return mods.map((data) => data.modloader);
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