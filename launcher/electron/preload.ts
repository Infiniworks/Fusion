const { contextBridge, ipcRenderer, BrowserWindow} = require("electron");
// API
contextBridge.exposeInMainWorld(
    "api", {
        titlebar: action => {
            ipcRenderer.send("titlebar", action);
        }
    }
);

contextBridge.exposeInMainWorld(
    "server", {
        start: (channel) => {
            ipcRenderer.invoke("startServer");
        },
    }
);
