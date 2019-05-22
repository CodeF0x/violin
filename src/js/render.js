module.exports = {
  /**
   * @function listMusicFiles
   * @description Lists all supported files in the current folder.
   * @param {array} files - Array of objects containing file path and name
   * @param {boolean} readTags - Tells if function should read tags from file or if tags are already read
   */
  listMusicFiles: function(files, readTags) {
    globalFiles = files;
    const list = document.getElementById('songs');
    list.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < files.length; i++) {
      const container = document.createElement('div');
      container.setAttribute('data-file-path', files[i].path);
      container.addEventListener('click', function() {
        play(this.getAttribute('data-file-path'));
      });
      container.style.display = 'grid';
      container.style.gridTemplateColumns = '15% 1fr 1fr 1fr';

      const name = document.createElement('div');
      name.classList.add('song-titles');
      const album = document.createElement('div');
      album.classList.add('song-albums');
      const artist = document.createElement('div');
      artist.classList.add('song-artists');

      name.style.gridColumn = '1/3';
      name.style.alignSelf = 'center';
      album.style.gridColumn = '3';
      artist.style.gridColumn = '4';

      if (readTags) {
        new media.Reader(files[i].path)
          .setTagsToRead(['title', 'album', 'artist'])
          .read({
            onSuccess: tag => {
              let songNameSplitted = files[i].path.split('/');
              songNameSplitted = songNameSplitted[songNameSplitted.length - 1];

              name.innerText = tag.tags.title
                ? tag.tags.title
                : songNameSplitted;
              album.innerText = tag.tags.album ? tag.tags.album : 'Unknown';
              artist.innerText = tag.tags.artist ? tag.tags.artist : 'Unknown';
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
    list.appendChild(fragment);

    // Highlight current song after sorting
    if (currentFileInList) {
      currentFileInList = [
        ...document.querySelectorAll('div[data-file-path]')
      ].find(song => {
        return (
          song.firstChild.innerText === currentFileInList.firstChild.innerText
        );
      });
      currentFileInList.style.color = 'rgb(244, 143, 177)';
    }
  }
};
