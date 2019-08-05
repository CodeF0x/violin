class Main {
  constructor() {
    const { ipcRenderer } = require('electron');
    const View = require('./js/View');
    const view = new View(ipcRenderer, player, this);
    const self = this;

    self._files = [];
  }

  set files(files) {
    const self = this;
    self._files = files;
  }
}

new Main();
