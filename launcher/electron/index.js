// try {
// 	require('electron-reloader')(module);
// } catch {}

const { app, BrowserWindow, ipcMain} = require("electron")
const { join } = require("path")
const download = require('download');
const ngrok = require('ngrok');
const exec = require('child_process').execFile;
const url = require("url")
const fs = require('fs');
const path = require("path")

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

let serverUrl

const devmode = !app.isPackaged;

const x = new Promise(async (resolve, reject) => {
    urlServer = await ngrok.connect({   
        proto: 'tcp', 
        addr: 25565, 
        authtoken: "1r7Om4dKZGppn414jclOabclLsV_5MfjTVsiTBXmwQqZp7QBK" 
    })
    if (urlServer) {
        return resolve(urlServer)
    } else {
        return reject("urlServer fetch rejected")
    }
})

const getUrl = async () => {
    await x.then( (result) => 
    {
        const remark = result;
        console.log(remark)
        serverUrl = remark
        return remark
    })
}

// let lock = true;
// (async () => {
//     getUrl().then(() => {
//         lock = false
//     })
// })()

ipcMain.handle("startServer", async () => {
    await x.then( 
        (result) => 
    {
        console.log(result)
        return result
    })
}) 

ipcMain.handle("startServerV2", async () => {
    return await x
}) 

ipcMain.handle("reddit", async () => {
    await getUrl().then(() => {
        const mitsubishi = serverUrl
        console.log("index.js @ "+mitsubishi)
        return mitsubishi
    })
}) 

app.whenReady().then(main)


// const platform = process.platform; 
// const appFolder = app.getPath("appData")

// const unlock = async () => {
//     if (lock == true) {
//         lock = false
//         return true
//     }
//     else {
//         return false
//     }
// }



    // while (lock == true) {
    //     console.log(" "+lock)
    // }

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
// const install = () => exec(path.join(__dirname, "../../1.19/run.bat"), function(err, data) { console.log(err); console.log(data.toString());})

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
            else if(arg === "kill") app.quit();
            else if(arg === "minimize") window.minimize();
            else if(arg === "resize") {
                if(window.isMaximized()) window.unmaximize();
                else window.maximize();
            }
        })
        app.on("window-all-closed", () => app.quit())
    })
};



