const { contextBridge, ipcRenderer } = require("electron");

// API
contextBridge.exposeInMainWorld("api", {
    isDevMode: () => {
        return ipcRenderer.invoke("getDevmode")
    },
    titlebar: action => {
        ipcRenderer.send("titlebar", action);
    },
    getUrl: () => {
        return ipcRenderer.invoke("startServerV2")
    },
});