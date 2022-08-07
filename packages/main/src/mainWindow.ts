import { BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { URL } from "url";

const useDevTools = false;

async function createWindow() {
  const browserWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    frame: false,
    transparent: true,
    width: 1120,
    height: 680,
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
          if (arg1 === "destroy") browserWindow.destroy();
          else if (arg1 === "resize") {
            if (browserWindow.isMaximized()) browserWindow.unmaximize();
            else browserWindow.maximize();
          }
          if (arg2) {
            console.log(arg2);
          }
          break;
      }
    });
    ipcMain.on("reloadPage", () => {
      browserWindow.reload();
    });
    console.log("Window Loaded");
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
