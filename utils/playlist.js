const Mode = function (code, font, desc) {
  this.code = code;
  this.font = font;
  this.desc = desc;
}

const chageMode = function (code) {
  code = ++code % 3;
  let target = null;
  switch (code) {
    case 0:
      target = PLAYMODE.sequence
      break;
    case 1:
      target = PLAYMODE.loop
      break;
    case 2:
      target = PLAYMODE.random
    break;
    default:
      target = PLAYMODE.loop
    break;
  }
  return target;
}

const PLAYMODE = {
  sequence: new Mode(0, 'icon-pm-sequence', '顺序播放'),
  loop: new Mode(1, 'icon-pm-loop', '循环播放'),
  random: new Mode(2, 'icon-pm-random', '随机播放')
}

function _randomList(list) {
  if (!list || list.length <= 0) {
    return null;
  }
  let ret = list.slice();
  console.log(`before: ${ret}`)
  let length = ret.length * 0.5;
  for (let i = 0; i < length; ) {
    let random1 = Math.floor(Math.random() * 10 * ret.length);
    let random2 = Math.floor(Math.random() * 10 * ret.length);
    if (random1 !== random2) {
      i++;
      let temp = ret[random1];
      ret[random1] = ret[random2];
      ret[random2] = temp;
    }
  }
  console.log(`after: ${ret}`)
  return ret;
}

const PlayList = function () {
  this.list = [];
  this.length = 0;
  this.sequenceList = this.list;
  this.randomList = _randomList(this.list);
  this.current = 0;
  this.currentSong = null;
  this.playMode = PLAYMODE.loop;
}

PlayList.prototype._getSong = function (index) {
  if (this.playMode == PLAYMODE.loop) {
    return this.currentSong;
  } else {
    let song = this.currentSong;
    switch (this.playMode) {
      case PLAYMODE.sequence:
        song = this.sequenceList[index];
        break;
      case PLAYMODE.random:
        song = this.randomList[index]
        break;
      default:
        break;
    }
    return song;
  } 
}

PlayList.prototype.getNextSong = function () {
  this.currentSong = this._getSong(++this.current % this.length)
  return this.currentSong;
}

PlayList.prototype.getprevSong = function () {
  this.currentSong = this._getSong(--this.current < 0 ? index += this.length : index);
  return this.currentSong;
}

PlayList.prototype.addSongs = function (songs) {
  for (let i = 0; i < songs.length; i++) {
    this.addSong(songs[i]);
  }
}

PlayList.prototype.addSong = function (song) {
  if (this.exist(song)) {
    return false;
  }
  this.list.push(song);
  this.currentSong = song;
  this.length = this.list.length;
  this.sequenceList = _randomList(this.list);
  return true;
}

PlayList.prototype.clear = function () {
  this.list = [];
  this.length = 0;
  this.randomList = [];
  this.current = 0;
  this.currentSong = null;
}

PlayList.prototype.updatewWxml = function (taget,name) {
  let obj = {};
  obj[name] = this.list;
  taget.setData(obj);
}

PlayList.prototype.removeSong = function (song) {
  let length = this.length;
  for (let i = 0; i < length; i++) {
    if (song.mid === this.list[i].mid) {
      this.list.splice(i, 1);
      this.length = this.list.length;
      return true;
    }
  }
  return false;
}

PlayList.prototype.exist = function (song) {
  for (let i = 0; i < this.list.length; i++) {
    if (this.list[i].mid === song.mid) {
      return true;
    }
  }
  return false;
}

module.exports = {
  PLAYMODE: PLAYMODE,
  PlayList: PlayList,
  chageMode: chageMode
}