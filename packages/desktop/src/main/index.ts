import { app, BrowserWindow, nativeTheme } from "electron";

const backgroundColor = { light: "#fafafa", dark: "#18181b" };

function createWindow() {
  return new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: nativeTheme.shouldUseDarkColors
      ? backgroundColor.dark
      : backgroundColor.light,
  });
}

void app.whenReady().then(() => {
  createWindow();
  // Reopen a window when the dock icon is clicked with none open (macOS only event)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows close, except on macOS (apps stay in the dock there)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
