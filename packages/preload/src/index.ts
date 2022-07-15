/**
 * @module preload
 */
export {}
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    isDevMode: () => {
        return ipcRenderer.invoke("getDevmode")
    },
    titlebar: (action: any) => {
        ipcRenderer.send("titlebar", action);
    },
    getUrl: () => {
        return ipcRenderer.invoke("startServerV2")
    },
})