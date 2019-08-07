module.exports = class Player {
  constructor(UI) {
    const self = this;

    self._UI = UI;

    self._audioPlayer = new Audio();
    self._index = undefined;
    self._playInterval = undefined;
  }

  /**
   * @function play
   * @param {String} path - path to music file
   * @description Plays music file.
   */
  play(path, UI, Main) {
    const self = this;
    self._audioPlayer.src = path;
    self._audioPlayer.play();

    const prefix = process.platform === 'win32' ? '' : '/';
    const currentSong = Main.files.findIndex(song => {
      return (
        song.path === prefix + decodeURI(self._audioPlayer.src).split('///')[1]
      );
    });
    self._index = currentSong;

    UI.updateUI(Main, self);
  }

  get audioPlayer() {
    const self = this;
    return self._audioPlayer;
  }

  get index() {
    const self = this;
    return self._index;
  }

  set index(index) {
    const self = this;
    self._index = index;
  }
};
