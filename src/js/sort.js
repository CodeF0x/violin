module.exports = {
  originalOrder: [], // Gets imported in index.js, to become accessible near the end of getSongData
  sortedElement: undefined, // This one is accessed in event-listeners.js
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

  revertSorting: function() {
    listMusicFiles(originalOrder, false);
  },

  sortAlphabetically: function(songData, whatToSort) {
    songData.sort((a, b) => {
      if (a[whatToSort].toLowerCase() < b[whatToSort].toLowerCase()) return -1;
      if (a[whatToSort].toLowerCase() > b[whatToSort].toLowerCase()) return 1;
      return 0;
    });

    listMusicFiles(songData, false);
  }
};
