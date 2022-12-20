/**
 * @module preload
 */
import { contextBridge, ipcRenderer } from "electron";
import * as fs from "fs-extra";
import { JsonDB, Config } from "node-json-db";

let memory:JSON = {};

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
  create: async (name: never, path: never) => {
    memory[name] = new JsonDB(new Config(path, true, true, "/"));
  },
  push: async (name:never, key:never, data: never) => {
    (memory[name]).push(key, data);
  },
  get: async (name) => {
    return memory;
    return await (memory[name]).getData("/");
  },
  overwriteSTRJSON: async (file: never, data: never) => {
    await fs.writeJSON(file,JSON.parse(data));
  },
  overwriteJSON: async (file: never, data: never) => {
    await fs.writeJSON(file, data);
  },
  appendJSON: async (file: never, key:never, data: never) => {
    await fs.ensureFile(file);
    const current:JSON = await fs.readJSON(file);
    current[key] = data;
    await fs.writeFile(file,JSON.stringify(current, null, "\t"));
    return;
  },
  readJSONS: async (file: never, safety: never) => {
    await fs.ensureFile(file);
    if (safety) {
      const jitTripping = await fs.readJSON(file);
      if (jitTripping.toString() == "") {
        await fs.writeJSON(file,JSON.parse("{}"));
      }
    }
    return await fs.readJSON(file);
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
