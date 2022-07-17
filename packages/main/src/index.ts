const { app, ipcMain } = require('electron');
const ngrok = require('ngrok');
import {restoreOrCreateWindow} from '/@/mainWindow';
import * as util from 'minecraft-server-util';
const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();
const msmc = require("msmc");
const os = require('os');
const mcData = require("minecraft-data");
let authResult;

const awaitUrl = new Promise(async (resolve, reject) => {
  const urlServer = await ngrok.connect({
      proto: 'tcp',
      addr: 25565,
      authtoken: '1r7Om4dKZGppn414jclOabclLsV_5MfjTVsiTBXmwQqZp7QBK',
  });
  if (urlServer) return resolve(urlServer);
  else return reject('urlServer fetch rejected');
});
/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */

app.on('activate', restoreOrCreateWindow);

/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error('Failed create window:', e));

if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

// Handlers
ipcMain.handle('startServerV2', async () => {
  return await awaitUrl;
});
ipcMain.handle('getServerStats', async (event, server, port) => {
  console.log(server,port);
  return await util.status(server, port, {
    timeout: 1000 * 5,
    enableSRV: true,
  })
  .then((result) => {return result;})
  .catch((error) => console.error(error));
});

ipcMain.handle('getDevmode', () => {
  return process.env.IS_DEV === 'true';
});

ipcMain.on('login', () => {
  msmc.fastLaunch("electron",
    (update) => { console.log(update) })
    .then(result => { authResult = result}
  );
})

ipcMain.on('startClient', (event, o) => {
  if (msmc.errorCheck(authResult)){
    console.log(authResult.reason)
    return;
  }
  const opts = {
      authorization: msmc.getMCLC().getAuth(authResult),
      root: "./minecraft",
      version: {
          number: o.version,
      },
      memory: {
          max: o.memMax,
          min: o.memMin,
      },
      window: {
        width: o.cliWidth,
        height: o.cliHeight,
        fullscreen: o.cliFullscreen,
      }
  }
  console.log("Starting!")
  launcher.launch(opts);

  launcher.on('debug', (e) => console.log(e));
  launcher.on('data', (e) => console.log(e));
});

ipcMain.handle('maxMemory', () => {
  return os.totalmem();
})

ipcMain.handle('getVersions', () => {
  return mcData.versions.pc;
})
