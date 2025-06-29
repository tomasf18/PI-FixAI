
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { screen } = require('electron');

function createWindow() {

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  // For development:
  win.loadURL('http://localhost:5173');

  // For production:
  // win.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);

}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
