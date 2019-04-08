const { ipcRenderer } = require('electron');
const media = require('jsmediatags');
const player = new Audio();
const progressBar = document.getElementById('progress-value');
const folderButton = document.getElementById('open-folder');
const pauseButton = document.getElementById('pause');
const playButton = document.getElementById('play');
const forwardButton = document.getElementById('forward');
const backwardButton = document.getElementById('backward');
const shuffleButton = document.getElementById('shuffle');
const shuffleButtonActive = document.getElementById('shuffle-active');
const repeatButton = document.getElementById('repeat');
const repeatButtonActive = document.getElementById('repeat-active');
let base64String = undefined;
let globalFiles = undefined;
let originalGlobalFiles = undefined;
let currentFileInList = undefined;
let index = undefined;
let isOnRepeat = false;

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

/**
 * @function listMusicFiles
 * @description Lists all supported files in the current folder.
 * @param {array} files - Array of objects containing file path and name
 */
function listMusicFiles(files) {
  globalFiles = files;
  const middleArea = document.querySelector('.middle-area');
  const list = document.getElementById('songs');
  list.innerHTML = '';
  document.getElementById('sort-by').style.display = 'flex';

  files.forEach(file => {
    const container = document.createElement('div');
    container.setAttribute('data-file-path', file.path);
    const name = document.createElement('div');
    const album = document.createElement('div');
    const artist = document.createElement('div');

    media.read(file.path, {
      onSuccess: tag => {
        let songNameSplitted = file.path.split('/');
        songNameSplitted = songNameSplitted[songNameSplitted.length - 1];

        name.innerText = tag.tags.title ? tag.tags.title : songNameSplitted;
        album.innerText = tag.tags.album ? tag.tags.album : 'Unknown';
        artist.innerText = tag.tags.artist ? tag.tags.artist : 'Unknown';
      },
      onError: err => console.error(err)
    });

    container.addEventListener('click', function() {
      play(this.getAttribute('data-file-path'));
    });

    container.appendChild(name);
    container.appendChild(album);
    container.appendChild(artist);
    list.appendChild(container);
  });
}

/**
 * @function play
 * @description Plays a file. Either automatically or when user clicks on song.
 * @param {string} item - File path
 */
function play(item) {
  let path = item;

  let prefix = '/';
  if (process.platform === 'win32') {
    prefix = '';
  }

  const albumCover = document.getElementById('album-cover');
  const songName = document.getElementById('song-name');
  const artistName = document.getElementById('artist-name');
  playButton.style.display = 'none';
  pauseButton.style.display = 'block';
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
        albumCover.src = imgUrl;
      } else {
        albumCover.src = 'img/placeholder.png';
      }
    },
    onError: err => console.error(err)
  });

  player.src = path;
  player.play();

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
  let files = document.getElementsByTagName('li');
  files = Array.prototype.slice.call(files);

  if (currentFileInList) {
    currentFileInList.style.color = 'white';
  }

  currentFileInList = files.find(elem => {
    return (
      elem.getAttribute('data-file-path').replace(/\\/g, '/') ===
      prefix + decodeURI(currentFile).split('///')[1]
    );
  });
  currentFileInList.style.color = '#F48FB1';

  // update progress bar and play next song
  const updateProgress = setInterval(() => {
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
        pauseButton.style.display = 'none';
        playButton.style.display = 'block';
        progressBar.value = '0';
      }
    }
  }, 500);
}

/**
 * @function generateUrl
 * @description Generates base64 URL of album cover.
 * @param {array} arr - Array of bytes
 */
function generateUrl(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      generateUrl(arr[i]);
    } else {
      base64String += String.fromCharCode(arr[i]);
    }
  }
}

/**
 * @function pause
 * @description Pauses current song.
 */
function pause() {
  player.pause();
}

/**
 * @function skip
 * @description Skips current song and play next in line
 */
function skip() {
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
}

/**
 * @function back
 * @description Either resets current song to 0 or goes back to the last song.
 */
function back() {
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
}

/**
 * @function resume
 * @description Continues to play current song when paused.
 */
function resume() {
  player.play();
}

/**
 * @function shuffle
 * @description Shuffles curent file list randomly.
 */
function shuffle() {
  function shuffleFiles(files) {
    for (let i = files.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [files[i], files[j]] = [files[j], files[i]];
    }
    return files;
  }
  originalGlobalFiles = globalFiles.slice(''); // "backup" global files to unshuffle again
  shuffleFiles(globalFiles);
}

/**
 * @function unshuffle
 * @description Reverts current file list to default order.
 */
function unshuffle() {
  globalFiles = originalGlobalFiles;
}
