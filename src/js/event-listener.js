module.exports = function() {
  let playPauseToggle = 0,
    shuffleToggle = 0,
    repeatToggle = 0;

  // TODO there might be a better solution for this
  /**
   * @function toggleSetter
   * @description setter for playPauseToggle.
   * @param {number} toggle - toggle-number to set.
   */
  module.exports.toggleSetter = function(toggle) {
    playPauseToggle = toggle;
  };

  // Sending event to main process
  folderButton.addEventListener('click', e => {
    e.preventDefault();
    ipcRenderer.send('open-file-dialog');
  });

  // Receive files from main process
  ipcRenderer.on('music-files', (event, files) => {
    listMusicFiles(files, true).then(() => hideLoader());
  });

  ipcRenderer.on('shortcut', (event, key) => {
    switch (key) {
      case 'MediaPlayPause':
        togglePlayPause(playPauseToggle);
        break;
      case 'MediaNextTrack':
        skip();
        break;
      case 'MediaPreviousTrack':
        back();
        break;
    }
  });

  playButton.addEventListener('click', event => {
    togglePlayPause(playPauseToggle);
  });

  forwardButton.addEventListener('click', skip);

  backwardButton.addEventListener('click', back);

  shuffleButton.addEventListener('click', () => {
    if (!globalFiles) return;

    if (shuffleToggle === 0) {
      shuffleButton.style.backgroundImage =
        "url('../src/img/shuffle-active.png')";
      shuffleToggle++;
      shuffle();
    } else {
      shuffleButton.style.backgroundImage = "url('../src/img/shuffle.png')";
      shuffleToggle--;
      unshuffle();
    }
  });

  repeatButton.addEventListener('click', () => {
    if (repeatToggle === 0) {
      repeatButton.style.backgroundImage =
        "url('../src/img/repeat-active.png')";
      repeatToggle--;
      isOnRepeat = true;
    } else {
      repeatButton.style.backgroundImage = "url('../src/img/repeat.png')";
      repeatToggle++;
      isOnRepeat = false;
    }
  });

  progressBar.addEventListener('click', function(e) {
    const percent = e.offsetX / this.offsetWidth;
    progressBar.value = percent / 100;
    player.currentTime = percent * player.duration;
  });

  [sortByNameButton, sortByAlbumButton, sortByArtistButton].forEach(button => {
    button.addEventListener('click', function() {
      if (!globalFiles) return;

      if (sortedElement !== this) {
        toggleSorting('orange', this);
      } else if (sortedElement === this) {
        toggleSorting('white', this);
      }
    });
  });

  searchField.addEventListener('keyup', function() {
    search(document.querySelectorAll('div[data-file-path]'), this.value);
  });

  creatorLink.addEventListener('click', () => {
    require('electron').shell.openExternal('https://codef0x.dev');
  });

  volumeSlider.addEventListener('input', () => {
    player.volume = volumeSlider.value / 100;
  });
};

/**
 * @function toggleSorting
 * @description Toggles between sorted and unsorted song list.
 * @param {string} color - tells what color to set
 * @param {HTMLElement} element - the element the to modify
 */
function toggleSorting(color, element) {
  if (color === 'white') {
    element.style.color = 'var(--text-color)';
    sortedElement = undefined;
    revertSorting(originalOrder);
  } else if (color === 'orange') {
    if (sortedElement) sortedElement.style.color = 'var(--text-color)';
    element.style.color = 'var(--song-con-active)';
    if (originalOrder.length !== 0) revertSorting(originalOrder);
    sortedElement = element;
    const songData = getSongData();
    sortAlphabetically(songData, element.innerText.toLowerCase());
  }
}

/**
 * @function togglePlayPause
 * @description Toggles between playing and pausing the current song.
 * @param {number} playPauseToggle - 1 == song is playing, 0 == song is paused
 */
function togglePlayPause(playPauseToggle) {
  const self = module.exports;
  if (player.src === '') {
    return;
  }

  if (playPauseToggle === 0) {
    resume();
    playButton.style.backgroundImage = "url('../src/img/pause.png')";
    self.toggleSetter(1);
  } else {
    player.pause();
    playButton.style.backgroundImage = "url('../src/img/play.png')";
    self.toggleSetter(0);
  }
}
