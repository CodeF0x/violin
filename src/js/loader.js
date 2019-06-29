/**
 * @function showLoader
 * @description Shows the loading animation when loading a folders contents.
 */
module.exports.showLoader = function() {
  loader.style.display = 'inline-block';
};

/**
 * @function hideLoader
 * @description Hides the loading animation.
 */
module.exports.hideLoader = function() {
  loader.style.display = 'none';
};
