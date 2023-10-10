const { app, BrowserWindow, Tray } = require("electron");
const path = require("path");

let mainWindow;
let tray;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true, // Initially hide the window
    webPreferences: {
      nodeIntegration: true
    },
    skipTaskbar: true
  });
  
  app.dock.hide();
  // Load your Angular app's index.html
  mainWindow.loadFile(
    path.join(__dirname, "dist", "romfrontend", "index.html")
  );

  // Create a system tray icon
  tray = new Tray(path.join(__dirname, "./src/assets/xxxTemplate.png"));
  tray.setIgnoreDoubleClickEvents(true)


  const minimizeApp = () => {
	if (mainWindow.isVisible()) {
		mainWindow.hide();
	  } else {
		mainWindow.show();
	  }
  }

  tray.on("click", () => {
    minimizeApp();
  });

  mainWindow.on('minimize', (event) => {
	event.preventDefault();
    //minimizeApp();
  });

});

app.on("window-all-closed", () => {
  app.quit();
});
