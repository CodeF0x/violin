const { ipcRenderer } = require('electron');
const media = require('jsmediatags');
const player = new Audio();
let {
  progressBar,
  folderButton,
  pauseButton,
  playButton,
  forwardButton,
  backwardButton,
  shuffleButton,
  shuffleButtonActive,
  repeatButton,
  repeatButtonActive,
  sortByNameButton,
  sortByAlbumButton,
  sortByArtistButton,
  searchField,
  base64String,
  globalFiles,
  originalGlobalFiles,
  currentFileInList,
  index,
  isOnRepeat
} = require('./js/variables.js');
const { pause, skip, back, resume } = require('./js/controls.js');
const { listMusicFiles } = require('./js/render.js');
const { play, generateUrl, shuffle, unshuffle } = require('./js/play.js');
const search = require('./js/search.js');
let {
  originalOrder,
  sortedElement,
  getSongData,
  revertSorting,
  sortAlphabetically
} = require('./js/sort.js');
require('./js/event-listener.js');

// On Windows and Linux, a height of 380 px will cause the button to be cut off
const songList = document.getElementById('songs');
switch (process.platform) {
  case 'win32':
    songList.style.maxHeight = '350px';
    break;
  case 'linux':
    songList.style.maxHeight = '340px';
}
