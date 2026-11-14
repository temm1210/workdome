import { app, BrowserWindow, nativeTheme } from "electron";

const webDevServerUrl = "http://127.0.0.1:5173";

function createWindow() {
  return new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#18181b" : "#fafafa",
  });
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
  await window.loadURL(webDevServerUrl);
  reopenWindowOnActivate(webDevServerUrl);
}

// Quit when all windows close, except on macOS (apps stay in the dock there)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

void startApp().catch((error: unknown) => {
  console.error("Failed to start the app", error);
});
