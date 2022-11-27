import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { URL } from "url";
import { devLog } from "./modules/tools/essentials";

const useDevTools = false;

async function createWindow() {
  const browserWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    frame: false,
    transparent: true,
    width: 1300,
    height: 800,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../../preload/dist/index.cjs"),
      nodeIntegration: true,
    },
  });

  browserWindow.on("ready-to-show", () => {
    ipcMain.on("greet", (event, command, arg1, arg2) => {
      switch (command) {
        case "window":
          if (arg1 === "destroy") app.quit();
          else if (arg1 === "resize") {
            if (browserWindow.isMaximized()) browserWindow.unmaximize();
            else browserWindow.maximize();
          }
          else if (arg1 === "minimize") browserWindow.minimize();
          if (arg2) {
            devLog(arg2);
          }
          break;
      }
    });
    ipcMain.on("reloadPage", () => {
      browserWindow.reload();
    });
    devLog("Window Loaded");
    browserWindow.show();

    if (import.meta.env.DEV && useDevTools) {
      browserWindow.webContents.openDevTools();
    }
  });
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          "../renderer/dist/index.html",
          "file://" + __dirname,
        ).toString();

  await browserWindow.loadURL(pageUrl);
  return browserWindow;
}

export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
