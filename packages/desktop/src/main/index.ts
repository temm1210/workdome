import {
  app,
  BrowserWindow,
  dialog,
  nativeTheme,
  utilityProcess,
  type UtilityProcess,
} from "electron";

import type { ServerProcessMessage } from "./server-process.ts";
import serverProcessPath from "./server-process?modulePath";

const webDevServerUrl = "http://127.0.0.1:5173";

function createWindow() {
  return new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#18181b" : "#fafafa",
  });
}

function forkServerProcess() {
  return utilityProcess.fork(serverProcessPath, [], {
    serviceName: "workdome-server",
  });
}

// Resolves with the server URL, rejects if the process exits before sending it
function waitForServerUrl(serverProcess: UtilityProcess): Promise<string> {
  return new Promise((resolve, reject) => {
    serverProcess.once("exit", (code: number) => {
      reject(
        new Error(`Server process exited before it was ready (code ${code})`),
      );
    });
    serverProcess.once("message", ({ url }: ServerProcessMessage) => {
      resolve(url);
    });
  });
}

function stopServerOnQuit(serverProcess: UtilityProcess) {
  app.on("before-quit", () => {
    // Exiting on quit is not a startup failure
    serverProcess.removeAllListeners("exit");
    serverProcess.kill();
  });
}

function quitWithServerError(error: unknown) {
  dialog.showErrorBox("Failed to start the server", String(error));
  app.quit();
}

function getPageUrl(serverUrl: string) {
  return app.isPackaged ? serverUrl : webDevServerUrl;
}

// Reopen a window when the dock icon is clicked with none open (macOS only event)
function reopenWindowOnActivate(pageUrl: string) {
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow().loadURL(pageUrl);
    }
  });
}

async function startApp() {
  await app.whenReady();
  const window = createWindow();

  const serverProcess = forkServerProcess();
  stopServerOnQuit(serverProcess);

  let serverUrl: string;
  try {
    serverUrl = await waitForServerUrl(serverProcess);
  } catch (error) {
    quitWithServerError(error);
    return;
  }

  const pageUrl = getPageUrl(serverUrl);
  await window.loadURL(pageUrl);
  reopenWindowOnActivate(pageUrl);
}

// Quit when all windows close, except on macOS (apps stay in the dock there)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

void startApp().catch((error: unknown) => {
  console.error("Failed to start the app", error);
});
