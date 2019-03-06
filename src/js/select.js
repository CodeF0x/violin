const { ipcRenderer } = require('electron');
const media = require('jsmediatags');
const player = new Audio();
let base64String;

document.getElementById('open-folder').addEventListener('click', () => {
  ipcRenderer.send('open-file-dialog');
});

ipcRenderer.on('music-files', (event, files) => {
  listMusicFiles(files);
});

function listMusicFiles(files) {
  const middleArea = document.querySelector('.middle-area');
  const list = document.createElement('ul');

  middleArea.innerHTML = '';
  files.forEach(file => {
    const fileItem = document.createElement('li');
    fileItem.innerText = file.name;
    fileItem.setAttribute('data-file-path', file.path);

    fileItem.addEventListener('click', function() {
      play(this.getAttribute('data-file-path'));
    });

    list.appendChild(fileItem);
  });
  middleArea.appendChild(list);
}

function play(path) {
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
