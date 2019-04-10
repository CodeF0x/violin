module.exports = function search(e, list, query) {
  for (let i = 0; i < list.length; i++) {
    const searchedText = list[i].firstChild.innerText.toLowerCase();
    if (query.trim() === '') {
      list[i].style.display = 'flex';
    } else if (searchedText.includes(query)) {
      list[i].style.display = 'flex';
    } else {
      list[i].style.display = 'none';
    }
  }
};
