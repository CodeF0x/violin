module.exports = class View {
  /**
   * @constructor
   * @param {ipcRenderer instance} ipcRenderer
   * @param {player instance} player
   */
  constructor(ipcRenderer, player, main) {
    const self = this;

    self._player = player;

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

    ipcRenderer.on('music-files', (e, files) => console.log(files));
    // self._playButton.addEventListener('click', player.check);
    // self._forward.addEventListener('click', player.next);
    // self._backward.addEventListener('click', player.last);
    // self._shuffle.addEventListener('click', player.shuffle);
    // self._repeat.addEventListener('click', player.repeat);
    // self._sortByName.addEventListener('click', self.sortByName);
    // self._sortByAlbum.addEventListener('click', self.sortByAlbum);
    // self._sortByArtist.addEventListener('click', self.sortByName);
    // self._search.addEventListener('keyup', self.search);
    // self._creator.addEventListener('click', self.showWebsite);
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
   * @function listFiles
   * @param {Array} files - array of objects with song name and file path
   * @description Lists all music files in the view.
   */
  listFiles(files, newFolder, main, player) {
    /**
     * @function clickHandler
     * @description Handles click on song.
     */
    function clickHandler() {
      player.play(this.getAttribute('data-file-path'));
    }

    const self = this;
    if (newFolder) {
      self.resetUi();
      self._player.stop();
    }

    main.files = files;
    const list = self._list;
    list.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < files.length; i++) {
      const container = document.createElement('div');
      container.setAttribute('data-file-path', files[i].path);

      container.addEventListener('click', clickHandler);

      container.classList.add('song-container');

      const name = documennt.createElement('div');
      name.classList.add('song-titles');
      const album = document.createElement('div');
      album.classList.add('song-albums');
      const artist = document.createElement('div');
      artist.classList.add('song-artists');

      if (newFolder) {
        new media.Reader(files[i].path)
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

      self._list.appendChild(fragment);
    }
  }
};
