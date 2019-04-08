module.exports = {
  /**
   * @function pause
   * @description Pauses current song.
   */
  pause: function() {
    player.pause();
  },

  /**
   * @function skip
   * @description Skips current song and play next in line
   */
  skip: function() {
    const currentFile = player.src;

    // thanks for using backslashes instead of normal ones, Bill!
    let currentFileUrl = decodeURI(currentFile).split('///')[1];
    if (process.platform !== 'win32') {
      currentFileUrl = '/' + currentFileUrl;
    }

    index = globalFiles.findIndex(elem => {
      return elem.path.replace(/\\/g, '/') === currentFileUrl;
    });
    if (index + 1 !== globalFiles.length) {
      play(globalFiles[index + 1].path);
      index++;
    }
  },

  /**
   * @function back
   * @description Either resets current song to 0 or goes back to the last song.
   */
  back: function() {
    const currentFile = player.src;
    let currentFileUrl = decodeURI(currentFile).split('///')[1];
    if (process.platform !== 'win32') {
      currentFileUrl = '/' + currentFileUrl;
    }
    index = globalFiles.findIndex(elem => {
      return elem.path.replace(/\\/g, '/') === currentFileUrl;
    });

    if (index - 1 >= 0) {
      if (player.currentTime < 2) {
        play(globalFiles[index - 1].path);
        index--;
      } else {
        player.currentTime = 0;
      }
    } else {
      player.currentTime = 0;
    }
  },

  /**
   * @function resume
   * @description Continues to play current song when paused.
   */
  resume: function() {
    player.play();
  }
};
