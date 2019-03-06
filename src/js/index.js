const { ipcRenderer } = require('electron');
const media = require('jsmediatags');
const player = new Audio();
let base64String;
let globalFiles;
let index;

document.getElementById('open-folder').addEventListener('click', () => {
  ipcRenderer.send('open-file-dialog');
});

ipcRenderer.on('music-files', (event, files) => {
  listMusicFiles(files);
});

document.getElementById('play').addEventListener('click', function() {
  if (player.src === '') {
    return;
  }
  document.getElementById('pause').style.display = 'block';
  this.style.display = 'none';
  resume();
});

document.getElementById('pause').addEventListener('click', function() {
  document.getElementById('play').style.display = 'block';
  this.style.display = 'none';
  pause();
});

document.getElementById('forward').addEventListener('click', () => {
  skip();
});

document.getElementById('backward').addEventListener('click', () => {
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
  document.getElementById('play').style.display = 'none';
  document.getElementById('pause').style.display = 'block';
  document.getElementById('progress-value').value = 0;

  media.read(path, {
    onSuccess: tag => {
      document.getElementById('song-name').innerText = tag.tags.title;
      document.getElementById('artist-name').innerText = tag.tags.artist;

      if (tag.tags.picture) {
        base64String = '';
        const picture = tag.tags.picture;
        generateUrl(picture.data);
        const imgUrl = `data:${picture.format};base64,${window.btoa(
          base64String
        )}`;
        document.getElementById('album-cover').src = imgUrl;
      } else {
        document.getElementById('album-cover').src = 'img/placeholder.png';
      }
    },
    onError: err => {
      console.error(err);
    }
  });

  player.src = path;
  player.play();

  // Update progress bar
  const update = setInterval(() => {
    const allTime = player.duration;
    const onePercent = allTime / 100;
    const current = onePercent * player.currentTime;
    console.log(current);
    
  }, 1000);
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
    return elem.path.replace(/\\/g, '/') === decodeURI(currentFile).split('///')[1];
  });

  if (index + 1 !== globalFiles.length) {
    play(globalFiles[index + 1].path);
    index++;
  }
}

function back() {
  console.log(player.currentTime);
  if (player.currentTime <= 1) {
    player.currentTime = 0;
    return;
  }

  const currentFile = player.src;
  index = globalFiles.findIndex(elem => {
    // replace all because Windows uses backslashes instead of normal slashes - thanks, Bill!
    return elem.path.replace(/\\/g, '/') === decodeURI(currentFile).split('///')[1];
  });

  if (index - 1 > 0) {
    if (player.currentTime > 1) {
      player.currentTime = 0;
    } else if (player.currentTime <= 1) {
      play(globalFiles[index - 1].path);
      index--;
    }
  } else {
    player.currentTime = 0;
  }
}

function resume() {
  player.play();
}
