const { app, BrowserWindow } = require('electron');

if (require('electron-squirrel-startup')) app.quit();

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
    useContentSize: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.setResizable(true);
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
