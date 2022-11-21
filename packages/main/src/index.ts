import { restoreOrCreateWindow } from "/@/mainWindow";
const mcData = require("minecraft-data");
const os = require("os");
const { autoUpdater } = require("electron-updater");
const { app, ipcMain } = require("electron");
const isSingleInstance = app.requestSingleInstanceLock();
import * as path from "path";

import mods from "./mods.json";
import { disc } from "./modules/tools/hooks";
import { awaitUrl, getServerStats } from "./modules/server";
import { memoryGet } from "./modules/tools/essentials";
import { client, login } from "./modules/client";
import { iCollection } from "./modules/tools/api";
import { minecraftPath } from "./modules/extensions/paths";
const fs = require("fs-extra");

let currentVersion, serverUrl;
const klaw = require("klaw");

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
    await iCollection("defaults");
  })
  .catch((e) => console.error("Failed:", e));

// Big Daddy Handler v1
ipcMain.handle("get", async (event, command, arg1, arg2) => {
  switch (command) {
    case "devmode":
      return process.env.IS_DEV === "true";
    case "clients": {
      const clients: unknown [] = [];
      await fs.ensureDir(path.join(minecraftPath,"clients"));
      for await (const file of klaw(path.join(minecraftPath,"clients"), {depthLimit: 0})) {
        if (file.path != path.join(minecraftPath,"clients")) {
          clients.push(file.path.replace(path.join(minecraftPath,"clients"), ""));
        }
      }
      return clients;
    }
    case "collections": {
      const collectionsPath = path.join(minecraftPath,"collections");
      const collections: string [] = [];
      for await (const folder of klaw(collectionsPath, {depthLimit: 0})) {
        const collectionName = folder.path.replace(collectionsPath, "").replace("\\","");
        if (collectionName == "") continue;

        const collectionPath = path.join(collectionsPath, collectionName);
        const collection = {}; 
        for await (const collxion of klaw(collectionPath, {depthLimit: 0})) {
          if (collxion.path == collectionPath) continue;

          const subCollectionName = collxion.path
            .replace(collectionPath, "")
            .replace("\\","");
          if (subCollectionName == "") continue;

          collection[subCollectionName] = {
            "name": subCollectionName,
            "version": (await fs.readJSON(
              path.join(collectionPath, subCollectionName, "pack.json"),
            )).version,
          };
          

        }
        collections.push(`{"${collectionName}": ${JSON.stringify(collection)}}`);
      }
      return collections;
    }
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
    case "startClient": {
      let thisClient;
      console.log(arg2);
      switch (arg2.clientType) {
        case "collection": {
          thisClient = new client(path.join(minecraftPath, "collection", arg2.collection, arg2.client));
          break;
        }
        case "client": {
          thisClient = new client(path.join(minecraftPath, "clients", arg2.client));
          break;
        }
        default: {
          console.error("Error...");
        }
      }
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