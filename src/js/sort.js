module.exports = {
  sortByName: function() {
    const songData = [];
    const songs = document.querySelectorAll('div[data-file-path]');
    songs.forEach(song => {
      const songObj = {};
      songObj.filePath = song.getAttribute('data-file-path');
      songObj.name = song.querySelectorAll('div')[0].innerText;
      songObj.album = song.querySelectorAll('div')[1].innerText;
      songObj.artist = song.querySelectorAll('div')[2].innerText;

      songData.push(songObj);
    });

    songData.sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase();
    });

    listMusicFiles(songData, false);
  }
};
