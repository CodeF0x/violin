module.exports = class View {
  /**
   * @constructor
   * @param {ipcRenderer instance} ipcRenderer
   * @param {player instance} player
   */
  constructor(ipcRenderer, Main, Player) {
    const self = this;

    self._media = require('jsmediatags');

    self._currentlyPlaying = undefined;
    self._list = self.getElem('songs');
    self._folderButton = self.getElem('open-folder');
    self._playButton = self.getElem('play');
    self._forward = self.getElem('next-song');
    self._backward = self.getElem('last-song');
    self._shuffle = self.getElem('shuffle');
    self._repeat = self.getElem('repeat');
    self._sortByName = self.getElem('by-name');
    self._sortByAlbum = self.getElem('by-album');
    self._sortByArtist = self.getElem('by-artist');
    self._search = self.getElem('search');
    self._creator = self.getElem('creator-link');
    self._volume = self.getElem('volume');

    self._folderButton.addEventListener('click', () =>
      ipcRenderer.send('open-file-dialog')
    );

    ipcRenderer.on('music-files', (e, files) => {
      self.listFiles(files, true, Main, Player);
    });
    // self._playButton.addEventListener('click', player.check);
    // self._forward.addEventListener('click', player.next);
    // self._backward.addEventListener('click', player.last);
    // self._shuffle.addEventListener('click', player.shuffle);
    // self._repeat.addEventListener('click', player.repeat);
    [self._sortByName, self._sortByAlbum, self._sortByArtist].forEach(btn => {
      btn.addEventListener('click', Main.sort.bind(Main));
    });
    self._search.addEventListener('keyup', self.search);
    self._creator.addEventListener('click', self.showWebsite);
    // self._volume.addEventListener('change', player.setVolume);
  }

  /**
   * @function getElem
   * @param {String} id
   * @returns {HTMLElement} element
   * @description Gets an HTML element by its ID.
   */
  getElem(id) {
    return document.getElementById(id);
  }

  /**
   * @funtion search
   * @param {event} e
   * @description Searches for users input in song list.
   */
  search(e) {
    const query = e.target.value;
    const list = document.querySelectorAll('div[data-file-path]');

    for (let i = 0; i < list.length; i++) {
      const name = list[i].firstChild.innerText.toLowerCase();
      if (query.trim() === '' || name.includes(query)) {
        list[i].style.display = 'grid';
      } else {
        list[i].style.display = 'none';
      }
    }
  }

  /**
   * @function showWebsite
   * @description Shows website of creator when click on link in UI.
   */
  showWebsite() {
    require('electron').shell.openExternal('https://codef0x.dev');
  }

  /**
   * @function listFiles
   * @param {Array} files - array of objects with song name and file path
   * @param {boolean} newFolder - read media tags
   * @param {Main instance} - instance of main class
   * @param {Player instance} - instance of player class
   * @description Lists all music files in the view.
   */
  listFiles(files, newFolder, Main, Player) {
    /**
     * @function clickHandler
     * @description Handles click on song.
     */
    function clickHandler() {
      Player.play(this.getAttribute('data-file-path'));
    }

    const self = this;
    if (newFolder) {
      //self.resetUi();
      //self._player.stop();
      Main.files = files;
    }

    Main.files = files;
    const list = self._list;
    list.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < files.length; i++) {
      const container = document.createElement('div');
      container.setAttribute('data-file-path', files[i].path);

      container.addEventListener('click', clickHandler);

      container.classList.add('song-container');

      const name = document.createElement('div');
      name.classList.add('song-titles');
      const album = document.createElement('div');
      album.classList.add('song-albums');
      const artist = document.createElement('div');
      artist.classList.add('song-artists');

      if (newFolder) {
        new self._media.Reader(files[i].path)
          .setTagsToRead(['title', 'album', 'artist'])
          .read({
            onSuccess: tag => {
              let songName = files[i].path.split('/');
              songName = songName[songName.length - 1];

              const meta = tag.tags;

              name.innerText = meta.title ? meta.title : songName;
              album.innerText = meta.album ? meta.album : 'Unknown';
              artist.innerText = meta.artist ? meta.artist : 'Unknown';
            },
            onError: err => console.error(err)
          });
      } else {
        name.innerText = files[i].name;
        album.innerText = files[i].album;
        artist.innerText = files[i].artist;
      }

      [name, album, artist].forEach(part => container.appendChild(part));
      fragment.appendChild(container);
      self._list.appendChild(fragment);

      if (self._currentlyPlaying) {
        const playing = self._currentlyPlaying;
        playing = [...document.querySelectorAll('div[data-file-path]')].find(
          song => {
            return song.firstChild.innerText === playing.firstChild.innerText;
          }
        );
        playing.classList.add('song-container-active');
      }
    }
  }

  /**
   * @function updateSongListMetaData
   * @param {Main Instance} Main - instance of main class
   * @returns {Array} updatedList - the song array with extra meta data.
   * @description Updates the song array by adding meta data.
   */
  updateSongListMetaData(Main) {
    const updatedList = [];
    const songs = document.querySelectorAll('div[data-file-path]');
    for (let i = 0; i < Main.files.length; i++) {
      const data = songs[i].getElementsByTagName('div');
      const entry = {
        name: data[0].innerText,
        album: data[1].innerText,
        artist: data[2].innerText,
        path: Main.files[i].path
      };

      updatedList.push(entry);
    }
    return updatedList;
  }

  markSort(element) {
    element.style.color = 'var(--song-con-active)';
  }

  unmarkSort(element) {
    if (element) {
      element.style.color = 'var(--text-color)';
    }
  }
};
