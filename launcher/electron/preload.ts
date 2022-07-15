const { contextBridge, ipcRenderer } = require("electron");
// API
contextBridge.exposeInMainWorld("api", {
    titlebar: action => {
        ipcRenderer.send("titlebar", action);
    },
    getUrl: () => {
        return ipcRenderer.invoke("startServerV2")
    },
});