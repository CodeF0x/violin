/** Representation of audio capabilities. */
module.exports = class Player {
  /**
   * Set up.
   * @param {Object} UI 
   */
  constructor(UI) {
    const self = this;

    self._UI = UI;

    self._audioPlayer = new Audio();
    self._index = undefined;
    self._playInterval = undefined;
    self._repeat = false;
    self._isShuffled = false;
  }

  /**
   * Plays a given song.
   * @param {string} path 
   * @param {Object} UI 
   * @param {Object} Main 
   */
  play(path, UI, Main) {
    const self = this;
    self._audioPlayer.onended = () => self.next(UI, Main);
    self._audioPlayer.src = path;
    self._audioPlayer
      .play()
      .then(() => {
        const prefix = process.platform === 'win32' ? '' : '/';

        self._index = Main.files.findIndex(song => {
          return (
            song.path.replace(/\\/g, '/') ===
            prefix + decodeURI(self._audioPlayer.src).split('///')[1]
          );
        });

        UI.updateUI(Main, self);
        UI.togglePlayButton(self);
      })
      .catch(err => err); // When playlist has ended, playing the first song and then immediately pausing it causes an exception?
  }

  /**
   * Plays next song in order.
   * @param {Object} UI 
   * @param {Object} Main 
   */
  next(UI, Main) {
    const self = this;
    let next = -1;

    if (self._index + 1 === Main.files.length && self._repeat) {
      next = 0;
    } else if (self._index + 1 === Main.files.length) {
      self.preloadHead(UI, Main);
      return;
    } else {
      next = self._index + 1;
    }

    self.play(Main.files[next].path, UI, Main);
  }

  /**
   * Plays previous song in order or resets current song.
   * @param {Object} UI 
   * @param {Object} Main 
   */
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
   * Sets playback volume.
   * @param {number} value 
   */
  setVolume(value) {
    const self = this;
    self._audioPlayer.volume = value / 100;
  }

  /**
   * Stops playback completely.
   * @param {Object} UI 
   */
  stop(UI) {
    const self = this;
    self._audioPlayer.pause();
    self._audioPlayer.currentTime = 0;
    UI.resetUI();
  }

  /**
   * Preloads first song of playlist.
   * @param {Object} UI 
   * @param {Object} Main 
   */
  preloadHead(UI, Main) {
    const self = this;
    const cachedVolume = self._audioPlayer.volume;

    /**
     * todo this is a very hacky solution, especially with 100 milliseconds. Replace asap!
     */
    self._audioPlayer.volume = 0;
    self.play(Main.files[0].path, UI, Main);
    setTimeout(() => {
      const resetVolume = () => self.audioPlayer.volume = cachedVolume;
      self.playPause();
      resetVolume();
      UI.togglePlayButton(self);
    }, 100);
  }

  /**
   * Either pauses or resumes playback.
   */
  playPause() {
    const self = this;

    const isPaused = self.isPaused;
    if (isPaused) {
      self._audioPlayer.play();
    } else {
      self._audioPlayer.pause();
    }
  }

  /**
   * Sets playback step.
   * @param {number} percent 
   */
  setProgress(percent) {
    const self = this;
    self._audioPlayer.currentTime = percent * self._audioPlayer.duration;
  }

  /**
   * Either shuffles or unshuffles the playlist.
   * @param {Object} Main 
   * @param {Object} UI 
   */
  toggleShuffle(Main, UI) {
    const self = this;
    if (self.isShuffled) {
      self._unshuffle(Main);
    } else {
      self._shuffle(Main, UI);
    }
  }

  /**
   * Actual shuffle algorythm.
   * @param {Array<Object>} files 
   */
  _shuffleFiles(files) {
    for (let i = files.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [files[i], files[j]] = [files[j], files[i]];
    }
    return files;
  }

  /**
   * Shuffles the playlist.
   * @param {Object} Main 
   * @param {Object} UI 
   */
  _shuffle(Main, UI) {
    const self = this;

    Main.files = UI.updateSongListMetaData(Main);
    Main.originalFiles = Main.files.slice('');
    Main.files = self._shuffleFiles(Main.files);

    if (self._audioPlayer.src) {
      const prefix = process.platform === 'win32' ? '' : '/';
      const head = Main.files.find(song => {
        return (
          song.path.replace(/\\/g, '/') ===
          prefix + decodeURI(self._audioPlayer.src).split('///')[1]
        );
      });

      const index = Main.files.findIndex(song => song === head);
      Main.files.splice(index, 1);
      Main.files = [head, ...Main.files];
      self._index = 0;
    } else {
      self.play(Main.files[0].path, UI, Main);
    }
    self.isShuffled = true;
  }

  /**
   * Restores original playlist order.
   * @param {Object} Main 
   */
  _unshuffle(Main) {
    const self = this;
    Main.files = Main.originalFiles;

    const prefix = process.platform === 'win32' ? '' : '/';
    self._index = Main.files.findIndex(song => {
      return (
        song.path.replace(/\\/g, '/') ===
        prefix + decodeURI(self._audioPlayer.src).split('///')[1]
      );
    });

    self.isShuffled = false;
  }

  /**
   * Shuffles the playlist, but keeps currently playing song as head.
   * @param {Object} Main 
   * @param {Object} UI 
   * @param {string} path 
   */
  reshuffleOnClick(Main, UI, path) {
    const self = this;

    Main.files = self._shuffleFiles(Main.files);

    // Swap first song and song that got clicked -> Issue #149
    const curentHead = Main.files[0];
    const newHeadIndex = Main.files.findIndex(song => song.path === path);
    Main.files[0] = Main.files[newHeadIndex];
    Main.files[newHeadIndex] = curentHead;

    self.play(Main.files[0].path, UI, Main);
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
    return self._audioPlayer.paused;
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
