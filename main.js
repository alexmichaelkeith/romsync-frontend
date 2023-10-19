const { app, BrowserWindow, Tray, ipcMain } = require("electron");
const path = require("path");
const {
  scanDirectory,
  createFile,
  removeFile,
  readFile
} = require("./electron-services/file-process");
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

  ipcMain.on("minimize-main-window", event => {
    minimizeApp();
  });

  ipcMain.on("close-main-window", event => {
    app.quit();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});

// Main process
ipcMain.handle("scan-files", async (event, directoryPath) => {
  async function scanFiles() {
    try {
      const fileDetails = await scanDirectory(directoryPath);
      return fileDetails;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  return scanFiles();
});

ipcMain.handle("create-file", async (event, fileDetails) => {
  async function scanFiles() {
    try {
      await createFile(fileDetails);
      return "done";
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  return scanFiles();
});

ipcMain.handle("read-file", async (event, path) => {
  async function read(path) {
    try {
      return await readFile(path);
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  return read(path);
});
