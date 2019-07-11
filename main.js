const {
  app,
  BrowserWindow,
  globalShortcut,
  Notification
} = require('electron');

if (require('electron-squirrel-startup')) app.quit();

const { dialog, ipcMain } = require('electron');
const openDirectory = require('./modules/open-directory');
let window = null;

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

app.on('ready', () => {
  let failedShortcut = false;
  createWindow();

  // TODO find a smoother way to register shortcuts
  try {
    globalShortcut.register('MediaPlayPause', () => {
      window.webContents.send('shortcut', 'MediaPlayPause');
    });

    globalShortcut.register('MediaNextTrack', () => {
      window.webContents.send('shortcut', 'MediaNextTrack');
    });

    globalShortcut.register('MediaPreviousTrack', () => {
      window.webContents.send('shortcut', 'MediaPreviousTrack');
    });
  } catch (e) {
    if (Notification.isSupported) {
      const not = new Notification(
        "Couldn't register media shortcuts 😞. Please check if another app (e. g. Spotify) is running and close it. If you don't want to use media keys, ignore this message."
      );
      not.show();
    }
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
