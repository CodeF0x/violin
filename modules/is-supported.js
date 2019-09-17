/**
 * Ref: https://www.chromium.org/audio-video
 */
module.exports = function isSupported(file) {
  const parts = file.split('.');
  const format = parts[parts.length - 1].toLowerCase();
  switch (format) {
    case 'wav':
    case 'mp3':
    case 'mp4':
    case 'm4a':
    case 'oga':
    case 'ogm':
    case 'ogg':
    case 'spx':
    case 'opus':
    case 'webm':  // not supported by music-metadata yet
    case 'flac':
      return true;
    default:
      return false;
  }
};
