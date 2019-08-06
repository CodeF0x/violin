module.exports = class Player {
  constructor(UI) {
    const self = this;

    self._UI = UI;

    self._audioPlayer = new Audio();
    self._currentPlayback = undefined;
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
    self._currentPlayback = path;

    self._playInterval = setInterval(() => {
      UI.updateUI(self._audioPlayer, Main);
    }, 500);
  }

  get audioPlayer() {
    const self = this;
    return self._audioPlayer;
  }
};
