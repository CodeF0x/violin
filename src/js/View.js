module.exports = class View {
  /**
   * @constructor
   * @param {ipcRenderer instance} ipcRenderer
   * @param {instance} player
   */
  constructor(ipcRenderer, Main, Player) {
    const self = this;

    self._media = require('jsmediatags');

    self._currentlyPlaying = undefined;
    self._list = self._getElem('songs');
    self._folderButton = self._getElem('open-folder');
    self._playButton = self._getElem('play');
    self._forward = self._getElem('next-song');
    self._backward = self._getElem('last-song');
    self._shuffle = self._getElem('shuffle');
    self._repeat = self._getElem('repeat');
    self._sortByName = self._getElem('by-name');
    self._sortByAlbum = self._getElem('by-album');
    self._sortByArtist = self._getElem('by-artist');
    self._search = self._getElem('search');
    self._creator = self._getElem('creator-link');
    self._volume = self._getElem('volume');
    self._timerEnd = self._getElem('timer-end');
    self._timerStart = self._getElem('timer-start');
    self._albumCover = self._getElem('album-img');
    self._songName = self._getElem('song-title');
    self._artist = self._getElem('song-artist');
    self._progress = self._getElem('progress-value');

    self._updateInterval = undefined;

    self._folderButton.addEventListener('click', () =>
      ipcRenderer.send('open-file-dialog')
    );

    ipcRenderer.on('music-files', (e, files) => {
      self.listFiles(files, true, Main, Player);
    });

    self._playButton.addEventListener('click', () => {
      Player.playPause(Main, self);
      self.togglePlayButton(Main, Player);
    });

    self._forward.addEventListener('click', () => {
      Player.next(self, Main);
    });

    self._backward.addEventListener('click', () => {
      Player.previous(self, Main);
    });
    // self._shuffle.addEventListener('click', player.shuffle);
    // self._repeat.addEventListener('click', player.repeat);
    [self._sortByName, self._sortByAlbum, self._sortByArtist].forEach(btn => {
      btn.addEventListener('click', Main.sort.bind(Main));
    });
    self._search.addEventListener('keyup', self.search);
    self._creator.addEventListener('click', self.showWebsite);

    self._volume.addEventListener('input', () =>
      Player.setVolume(self._volume.value)
    );
  }

  /**
   * @function _getElem
   * @param {String} id
   * @returns {HTMLElement} element
   * @description Gets an HTML element by its ID.
   */
  _getElem(id) {
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
   * @param {instance} - instance of main class
   * @param {instance} - instance of player class
   * @description Lists all music files in the view.
   */
  listFiles(files, newFolder, Main, Player) {
    const self = this;

    /**
     * @function clickHandler
     * @description Handles click on song.
     */
    function clickHandler() {
      Player.play(this.getAttribute('data-file-path'), self, Main);
    }

    if (newFolder) {
      self.resetUI();
      Player.stop(self);
      Main.sortedBy = undefined;
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
      list.appendChild(fragment);
    }

    if (self._currentlyPlaying) {
      let playing = self._currentlyPlaying;
      const songs = [...document.querySelectorAll('div[data-file-path]')];
      playing = songs.find(song => {
        return song.firstChild.innerText === playing.firstChild.innerText;
      });
      playing.classList.add('song-container-active');
    }
  }

  /**
   * @function resetUI
   * @description Resets the UI when necessary (eg. new folder openend).
   */
  resetUI() {
    const self = this;

    clearInterval(self._updateInterval);

    self._timerEnd.innerText = '0:00';
    self._timerStart.innerText = '0:00';
    self._songName.innerText = 'Something';
    self._artist.innerText = 'Someone';

    self._playButton.style.backgroundImage = "url('../src/img/play.png')";
    self._progress.value = 0;

    self._albumCover.style.removeProperty('background-image');

    if (self._currentlyPlaying) {
      self._currentlyPlaying.classList.remove('song-container-active');
      self._currentlyPlaying = undefined;
    }
  }

  /**
   * @function updateSongListMetaData
   * @param {instance} Main - instance of main class
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

  /**
   * @function markSort
   * @param {HTMLElement} element - the element to mark
   * @description Marks the current sort selection as selected.
   */
  markSort(element) {
    element.style.color = 'var(--song-con-active)';
  }

  /**
   * @function unmarkSort
   * @param {HTMLElement} element - the element to unmark
   * @description Unmarks the previous sort selection.
   */
  unmarkSort(element) {
    if (element) {
      element.style.color = 'var(--text-color)';
    }
  }

  /**
   * @function updateUI
   * @param {instance} Main - instance of main class
   * @param {instance} Player - instance of player class
   * @description Updates the UI. (What song from what artist is playing, progress bar, etc.);
   */
  updateUI(Main, Player) {
    const media = require('jsmediatags');
    const self = this;

    const audio = Player.audioPlayer;
    const songs = document.querySelectorAll('div[data-file-path]');

    if (self._currentlyPlaying) {
      self._currentlyPlaying.classList.remove('song-container-active');
    }

    Main.files = self.updateSongListMetaData(Main);

    self._updateInterval = setInterval(() => {
      const fullTimeSeconds = audio.duration;
      const fullTimeMinutes = Math.floor(fullTimeSeconds / 60);
      const fullTimeRest = Math.floor(fullTimeSeconds % 60);

      const currentTimeSeconds = audio.currentTime;
      const currentTimeMinutes = Math.floor(currentTimeSeconds / 60);
      const currentTimeRest = Math.floor(currentTimeSeconds % 60);

      self._timerStart.innerText =
        currentTimeRest < 10
          ? `${currentTimeMinutes}:0${currentTimeRest}`
          : `${currentTimeMinutes}:${currentTimeRest}`;

      self._timerEnd.innerText =
        fullTimeRest < 10
          ? `${fullTimeMinutes}:0${fullTimeRest}`
          : `${fullTimeMinutes}:${fullTimeRest}`;

      try {
        self._progress.value = 100 * (audio.currentTime / audio.duration);
      } catch (e) {
        // i don't care
      }
    }, 500);

    const index = Player.index;

    new media.Reader(Main.files[index].path).setTagsToRead(['picture']).read({
      onSuccess: tag => {
        const pic = tag.tags.picture;
        if (pic) {
          const base64 = self._genImgUrl(pic.data);
          const url = `data:${pic.format};base64,${window.btoa(base64)}`;
          self._albumCover.style.backgroundImage = `url("${url}")`;
        } else {
          self._albumCover.style.removeProperty('background-image');
        }
      }
    });

    self._songName.innerText = Main.files[index].name;
    self._artist.innerText = Main.files[index].artist;
    self._currentlyPlaying = songs[index];
    self._currentlyPlaying.classList.add('song-container-active');
  }

  _genImgUrl(arr) {
    let base64 = '';
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        generateUrl(arr[i]);
      } else {
        base64 += String.fromCharCode(arr[i]);
      }
    }
    return base64;
  }

  togglePlayButton(Main, Player) {
    const self = this;
    let url;

    if (Player.isPaused) {
      clearInterval(self._updateInterval);
      url = 'url("../src/img/play.png")';
    } else {
      url = 'url("../src/img/pause.png")';
    }
    self._playButton.style.backgroundImage = url;
    self.updateUI(Main, Player);
  }
};