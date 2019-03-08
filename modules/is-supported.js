module.exports = function isSupported(file) {
  const parts = file.split('.');
  const format = parts[parts.length - 1].toLowerCase();
  switch (format) {
    case 'wav':
      return true;
    case 'mp3':
      return true;
    case 'mp4':
      return true;
    case 'adts':
      return true;
    case 'ogg':
      return true;
    case 'webm':
      return true;
    case 'flac':
      return true;
    default:
      return false;
  }
};
