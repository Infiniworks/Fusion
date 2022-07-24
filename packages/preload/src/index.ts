/**
 * @module preload
 */
export {};
import { contextBridge, ipcRenderer } from "electron";

const api = {
  isDevMode: () => {
    return ipcRenderer.invoke("getDevmode");
  },
  titlebar: (action: unknown) => {
    ipcRenderer.send("titlebar", action);
  },
  getUrl: () => {
    return ipcRenderer.invoke("startServerV3");
  },
  checkUrl: () => {
    return ipcRenderer.invoke("startServerV3");
  },
  getServerStats: (server: string, port: number) => {
    return ipcRenderer.invoke("getServerStats", server, port);
  },
  getMods: (client: string) => {
    return ipcRenderer.invoke("getMods", client);
  },
  login: () => {
    return ipcRenderer.invoke("login");
  },
  startClient: (o: JSON) => {
    ipcRenderer.send("startClient", o);
  },
  totalMemory: () => {
    return ipcRenderer.invoke("maxMemory");
  },
  getVersions: () => {
    return ipcRenderer.invoke("getVersions");
  },
  getConsoleLogs: () => {
    return ipcRenderer.invoke("getConsoleLogs");
  },
  reloadPage: () => {
    ipcRenderer.send("reloadPage");
  },
};
const please = {
  get: (arg1: never, arg2: never) => {
    return ipcRenderer.invoke("get", arg1, arg2);
  },
};

contextBridge.exposeInMainWorld("api", api);
contextBridge.exposeInMainWorld("please", please);
