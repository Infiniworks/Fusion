const { contextBridge, ipcRenderer, BrowserWindow} = require("electron");
// API
contextBridge.exposeInMainWorld(
    "api", { // "api" (Renamable)
        titlebar: action => {
            ipcRenderer.send("titlebar", action);
        }
    }
);

contextBridge.exposeInMainWorld(
    "server", { // "api" --> rename it to anything you want
        start: (channel, data) => {
            ipcRenderer.send("closeServer");
        },
    }
);
