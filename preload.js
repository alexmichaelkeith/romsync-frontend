
const { ipcRenderer } = require('electron');
const { contextBridge } = require('electron');


// Expose Electron APIs to the window object via contextBridge
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: ipcRenderer,
    // Add any other Electron APIs you want to expose here
  });