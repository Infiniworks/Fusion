// Import Modules
const { app, BrowserWindow, ipcMain} = require("electron")
const { join } = require("path")
const ngrok = require('ngrok');
const path = require("path")
if (require('electron-squirrel-startup')) {
    app.quit();
}
const electronReload = require("electron-reload");
electronReload(__dirname, {})

// Variables
const devmode = !app.isPackaged;
const isDev = process.env.IS_DEV === 'true';

// Functions
const awaitUrl = new Promise(async (resolve, reject) => {
    let urlServer = await ngrok.connect({   
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
    return process.env.IS_DEV === 'true';
}) 

// Ready Program
app.whenReady().then(() => {
    main()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) main();
    });
})

// Begin
function main () {
    // Create new window
    const window = new BrowserWindow ({
        titleBarStyle: 'hidden',
        resizable: false,
        frame: false,
        transparent: true,
        width: 1500, height: 1000, 
        show:false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.ts"),
            nodeIntegration: true,
        }
    })
    // If devmode, load local file, otherwise load the normal file.
    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
        window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        window.loadFile(join(__dirname, "../public/index.html"))
    }
    // When the window is ready, show it.
    window.on("ready-to-show", () => {
        ipcMain.on("titlebar", (event, arg) => {
            if(arg === "destroy") window.destroy();
            else if(arg === "resize") {
                if(window.isMaximized()) window.unmaximize();
                else window.maximize();
            }
        })
        console.log("Window Loaded")

        window.show()
        // Quit when all windows are closed, except on macOS.
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
    })
};