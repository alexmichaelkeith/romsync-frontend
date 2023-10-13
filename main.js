const { app, BrowserWindow, Tray, ipcMain } = require("electron");
const path = require("path");
const fs = require('fs');

let tray;

app.on("ready", () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "src/preload.js")
    },
    resizable: false,
    skipTaskbar: true,
    frame: false
  });

  app.dock.hide();
  mainWindow.loadFile(
    path.join(__dirname, "dist", "romfrontend", "index.html")
  );

  tray = new Tray(path.join(__dirname, "./src/assets/xxxTemplate.png"));
  tray.setIgnoreDoubleClickEvents(true);

  const minimizeApp = () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  };

  tray.on("click", () => {
    minimizeApp();
  });

  ipcMain.on("minimize-main-window", (event) => {
    minimizeApp();
  });

  ipcMain.on("close-main-window", (event) => {
    app.quit();
  });

});

app.on("window-all-closed", () => {
  app.quit();
});



ipcMain.on('scan-directory', (event, directoryPath) => {
  scanDirectory(directoryPath);
});
