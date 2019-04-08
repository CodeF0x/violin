module.exports = {
  /**
   * @function listMusicFiles
   * @description Lists all supported files in the current folder.
   * @param {array} files - Array of objects containing file path and name
   */
  listMusicFiles: function(files) {
    globalFiles = files;
    const list = document.getElementById('songs');
    list.innerHTML = '';
    document.getElementById('sort-by').style.display = 'flex';

    for (let i = 0; i < files.length; i++) {
      const container = document.createElement('div');
      container.setAttribute('data-file-path', files[i].path);
      const name = document.createElement('div');
      const album = document.createElement('div');
      const artist = document.createElement('div');

      new media.Reader(files[i].path)
        .setTagsToRead(['title', 'album', 'artist'])
        .read({
          onSuccess: tag => {
            let songNameSplitted = files[i].path.split('/');
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
    }
  }
};
