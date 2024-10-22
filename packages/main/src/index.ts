import { restoreOrCreateWindow } from "/@/mainWindow";
const mcData = require("minecraft-data");
const os = require("os");
const { autoUpdater } = require("electron-updater");
const { app, ipcMain } = require("electron");
const isSingleInstance = app.requestSingleInstanceLock();
import * as path from "path";
const msmc = require("msmc");
const _ = require("lodash");

import mods from "./mods.json";
import { disc } from "./modules/tools/hooks";
import { awaitUrl, getServerStats } from "./modules/server";
import { devLog, memoryGet, noHidden } from "./modules/tools/essentials";
import { client, login, packData } from "./modules/client";
import { iCollection } from "./modules/tools/api";
import { appFolder, minecraftPath, resources } from "./modules/extensions/paths";
import { delim, osmac } from "./modules/extensions/constants";
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
    await iCollection("defaults");
    // await iCollection("performance");
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

      for await (const folder of klaw(collectionsPath, {depthLimit: 0, filter: noHidden})) {
        const collectionName = folder.path.replace(collectionsPath, "").replace(delim,"");
        if (collectionName == "") continue;
        if (osmac && (collectionName == ".DS_Store")) {
          continue;
        }
        const collectionPath = path.join(collectionsPath, collectionName);
        const collection = {}; 
        for await (const collxion of klaw(collectionPath, {depthLimit: 0, filter: noHidden})) {
          if (collxion.path == collectionPath) continue;

          const subCollectionName = collxion.path
            .replace(collectionPath, "")
            .replace(delim,"");
          if (subCollectionName == "") continue;

          const contents = await fs.readJSON(
            path.join(
              collectionPath, subCollectionName, "pack.json",
              ),
          );
          
          collection[subCollectionName] = {
            "name": subCollectionName,
            "version": contents.version,
            "verified": contents.verified,
            "info": JSON.stringify(contents),
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
    case "intercept_and_log": {
      console.log(command, arg1, arg2);
      return;
    }      
    case "startClient": {
      arg2 = arg1[1];
      arg1 = arg1[0];
      let thisClient;
      switch (arg2.clientType) {
        case "collection": {
          thisClient = new client(path.join(minecraftPath, "collections", arg2.collection, arg2.client));
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
      const started = await thisClient.start();
      console.log(started);
      return started;
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
    case "defaults": {
      switch (arg1) {
        case "res": return resources;
        default: return appFolder;
      }
    }
    case "ensure": {
      const pth = path.join(resources, arg1);
      
      try {
        await fs.readJson(pth);
      } catch (err) {
        fs.writeJSON(pth, {});
      } 
      await fs.ensureFile(pth);

      return pth;
    }
    case "refreshUsers": {
      // Neutrino Loader v3
      // v1 normal accounts do things
      // v2 auto refreshes accounts
      // v3 removes duplicate accounts and keeps latest
      const newUsers: unknown[] = [];

      if (JSON.stringify(arg1)=="{}" || !arg1) return {};


      // Reverse in order to allow the most recent things first
      arg1 = arg1.reverse();
      const argxusers: string[] = [];

      for (let index = 0; index < arg1.length; ++index) {
        const user = arg1[index];
        if (JSON.stringify(user) == "{}") continue;

        // Exit out of the cycle if the username is already in the list
        if (argxusers.includes(user.username)) continue;
        argxusers.push(user.username);

        const gotAuth = await msmc.getMCLC().getAuth(user.data);

        const accountValid = await msmc.getMCLC().validate(gotAuth);

        // Console log if account valid or not
        const refId = accountValid
        ? `Account ${user.username} Valid.`
        : `Account ${user.username} Invalid. Refreshing.`;
        devLog(refId);

        // If the account is valid, keep it the same
        // otherwise refresh the token and account.
        const refAuth = accountValid
        ? gotAuth 
        : await msmc.getMCLC().refresh(gotAuth);

        // Create then combine the new profile with the object system
        // we use for authentication
        const prof = await msmc.getMCLC().toProfile(refAuth);
        user.data.profile = _.merge(user.data.profile,prof);
        user.data.access_token = prof._msmc.mcToken;
        newUsers.push(user);
      }
      // Return the redone list so that the most recent things are last
      // like they would have been added in the panel.
      return newUsers.reverse();
    }
    // arg1 is the whole user from globalData.users that is selected / loaded
    case "validateUser": {
      const gotAuth = await require("msmc").getMCLC().getAuth(arg1.data);
      return await require("msmc").getMCLC().validate(gotAuth);
    }
    case "data": {
      return (await packData(arg1));
    }
  }
});