
import { songVKey } from '../utils/api.js'

const Song = function ({ id, mid, singer, name, album, duration, image, url }) {
  this.id = id
  this.mid = mid
  this.singer = singer
  this.name = name
  this.album = album
  this.duration = duration
  this.image = image
  this.url = url
}

const createSong = function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  });
}

const getMusicVKey = (mid,callback) => {
  songVKey(mid).then((res) => {
    if (res.code === 0) {
      callback && callback(`http://dl.stream.qqmusic.qq.com/C400${mid}.m4a?vkey=${res.data.items[0].vkey}&guid=3034680215&uin=0&fromtag=66`)
    }
  }).catch(()=>{
    console.warn('media resource not found')
  });
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

module.exports = {
  Song: Song,
  createSong: createSong,
  getMusicVKey: getMusicVKey,
  filterSinger: filterSinger
}