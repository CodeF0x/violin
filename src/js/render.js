module.exports = {
  /**
   * @function listMusicFiles
   * @description Lists all supported files in the current folder.
   * @param {array} files - Array of objects containing file path and name
   * @param {boolean} readTags - Tells if function should read tags from file or if tags are already read
   */
  listMusicFiles: function(files, readTags) {
    /**
     * If music is playing an user selects a new folder, 
     * readTags is true -> Reset player UI and stop playback
     */
    if (readTags) {
      self = module.exports;
      self.resetPlayerUI();
      player.pause();
      player.currentTime = 0;
    }

    const { toggleSetter } = require('./event-listener');

    /**
     * @function clickHandler
     * @description Handles the click on a list element in the song list.
     */
    function clickHandler() {
      toggleSetter(1);
      play(this.getAttribute('data-file-path'));
    }

    return new Promise((resolve, reject) => {
      globalFiles = files;
      const list = document.getElementById('songs');
      list.innerHTML = '';

      const fragment = document.createDocumentFragment();
      showLoader();

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

        if (readTags) {
          new media.Reader(files[i].path)
            .setTagsToRead(['title', 'album', 'artist'])
            .read({
              onSuccess: tag => {
                let songNameSplitted = files[i].path.split('/');
                songNameSplitted =
                  songNameSplitted[songNameSplitted.length - 1];

                name.innerText = tag.tags.title
                  ? tag.tags.title
                  : songNameSplitted;
                album.innerText = tag.tags.album ? tag.tags.album : 'Unknown';
                artist.innerText = tag.tags.artist
                  ? tag.tags.artist
                  : 'Unknown';
              },
              onError: err => console.error(err)
            });
        } else {
          name.innerText = files[i].name;
          album.innerText = files[i].album;
          artist.innerText = files[i].artist;
        }

        container.appendChild(name);
        container.appendChild(album);
        container.appendChild(artist);
        fragment.appendChild(container);
      }
      try {
        list.appendChild(fragment);
        resolve('done');
      } catch (e) {
        reject(e);
      }

      // Highlight current song after sorting
      if (currentFileInList) {
        currentFileInList = [
          ...document.querySelectorAll('div[data-file-path]')
        ].find(song => {
          return (
            song.firstChild.innerText === currentFileInList.firstChild.innerText
          );
        });
        currentFileInList.classList.add('song-container-active');
      }
    });
  },

  /**
     * @resetPlayerUI
     * @description Sets song length, song name, artist name, and album cover back to default.
     */
    resetPlayerUI: function() {
      const timerEnd = document.getElementById('timer-end');
      const timerStart = document.getElementById('timer-start');
      const albumCover = document.querySelector('.album-img');
      const songName = document.getElementById('song-title');
      const artistName = document.getElementById('song-artist');

      playButton.style.backgroundImage = "url('../src/img/play.png')";
      progressBar.value = '0';

      timerEnd.innerText = '0:00';
      timerStart.innerText = '0:00';
      songName.innerText = 'Something';
      artistName.innerText = 'Someone';
      albumCover.style.removeProperty('background-image');
      if (currentFileInList) {
        currentFileInList.classList.remove('song-container-active');
      }
    }
};
