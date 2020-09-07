/** Represents application itself */
class Main {
  constructor() {
    const { ipcRenderer } = require('electron');
    const View = require('./js/View');
    const Play = require('./js/Player');

    const self = this;
    self._Player = new Play();
    self._UI = new View(ipcRenderer, self, self._Player);

    self._sortedBy = undefined;

    self._originalFiles = [];
    self._files = [];

    self._titlebar = undefined;

    ipcRenderer.on('shortcut', (e, key) => {
      if (!self._Player.audioPlayer.src) {
        return;
      }

      switch (key) {
        case 'MediaPlayPause':
          self._Player.playPause(self, self._UI);
          self._UI.togglePlayButton(self._Player);
          break;
        case 'MediaNextTrack':
          self._Player.next(self._UI, self);
          self._UI.updateUI(self, self._Player);
          break;
        case 'MediaPreviousTrack':
          self._Player.previous(self._UI, self);
          self._UI.updateUI(self, self._Player);
      }
    });

    self._createTitlebar();
  }

  /**
   * Sorts alphabetically.
   * @param {Event} e 
   */
  sort(e) {
    const self = this;

    self._files = self._UI.updateSongListMetaData(self);

    if (self._sortedBy === e.target) {
      self.revertSorting();
      self._UI.unmarkSort(e.target);
      self._sortedBy = undefined;
      return;
    } else {
      self._UI.unmarkSort(self._sortedBy);
      self._UI.markSort(e.target);
      self._sortedBy = e.target;
    }

    self.backupFiles();

    const whatToSort = e.target.innerText.toLowerCase();
    self._files.sort((a, b) => {
      if (a[whatToSort] < b[whatToSort]) return -1;
      if (a[whatToSort] > b[whatToSort]) return 1;
      return 0;
    });

    self._UI.listFiles(self._files, false, self, self._Player);
  }

  /**
   * Reverts sorted playlist to original state.
   */
  revertSorting() {
    const self = this;
    self._UI.listFiles(self._originalFiles, false, self, self._Player);
    self._isSorted = false;
    self._files = [...self._originalFiles];
  }

  /**
   * Caches playlist.
   */
  backupFiles() {
    const self = this;
    if (self._originalFiles.length === 0) {
      self._originalFiles = [...self._files];
    }
  }

  /**
   * Creates custom title bar instead of OS default.
   */
  _createTitlebar() {
    const { Titlebar, Color } = require('custom-electron-titlebar');
    const { Menu, MenuItem } = require('electron').remote;

    const self = this;

    self._titlebar = new Titlebar({
      backgroundColor: Color.fromHex('#002a4d'),
      icon: './img/icons/icon.png'
    });

    const menu = new Menu();

    const checked =
      localStorage.getItem('fancy-titlebar-enabled') === 'true' ? true : false;
    const config = {
      label: 'Color changing title bar',
      type: 'checkbox',
      checked: checked,
      click: function() {
        config.checked = !config.checked;
        localStorage.setItem('fancy-titlebar-enabled', config.checked);
        self._UI.updateTitlebarColor(self, self._UI.albumCoverImage);

        /**
         * To update the little tick icon, the whole menu must be updated :/
         */
        const newMenu = new Menu();
        const newSecondaryItem = new MenuItem({
          label: 'Configuration',
          submenu: [config]
        });

        if (process.platform === 'darwin') {
          newMenu.append(mainItem);
        }
        newMenu.append(newSecondaryItem);
        self._titlebar.updateMenu(newMenu);
      }
    };

    let mainItem = new MenuItem({
      label: 'Configuration',
      submenu: [config]
    });

    let secondaryItem = undefined;

    if (process.platform === 'darwin') {
      mainItem = new MenuItem({
        label: require('electron').remote.app.name,
        submenu: [
          {
            role: 'quit',
            accelerator: 'Cmd+Q'
          }
        ]
      });

      secondaryItem = new MenuItem({
        label: 'Configuration',
        submenu: [config]
      });
    }

    menu.append(mainItem);
    if (secondaryItem) {
      menu.append(secondaryItem);
    }

    self._titlebar.updateMenu(menu);
  }

  set files(files) {
    const self = this;
    self._files = files;
  }

  get files() {
    const self = this;
    return self._files;
  }

  set sortedBy(sortedBy) {
    const self = this;
    self._sortedBy = sortedBy;
  }

  get originalFiles() {
    const self = this;
    return self._originalFiles;
  }

  set originalFiles(files) {
    const self = this;
    self._originalFiles = files;
  }

  get titlebar() {
    const self = this;
    return self._titlebar;
  }
}

new Main();
