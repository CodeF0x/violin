const { app, BrowserWindow } = require('electron');
const { dialog } = require('electron');
const { ipcMain } = require('electron');
let window;
let globalFiles = [];

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    maxWidth: 800,
    maxHeight: 600
  });

  window.loadFile('src/index.html');
}

ipcMain.on('open-file-dialog', (event, path) => {
  dialog.showOpenDialog(
    window,
    {
      properties: ['openDirectory']
    },
    filePaths => {
      openDirectory(filePaths, event);
    }
  );
});
app.on('ready', createWindow);

function openDirectory(path, event) {
  const fs = require('fs');
  globalFiles = [];

  fs.readdir(path[0], (err, files) => {
    files.forEach(file => {
      if (isSupported(file)) {
        globalFiles.push({
          name: file,
          path: path[0] + '/' + file
        });
      }
    });
    event.sender.send('music-files', globalFiles);
  });
}

function isSupported(file) {
  const parts = file.split('.');
  const format = parts[parts.length - 1].toLowerCase();
  switch (format) {
    case 'wav':
      return true;
    case 'mp3':
      return true;
    case 'mp4':
      return true;
    case 'adts':
      return true;
    case 'ogg':
      return true;
    case 'webm':
      return true;
    case 'flac':
      return true;
    default:
      return false;
  }
}
