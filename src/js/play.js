module.exports = {
  /**
   * @function play
   * @description Plays a file. Either automatically or when user clicks on song.
   * @param {string} item - File path
   */
  play: function(item) {
    const { toggleSetter } = require('./event-listener');
    const timerEnd = document.getElementById('timer-end');
    const timerStart = document.getElementById('timer-start');
    const albumCover = document.querySelector('.album-img');
    const songName = document.getElementById('song-title');
    const artistName = document.getElementById('song-artist');
    let path = item;
    let prefix = '/';

    /**
     * @function timerEndTimerStart
     * @description Updates the start- and end time of the song next to the progress bar.
     */
    function timerEndTimerStart() {
      const endTimeInSeconds = player.duration;
      const endTimeInMinutes = Math.floor(endTimeInSeconds / 60);
      const endTimeRestSeconds = Math.floor(endTimeInSeconds % 60);

      const currentTimeInSeconds = player.currentTime;
      const currentTimeInMintues = Math.floor(currentTimeInSeconds / 60);
      const currentTimeRestSeconds = Math.floor(currentTimeInSeconds % 60);

      timerStart.innerText =
        currentTimeRestSeconds < 10
          ? `${currentTimeInMintues}:0${currentTimeRestSeconds}`
          : `${currentTimeInMintues}:${currentTimeRestSeconds}`;

      timerEnd.innerText =
        endTimeRestSeconds < 10
          ? `${endTimeInMinutes}:0${endTimeRestSeconds}`
          : `${endTimeInMinutes}:${endTimeRestSeconds}`;
    }

    /**
     * @stopPlayback
     * @description Sets song length, song name, artist name, and album cover back to default.
     */
    function stopPlayback() {
      playButton.style.backgroundImage = "url('../src/img/play.png')";
      progressBar.value = '0';

      timerEnd.innerText = '0:00';
      timerStart.innerText = '0:00';
      songName.innerText = 'Something';
      artistName.innerText = 'Someone';
      albumCover.removeAttribute('style');
      currentFileInList.classList.remove('song-container-active');
    }

    if (process.platform === 'win32') {
      prefix = '';
    }

    playButton.style.backgroundImage = "url('img/pause.png')";
    progressBar.value = 0;

    // Get album cover, song name, artist
    media.read(path, {
      onSuccess: tag => {
        let songNameSplitted = item.split('/');
        songNameSplitted = songNameSplitted[songNameSplitted.length - 1];

        songName.innerText = tag.tags.title ? tag.tags.title : songNameSplitted;
        artistName.innerText = tag.tags.artist ? tag.tags.artist : 'Unknown';

        if (tag.tags.picture) {
          base64String = '';
          const picture = tag.tags.picture;
          generateUrl(picture.data);
          const imgUrl = `data:${picture.format};base64,${window.btoa(
            base64String
          )}`;
          albumCover.style.backgroundImage = `url('${imgUrl}')`;
        } else {
          albumCover.src = 'img/placeholder.png';
        }
      },
      onError: err => console.error(err)
    });

    player.src = path;
    player.play();
    timerEndTimerStart();

    // update current index
    const currentFile = player.src;
    index = globalFiles.findIndex(elem => {
      // replace all because Windows uses backslashes instead of normal slashes - thanks, Bill!
      return (
        elem.path.replace(/\\/g, '/') ===
        prefix + decodeURI(currentFile).split('///')[1]
      );
    });

    // highlight currently playing file in list
    let files = document.querySelectorAll('#songs > div');
    files = Array.from(files);

    if (currentFileInList) {
      currentFileInList.classList.toggle('song-container-active');
    }
    currentFileInList = files.find(elem => {
      return (
        elem.getAttribute('data-file-path').replace(/\\/g, '/') ===
        prefix + decodeURI(currentFile).split('///')[1]
      );
    });
    currentFileInList.classList.toggle('song-container-active');

    // update progress bar and play next song
    const updateProgress = setInterval(() => {
      timerEndTimerStart();
      const length = player.duration;
      const current = player.currentTime;

      try {
        progressBar.value = 100 * (current / length);
      } catch (e) {
        // Nothing, errors here are fine
      }
      if (current === length) {
        if (index + 1 !== globalFiles.length) {
          play(globalFiles[index + 1].path);
          index++;
        } else if (index + 1 === globalFiles.length && isOnRepeat) {
          play(globalFiles[0].path);
          index = 0;
        } else {
          toggleSetter(0);
          stopPlayback();
          clearInterval(updateProgress);
        }
      }
    }, 500);
  },

  /**
   * @function generateUrl
   * @description Generates base64 URL of album cover.
   * @param {array} arr - Array of bytes
   */
  generateUrl: function(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        generateUrl(arr[i]);
      } else {
        base64String += String.fromCharCode(arr[i]);
      }
    }
  },

  /**
   * @function shuffle
   * @description Shuffles curent file list randomly.
   */
  shuffle: function() {
    function shuffleFiles(files) {
      for (let i = files.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [files[i], files[j]] = [files[j], files[i]];
      }
      return files;
    }
    originalGlobalFiles = globalFiles.slice(''); // "backup" global files to unshuffle again
    shuffleFiles(globalFiles);
  },

  /**
   * @function unshuffle
   * @description Reverts current file list to default order.
   */
  unshuffle: function() {
    globalFiles = originalGlobalFiles;
  }
};
