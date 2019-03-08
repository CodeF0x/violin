module.exports = function openDirectory(path, event) {
  const isSupported = require('./is-supported');
  const fs = require('fs');
  globalFiles = [];

  fs.readdir(path[0], (err, files) => {
    files.forEach(file => {
      if (isSupported(file)) {
        globalFiles.push({
          name: file,
          path: path[0] + '/' + file
        });
      }
    });
    event.sender.send('music-files', globalFiles);
  });
};
