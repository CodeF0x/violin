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

    ipcRenderer.on('shortcut', (e, key) => {
      switch (key) {
        case 'MediaPlayPause':
          self._Player.playPause(self, self._UI);
          self._UI.togglePlayButton(self, self._Player);
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
   * @function sort
   * @param {event} e
   * @description Sorts alphabetically either name, album, or artist.
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
   * @function revertSorting
   * @description Reverts sorting to original order of files in directory.
   */
  revertSorting() {
    const self = this;
    self._UI.listFiles(self._filesOriginalOrder, false, self, self._Player);
    self._isSorted = false;
    self._files = [...self._filesOriginalOrder];
  }

  /**
   * @function backupFiles
   * @description Backups original files to revert sorting and shuffle play to original order.
   */
  backupFiles() {
    const self = this;
    if (self._filesOriginalOrder.length === 0) {
      self._filesOriginalOrder = [...self._files];
    }
  }

  _createTitlebar() {
    const { Titlebar, Color } = require('custom-electron-titlebar');
    const { Menu, MenuItem } = require('electron').remote;

    const titlebar = new Titlebar({
      backgroundColor: Color.fromHex('#0a416f'),
      icon: './img/icons/icon.png'
    });

    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Configuration',
      submenu: [
        {
          label: 'Toggle fancymode',
          click: () => console.log('Click')
        }
      ]
    }));

    titlebar.updateMenu(menu);
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
}

new Main();
