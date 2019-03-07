const { ipcRenderer } = require('electron');
const media = require('jsmediatags');
const player = new Audio();
const folderButton = document.getElementById('open-folder');
const pauseButton = document.getElementById('pause');
const playButton = document.getElementById('play');
const forwardButton = document.getElementById('forward');
const backwardButton = document.getElementById('backward');
let base64String;
let globalFiles;
let index;

folderButton.addEventListener('click', () => {
  ipcRenderer.send('open-file-dialog');
});

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

function listMusicFiles(files) {
  globalFiles = files;
  const middleArea = document.querySelector('.middle-area');
  const list = middleArea.querySelector('ul');
  list.innerHTML = '';

  files.forEach(file => {
    const fileItem = document.createElement('li');
    fileItem.innerText = file.name;
    fileItem.setAttribute('data-file-path', file.path);

    fileItem.addEventListener('click', function() {
      play(this.getAttribute('data-file-path'));
    });

    list.appendChild(fileItem);
  });
}

function play(path) {
  const albumCover = document.getElementById('album-cover');
  const progressBar = document.getElementById('progress-value');
  const songName = document.getElementById('song-name');
  const artistName = document.getElementById('artist-name');
  playButton.style.display = 'none';
  pauseButton.style.display = 'block';
  progressBar.value = 0;

  media.read(path, {
    onSuccess: tag => {
      songName.innerText = tag.tags.title ? tag.tags.title : 'Unknown';
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
    onError: err => {
      console.error(err);
    }
  });

  player.src = path;
  player.play();

  // update current index
  const currentFile = player.src;
  index = globalFiles.findIndex(elem => {
    // replace all because Windows uses backslashes instead of normal slashes - thanks, Bill!
    return (
      elem.path.replace(/\\/g, '/') ===
      '/' + decodeURI(currentFile).split('///')[1]
    );
  });

  // update progress bar and play next song
  const updateProgress = setInterval(() => {
    const length = player.duration;
    const current = player.currentTime;

    progressBar.value = 100 * (current / length);

    if (current === length) {
      if (index + 1 !== globalFiles.length) {
        play(globalFiles[index + 1].path);
        index++;
      } else {
        pauseButton.style.display = 'none';
        playButton.style.display = 'block';
        progressBar.value = '0';
      }
    }
  }, 500);
}

function generateUrl(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      generateUrl(arr[i]);
    } else {
      base64String += String.fromCharCode(arr[i]);
    }
  }
}

function pause() {
  player.pause();
}

function skip() {
  const currentFile = player.src;
  index = globalFiles.findIndex(elem => {
    // replace all because Windows uses backslashes instead of normal slashes - thanks, Bill!
    return (
      elem.path.replace(/\\/g, '/') ===
      '/' + decodeURI(currentFile).split('///')[1]
    );
  });

  if (index + 1 !== globalFiles.length) {
    play(globalFiles[index + 1].path);
    index++;
  }
}

function back() {
  const currentFile = player.src;
  index = globalFiles.findIndex(elem => {
    return (
      elem.path.replace(/\\/g, '/') ===
      '/' + decodeURI(currentFile).split('///')[1]
    );
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

function resume() {
  player.play();
}
