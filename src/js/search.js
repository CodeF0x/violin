/**
 * @function search
 * @description This function searches for the user input in a list of music files.
 * @param {NodeList} list - NodeList containing the music files
 * @param {string} query - the user input
 */
module.exports = function search(list, query) {
  for (let i = 0; i < list.length; i++) {
    const searchedText = list[i].firstChild.innerText.toLowerCase();
    if (query.trim() === '') {
      list[i].style.display = 'grid';
    } else if (searchedText.includes(query)) {
      list[i].style.display = 'grid';
    } else {
      list[i].style.display = 'none';
    }
  }
};
