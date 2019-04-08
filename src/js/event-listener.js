module.exports = (function() {
  // Sending event to main process
  folderButton.addEventListener('click', () => {
    ipcRenderer.send('open-file-dialog');
  });

  // Receive files from main process
  ipcRenderer.on('music-files', (event, files) => {
    listMusicFiles(files);
  });

  playButton.addEventListener('click', () => {
    if (player.src === '') {
      return;
    }
    pauseButton.style.display = 'block';
    playButton.style.display = 'none';
    resume();
  });

  pauseButton.addEventListener('click', () => {
    playButton.style.display = 'block';
    pauseButton.style.display = 'none';
    pause();
  });

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

  shuffleButtonActive.addEventListener('click', () => {
    shuffleButtonActive.style.display = 'none';
    shuffleButton.style.display = 'block';
    unshuffle();
  });

  repeatButton.addEventListener('click', () => {
    repeatButton.style.display = 'none';
    repeatButtonActive.style.display = 'block';
    isOnRepeat = true;
  });

  repeatButtonActive.addEventListener('click', () => {
    repeatButtonActive.style.display = 'none';
    repeatButton.style.display = 'block';
    isOnRepeat = false;
  });

  progressBar.addEventListener('click', function(e) {
    const percent = e.offsetX / this.offsetWidth;
    progressBar.value = percent / 100;
    player.currentTime = percent * player.duration;
  });
})();
