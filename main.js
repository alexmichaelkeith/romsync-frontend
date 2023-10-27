const { app, BrowserWindow, Tray, ipcMain } = require("electron");
const path = require("path");
const {
  scanDirectory,
  createFile,
  readFile
} = require("./file-process");
let tray;

let isWin = process.platform === "win32";
let isMac = process.platform === "darwin";
let IsLin = process.platform === "linux";

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
  if (isMac) {
    app.dock.hide();
  }
  mainWindow.loadFile(
    path.join(__dirname, "dist", "romfrontend", "index.html")
  );

  tray = new Tray(path.join(__dirname, "./src/assets/xxxTemplate.png"));
  tray.setIgnoreDoubleClickEvents(true);

  const trayClick = () => {
    if (mainWindow.isFocused()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  };

  tray.on("click", () => {
    trayClick();
  });



// IPC handling for requests from Angular

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

ipcMain.handle("scan-files", async (event, directoryPath) => {
  try{
    return await scanDirectory(directoryPath)
  }
  catch{
    err=>console.log(err)
  }
});

ipcMain.handle("create-file", async (event, fileDetails) => {
  try {
    await createFile(fileDetails);
    return 'File Created';
  } catch (error) {
    throw new Error('File not Created');
  }
});

ipcMain.handle("read-file", async (event, path) => {
  async function read(path) {
    try {
      return await readFile(path);
    } catch (err) {
      console.log(err);
      return;
    }
  }
  return read(path);
});
