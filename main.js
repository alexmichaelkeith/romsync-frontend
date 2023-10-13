const { app, BrowserWindow, Tray, ipcMain } = require("electron");
//import {app, BrowserWindow, Tray, ipcMain } from "electron"
//import { path } from 'path'
//import { fs } from 'fs'
const path = require("path");
const fs = require('fs');
//import { API_URL } from 'src/app/constants';
//let mainWindow: any;
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



// Schedule directory scanning every minute
setInterval(() => {
  console.log('croning')
  //scanDirectory();
}, 10000); // 100000 milliseconds = 10 seconds




});

app.on("window-all-closed", () => {
  app.quit();
});




ipcMain.on('scan-directory', (event, directoryPath) => {
  //scanDirectory();
});
