/**
 * @module preload
 */
import { contextBridge, ipcRenderer } from "electron";

const please = {
  get: (arg1: never, arg2: never) => {
    return ipcRenderer.invoke("get", arg1, arg2);
  },
  send: (command: never, arg1: never) => {
    return ipcRenderer.send("greet", command, arg1);
  },
  onConsole: (callback: never) => ipcRenderer.on("consoleData", callback),
};

contextBridge.exposeInMainWorld("please", please);
