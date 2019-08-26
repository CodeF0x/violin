(function() {
  const {
    app,
    BrowserWindow,
    globalShortcut,
    systemPreferences,
    Notification
  } = require('electron');

  const { dialog, ipcMain } = require('electron');
  const openDirectory = require('./modules/open-directory');
  let window = null;

  function createWindow() {
    window = new BrowserWindow({
      width: 800,
      minWidth: 800,
      height: 600,
      minHeight: 600,
      titleBarStyle: 'hidden',
      frame: false,
      useContentSize: false,
      webPreferences: {
        nodeIntegration: true
      }
    });

    window.setResizable(true);
    window.loadFile('src/index.html');
  }

  ipcMain.on('open-file-dialog', event => {
    dialog
      .showOpenDialog(window, {
        properties: ['openDirectory']
      })
      .then(contents => {
        const files = contents.filePaths;
        if (files.length > 0) {
          openDirectory(files, event);
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

  app.on('ready', () => {
    function registerShortcuts() {
      if (process.platform === 'darwin') {
        if (!systemPreferences.isTrustedAccessibilityClient(true)) {
          const not = new Notification({
            title: 'Violin',
            body:
              'Please add Violin as a trusted client, then click on this message or restart Violin.'
          });
          not.on('click', () => {
            app.relaunch();
            app.quit();
          });
          not.show();
        }
      }

      // TODO find a smoother way to register shortcuts
      globalShortcut.register('MediaPlayPause', () => {
        window.webContents.send('shortcut', 'MediaPlayPause');
      });

      globalShortcut.register('MediaNextTrack', () => {
        window.webContents.send('shortcut', 'MediaNextTrack');
      });

      globalShortcut.register('MediaPreviousTrack', () => {
        window.webContents.send('shortcut', 'MediaPreviousTrack');
      });
    }
    createWindow();
    registerShortcuts();
  });

  app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    app.quit();
  });
})();
