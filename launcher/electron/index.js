const { app, BrowserWindow, ipcMain} = require("electron")
const { join } = require("path")
const download = require('download');
const ngrok = require('ngrok');
const exec = require('child_process').execFile;
const url = require("url")
const fs = require('fs');
var path = require("path")



const platform = process.platform; 
const appFolder = app.getPath("appData")
const devmode = !app.isPackaged;

async function startTunnel() {
    const tunnel = await ngrok.connect({proto: 'tcp', addr: 25565, authtoken: "1r7Om4dKZGppn414jclOabclLsV_5MfjTVsiTBXmwQqZp7QBK"}).catch(e => console.error(e));
    return tunnel
};
//
app.whenReady().then(main)

// var file = 'https://github.com/AarushX/DerivativeMC/releases/download/1.19/HPFS_Setup.exe';
// var parsed = url.parse(file);
// var fileName = decodeURIComponent(path.basename(parsed.pathname))
// var filePath = `${__dirname}/tmp/`; 
// download(file,filePath)
// .then(
//     () => {
//         fs.rename("electron/tmp/"+fileName, "electron/tmp/"+"setup.exe", function(err) {
//             if ( err ) console.log('ERROR: ' + err);
//         });
//         exec("electron/tmp/"+fileName, 
//             function(err, data) { 
//                 console.log(err)
//                 console.log(data.toString());                       
//             }
//         );  
//     }
// )

// --------------------------------- \\

const install = () => exec(path.join(__dirname, "../../1.19/run.bat"), function(err, data) { console.log(err); console.log(data.toString());})

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
// Code to run on ready here
window.show()
if (devmode) window.webContents.openDevTools();
ipcMain.on("titlebar", (event, arg) => {
    if(arg === "destroy") window.destroy();
    else if(arg === "kill") app.quit();
    else if(arg === "minimize") window.minimize();
    else if(arg === "resize") {
        if(window.isMaximized()) window.unmaximize();
        else window.maximize();
    }
})
ipcMain.handleOnce("startServer", () => {
    // startServer()
    (async () => {
        return await startTunnel()
    })()
})

app.on("window-all-closed", () => app.quit())

// --------------------------------- \\
    })
};



