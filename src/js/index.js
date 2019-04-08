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
const { sortByName } = require('./js/sort.js');
require('./js/event-listener.js');
