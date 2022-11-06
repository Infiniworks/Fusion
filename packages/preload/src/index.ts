/**
 * @module preload
 */
import { contextBridge, ipcRenderer } from "electron";
import * as fs from "fs-extra";

const please = {
  get: (arg1: never, arg2: never) => {
    return ipcRenderer.invoke("get", arg1, arg2);
  },
  send: (command: never, arg1: never) => {
    return ipcRenderer.send("greet", command, arg1);
  },
  onConsole: (callback: never) => ipcRenderer.on("consoleData", callback),
};

const db = {
  // writeJSON: async (file: never, key:never, data: never) => {
  //   await fs.ensureFile(file);
  //   const current = {};
  //   current[key] = data;
  //   await fs.writeJSON(file,current);
  // },
  overwriteJSON: (file: never, data: never) => {
    fs.outputFileSync(file,JSON.stringify(data));
  },
  appendJSON: async (file: never, key:never, data: never) => {
    await fs.ensureFile(file);
    const current:JSON = await fs.readJSON(file);
    current[key] = data;
    await fs.writeFile(file,JSON.stringify(current, null, "\t"));
    return;
  },
  readJSON: async (file: never) => {
    await fs.ensureFile(file);
    return await fs.readJSON(file);
  },
  prepareJSON: (file: never) => {
    fs.ensureFileSync(file);
    const current = fs.readFileSync(file);
    if (current.toString() == "") {
      fs.writeSync(file,"{}");
    }
    return;
  },
};

contextBridge.exposeInMainWorld("please", please);
contextBridge.exposeInMainWorld("dbTools", db);
