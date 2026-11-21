import { join } from "node:path";

import {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  type IpcMainEvent,
  type NativeTheme,
  utilityProcess,
} from "electron";

import serverProcessPath from "../server-process/index?modulePath";
import { COLOR_MODE_CHOICE_CHANNEL } from "../shared/ipc-channels";

const WEB_DEV_SERVER_URL = "http://127.0.0.1:5173";

function isThemeSource(value: unknown): value is NativeTheme["themeSource"] {
  return value === "system" || value === "light" || value === "dark";
}

function isFromPage(event: IpcMainEvent) {
  return event.senderFrame?.origin === new URL(WEB_DEV_SERVER_URL).origin;
}

// Same values as the page theme (theme.css)
function getWindowColors() {
  return nativeTheme.shouldUseDarkColors
    ? { background: "#252525", foreground: "#cccccc" }
    : { background: "#ffffff", foreground: "#27272a" };
}

function startServerProcess() {
  const serverProcess = utilityProcess.fork(serverProcessPath, [], {
    serviceName: "workdome-server",
  });
  serverProcess.on("exit", (code) => {
    if (code !== 0) console.error(`Server process exited with code ${code}`);
  });
}

async function openMainWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: getWindowColors().background,
    autoHideMenuBar: true,
    // Hides the OS title bar but keeps the native window buttons
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#00000000",
      symbolColor: getWindowColors().foreground,
    },
    // Built from src/preload/index.ts
    webPreferences: {
      preload: join(import.meta.dirname, "../preload/index.cjs"),
    },
  });
  await window.loadURL(WEB_DEV_SERVER_URL);
}

function setThemeOnColorModeChoice() {
  ipcMain.on(COLOR_MODE_CHOICE_CHANNEL, (event, choice: unknown) => {
    if (isFromPage(event) && isThemeSource(choice)) {
      nativeTheme.themeSource = choice;
    }
  });
}

function repaintWindowButtonsOnColorModeChange() {
  nativeTheme.on("updated", () => {
    // setTitleBarOverlay exists only on Windows and Linux
    if (process.platform === "darwin") return;
    for (const window of BrowserWindow.getAllWindows()) {
      window.setTitleBarOverlay({ symbolColor: getWindowColors().foreground });
    }
  });
}

// Reopen a window when the dock icon is clicked with none open (macOS only event)
function reopenWindowOnActivate() {
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void openMainWindow();
    }
  });
}

async function startApp() {
  await app.whenReady();
  startServerProcess();
  setThemeOnColorModeChoice();
  repaintWindowButtonsOnColorModeChange();
  await openMainWindow();
  reopenWindowOnActivate();
}

// Quit when all windows close, except on macOS (apps stay in the dock there)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

void startApp().catch((error: unknown) => {
  console.error("Failed to start the app", error);
});
