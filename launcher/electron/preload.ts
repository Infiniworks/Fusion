const { contextBridge, ipcRenderer } = require("electron");
// API
const WAPI = {
    titlebar: action => {
        ipcRenderer.send("titlebar", action);
    },
    async invoke () {
        return await ipcRenderer.invoke("startServer")
    },
}
contextBridge.exposeInMainWorld("api", WAPI);