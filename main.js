// this is for handling the installation of the app on Windows
const handleSetupEvents = require('./config/setup-events');
if (handleSetupEvents.handleSquirrelEvent()) {
  return;
}

const { app, BrowserWindow } = require('electron');
const { dialog } = require('electron');
const { ipcMain } = require('electron');
const openDirectory = require('./modules/open-directory');
let window = null;
let globalFiles = [];

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.setResizable(false);
  window.loadFile('src/index.html');
}

ipcMain.on('open-file-dialog', (event, path) => {
  dialog.showOpenDialog(
    window,
    {
      properties: ['openDirectory']
    },
    filePaths => {
      if (filePaths) {
        openDirectory(filePaths, event);
      }
    }
  );
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
