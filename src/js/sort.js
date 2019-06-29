module.exports = {
  originalOrder: [], // Gets imported in index.js to become accessible near the end of getSongData
  sortedElement: undefined, // This one is accessed in event-listeners.js
  /**
   * @function getSongData
   * @description Gets song data (name, album, artist) of every song in the list.
   * @returns {array} songData - array of objects containing the song information
   */
  getSongData: function() {
    originalOrder = [];
    const songData = [];
    const songs = document.querySelectorAll('div[data-file-path]');
    songs.forEach(song => {
      const songObj = {};
      songObj.path = song.getAttribute('data-file-path');
      songObj.name = song.querySelectorAll('div')[0].innerText;
      songObj.album = song.querySelectorAll('div')[1].innerText;
      songObj.artist = song.querySelectorAll('div')[2].innerText;

      songData.push(songObj);
      // Backup original order to revert sorting later
      originalOrder.push(songObj);
    });
    return songData;
  },

  /**
   * @function revertSorting
   * @description Reverts sorting by calling listMusicFiles with initial order the songs got loaded.
   */
  revertSorting: function() {
    listMusicFiles(originalOrder, false).then(() => hideLoader());
  },

  /**
   * @function sortAlphabetically
   * @description Sorts the list of music files in ascending alphabetically order.
   * @param {array} songData - array of objects contining song information: name, artist, and album
   * @param {string} whatToSort - name of object property; can be "name", "artist", or "album"
   */
  sortAlphabetically: function(songData, whatToSort) {
    songData.sort((a, b) => {
      if (a[whatToSort].toLowerCase() < b[whatToSort].toLowerCase()) return -1;
      if (a[whatToSort].toLowerCase() > b[whatToSort].toLowerCase()) return 1;
      return 0;
    });

    listMusicFiles(songData, false).then(() => hideLoader());
  }
};
