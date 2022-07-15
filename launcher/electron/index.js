// Import Modules
const { app, BrowserWindow, ipcMain} = require("electron")
const { join } = require("path")
const ngrok = require('ngrok');
const path = require("path")

// Variables
const devmode = !app.isPackaged;

// Functions
const awaitUrl = new Promise(async (resolve, reject) => {
    urlServer = await ngrok.connect({   
        proto: 'tcp', 
        addr: 25565, 
        authtoken: "1r7Om4dKZGppn414jclOabclLsV_5MfjTVsiTBXmwQqZp7QBK" 
    })
    if (urlServer) return resolve(urlServer)
    else return reject("urlServer fetch rejected")
})

// Handlers
ipcMain.handle("startServerV2", async () => {
    return await awaitUrl
}) 
ipcMain.handle("getDevmode", () => {
    return !app.isPackaged;
}) 

// Ready Program
app.whenReady().then(main)

// Begin
function main () {
    const window = new BrowserWindow ({
        titleBarStyle: 'hidden',
        resizable: false,
        frame: false,
        transparent: true,
        width: 1500, height: 1000, 
        show:false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.ts")
        }
    })
    window.loadFile(join(__dirname, "../public/index.html"))
    window.on("ready-to-show", () => {
        window.show()
        if (devmode) window.webContents.openDevTools();
        ipcMain.on("titlebar", (event, arg) => {
            if(arg === "destroy") window.destroy();
            else if(arg === "resize") {
                if(window.isMaximized()) window.unmaximize();
                else window.maximize();
            }
        })
        app.on("window-all-closed", () => app.quit())
    })
};