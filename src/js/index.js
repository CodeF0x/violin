class Main {
  constructor() {
    const { ipcRenderer } = require('electron');
    const View = require('./js/View');

    const self = this;
    self._Player = new require('./js/Player');
    self._UI = new View(ipcRenderer, self, self._Player);

    self._isShuffle = false;
    self._sortedBy = undefined;

    self._filesOriginalOrder = [];
    self._files = [];
  }

  /**
   * @function sort
   * @param {event} e
   * @description Sorts alphabetically either name, album, or artist.
   */
  sort(e) {
    const self = this;

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

    self._files = self._UI.updateSongListMetaData(self);

    self.backupFiles();

    const whatToSort = e.target.innerText.toLowerCase();
    self._files.sort((a, b) => {
      if (a[whatToSort].toLowerCase() < b[whatToSort].toLowerCase()) return -1;
      if (a[whatToSort].toLowerCase() > b[whatToSort].toLowerCase()) return 1;
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

  set files(files) {
    const self = this;
    self._files = files;
  }

  get files() {
    const self = this;
    return self._files;
  }
}

new Main();
