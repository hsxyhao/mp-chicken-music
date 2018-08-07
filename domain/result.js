import { filterSinger, createSong } from './song.js'

function getResultsFromList(list) {
  if (!list || !list.length) {
    return null;
  }
  let ret = [];
  list.forEach(function (item) {
    if (item.albummid !== '') {
      let song = createSong(item)
      song.singer = filterSinger(item.singer)
      ret.push(song)
    }
  })
  return ret;
}

module.exports = {
  getResultsFromList: getResultsFromList
}