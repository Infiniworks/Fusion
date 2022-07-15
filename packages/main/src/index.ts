const { app, ipcMain } = require("electron")
const ngrok = require('ngrok');
import {restoreOrCreateWindow} from '/@/mainWindow';

const awaitUrl = new Promise(async (resolve, reject) => {
  let urlServer = await ngrok.connect({   
      proto: 'tcp', 
      addr: 25565, 
      authtoken: "1r7Om4dKZGppn414jclOabclLsV_5MfjTVsiTBXmwQqZp7QBK" 
  })
  if (urlServer) return resolve(urlServer)
  else return reject("urlServer fetch rejected")
})
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
ipcMain.handle("startServerV2", async () => {
  return await awaitUrl
}) 
ipcMain.handle("getDevmode", () => {
  return process.env.IS_DEV === 'true';
}) 
