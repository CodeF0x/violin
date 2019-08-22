module.exports = class Player {
  constructor(UI) {
    const self = this;

    self._UI = UI;

    self._audioPlayer = new Audio();
    self._index = undefined;
    self._playInterval = undefined;
    self._isPaused = false;
    self._repeat = false;
    self._isShuffled = false;
  }

  /**
   * @function play
   * @param {String} path - path to music file
   * @param {instance} UI - instance of view class
   * @param {instance} Main - instance of main class
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
    let next = -1;

    if (self._index + 1 === Main.files.length && self._repeat) {
      next = 0;
    } else if (self._index + 1 === Main.files.length) {
      self.stop(UI);
      return;
    } else {
      next = self._index + 1;
    }

    self.play(Main.files[next].path, UI, Main);
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

  /**
   * @function stop
   * @param {instance} UI - instance of View class
   * @description Stops the playback.
   */
  stop(UI) {
    const self = this;
    self._audioPlayer.pause();
    self._audioPlayer.currentTime = 0;
    UI.resetUI();
  }

  /**
   * @function playPause
   * @param {instance} Main - instance of main class
   * @param {instance} UI - instance of ui class
   * @description Toggles between play and pause of playback.
   */
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

  /**
   * @function setProgress
   * @param {number} percent - current time in percent
   * @description Sets the current time to value of progress bar, when clicked on progress bar.
   */
  setProgress(percent) {
    const self = this;
    self._audioPlayer.currentTime = percent * self._audioPlayer.duration;
  }

  toggleShuffle(Main, UI) {
    const self = this;
    if (self._isShuffled) {
      self._shuffle(Main, UI);
    } else {
      self._unshuffle();
    }
  }

  _shuffle(Main, UI) {
    function shuffleFiles(files) {
      for (let i = files.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [files[i], files[j]] = [files[j], files[i]];
      }
      return files;
    }

    Main.files = UI.updateSongListMetaData(Main);
    Main.originalFiles = Main.files.slice('');
    Main.files = shuffleFiles(Main.files);
  }

  _unshuffle() {
    Main.files = Main.originalFiles;
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

  set repeat(bool) {
    self = this;
    self._repeat = bool;
  }

  get repeat() {
    const self = this;
    return self._repeat;
  }

  get isShuffled() {
    const self = this;
    return self._isShuffled;
  }

  set isShuffled(bool) {
    const self = this;
    self._isShuffled = bool;
  }
};
