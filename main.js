const { app, BrowserWindow, Tray, ipcMain } = require("electron");
const path = require("path");
const { scanDirectory } = require('./electron-services/file-process')
let tray;

app.on("ready", () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
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

// Main process
ipcMain.handle('filesystem-scan', async (event, directoryPath) => {

  async function someAsyncFunction() {
    try {
      const fileDetails = await scanDirectory(directoryPath);
      return fileDetails
    } catch (err) {
      console.log(err)
      return []
  }}

  return someAsyncFunction()
})
