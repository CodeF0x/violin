module.exports = (function() {
  // Sending event to main process
  folderButton.addEventListener('click', e => {
    e.preventDefault();
    ipcRenderer.send('open-file-dialog');
  });

  // Receive files from main process
  ipcRenderer.on('music-files', (event, files) => {
    listMusicFiles(files, true);
  });

  playButton.addEventListener('click', () => {
    if (player.src === '') {
      return;
    }
    playButton.style.backgroundColor = '../img/pause.png';
    resume();
  });

  // pauseButton.addEventListener('click', () => {
  //   playButton.style.display = 'block';
  //   pauseButton.style.display = 'none';
  //   pause();
  // });

  forwardButton.addEventListener('click', () => {
    skip();
  });

  backwardButton.addEventListener('click', () => {
    back();
  });

  shuffleButton.addEventListener('click', () => {
    if (!globalFiles) {
      return;
    }
    shuffleButton.style.display = 'none';
    shuffleButtonActive.style.display = 'block';
    shuffle();
  });

  // shuffleButtonActive.addEventListener('click', () => {
  //   shuffleButtonActive.style.display = 'none';
  //   shuffleButton.style.display = 'block';
  //   unshuffle();
  // });

  repeatButton.addEventListener('click', () => {
    repeatButton.style.display = 'none';
    repeatButtonActive.style.display = 'block';
    isOnRepeat = true;
  });

  // repeatButtonActive.addEventListener('click', () => {
  //   repeatButtonActive.style.display = 'none';
  //   repeatButton.style.display = 'block';
  //   isOnRepeat = false;
  // });

  progressBar.addEventListener('click', function(e) {
    const percent = e.offsetX / this.offsetWidth;
    progressBar.value = percent / 100;
    player.currentTime = percent * player.duration;
  });

  [sortByNameButton, sortByAlbumButton, sortByArtistButton].forEach(button => {
    button.addEventListener('click', function() {
      if (sortedElement !== this) {
        toggleSorting('add class', this);
      } else if (sortedElement === this) {
        toggleSorting('remove class', this);
      }
    });
  });

  searchField.addEventListener('keyup', function() {
    search(document.querySelectorAll('div[data-file-path]'), this.value);
  });
})();

function toggleSorting(whatToDo, element) {
  if (whatToDo === 'remove class') {
    element.classList.remove('sorted');
    sortedElement = undefined;
    revertSorting(originalOrder);
  } else if (whatToDo === 'add class') {
    if (sortedElement) sortedElement.classList.remove('sorted');
    element.classList.add('sorted');
    if (originalOrder.length !== 0) revertSorting(originalOrder);
    sortedElement = element;
    const songData = getSongData();
    sortAlphabetically(songData, element.innerText.toLowerCase());
  }
}
