module.exports = class Player {
  constructor(UI) {
    const self = this;

    self._UI = UI;

    self._audioPlayer = new Audio();
    self._index = undefined;
    self._playInterval = undefined;
    self._isPaused = false;
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
    self._audioPlayer.onended = () => self.next(UI, Main);

    const prefix = process.platform === 'win32' ? '' : '/';
    self._index = Main.files.findIndex(song => {
      return (
        song.path.replace(/\\/g, '/') ===
        prefix + decodeURI(self._audioPlayer.src).split('///')[1]
      );
    });

    UI.updateUI(Main, self);
    UI.togglePlayButton(Main, self);
  }

  /**
   * @function next
   * @param {instance} UI - instance of view class
   * @param {instance} Main - instance of main class
   * @description Play next song in order.
   */
  next(UI, Main) {
    const self = this;
    if (self._index + 1 > Main.files.length) {
      return;
    } else if (self._index + 1 === Main.files.length) {
      self.stop(UI);
      return;
    }

    const next = Main.files[self._index + 1];
    self.play(next.path, UI, Main);
  }

  /**
   * @function previous
   * @param {instance} UI - instance of view class
   * @param {instance} Main - instance of main class
   * @description Plays previous song in order.
   */

  // TODO test, seems to work inconsistently
  previous(UI, Main) {
    const self = this;

    if (self._audioPlayer.currentTime >= 2.0) {
      self._audioPlayer.currentTime = 0;
      return;
    }

    if (self._index - 1 < 0) {
      return;
    } else {
      const previous = Main.files[self._index - 1];
      self.play(previous.path, UI, Main);
    }
  }

  /**
   * @function setVolume
   * @param {number} value - the value to set
   * @description Sets the players volume.
   */
  setVolume(value) {
    const self = this;
    self._audioPlayer.volume = value / 100;
  }

  stop(UI) {
    const self = this;
    self._audioPlayer.pause();
    self._audioPlayer.currentTime = 0;
    UI.resetUI();
  }

  playPause(Main, UI) {
    const self = this;

    if (self._isPaused) {
      self._audioPlayer.play();
      self._isPaused = false;
    } else {
      self._audioPlayer.pause();
      self._isPaused = true;
    }
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

  get isPaused() {
    const self = this;
    return self._isPaused;
  }
};
