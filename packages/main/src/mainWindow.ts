import {BrowserWindow, ipcMain} from 'electron';
import {join} from 'path';
import {URL} from 'url';

async function createWindow() {
  const browserWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
      resizable: false,
      frame: false,
      transparent: true,
      width: 1500, height: 1000, 
      show:false,
      autoHideMenuBar: true,
      webPreferences: {
          preload: join(__dirname, '../../preload/dist/index.cjs'),
          nodeIntegration: true,
      },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    ipcMain.on("titlebar", (event, arg) => {
      if(arg === "destroy") browserWindow.destroy();
      else if(arg === "resize") {
          if(browserWindow.isMaximized()) browserWindow.unmaximize();
          else browserWindow.maximize();
      }
    })
    console.log("Window Loaded")

    browserWindow?.show();

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();


  await browserWindow.loadURL(pageUrl);

  return browserWindow;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
