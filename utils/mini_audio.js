// 创建音乐播放器

var audio = null;

function _initAudio() {
  audio = wx.createInnerAudioContext();
  audio.autoplay = true;
}
function _bindEvent(option) {
  // audio.onPlay = option && option.onPlay;
  // audio.onPause = option && option.onPause;
  // audio.onStop = option && option.onStop;
  // audio.onEnded = option && option.onEnded;
  // audio.onTimeUpdate = option && option.onTimeUpdate;
  // audio.onError = option && option.onError;
  // audio.onWaiting = option && option.onWaiting;
  // audio.onSeeking = option && option.onSeeking;
  // audio.onWaiting = option && option.onWaiting;
}

function _exportProperty(obj) {
  obj.startTime = audio.startTime;
  obj.loop = audio.loop;
  obj.duration = audio.duration;
  obj.paused = audio.paused;
  obj.buffered = audio.buffered;
  obj.volume = audio.volume;
}

const Audio = function (options) {
  if (audio != null) {
    return;
  }
  _initAudio();
  _bindEvent(options);
  _exportProperty(this);
  this.context = audio;
  this.song = null;
  this.observers= [];
}

Audio.prototype.play = function () {
  this.context.play() 
}

Audio.prototype.stop = function () {
  this.context.stop()
}

Audio.prototype.pause = function () {
  this.context.pause()
}

Audio.prototype.seek = function (t) {
  this.context.seek(t)
}

Audio.prototype.toggle = function () {
  this.context.toggle()
}

Audio.prototype.newPlay = function (song) {
  if (!song.url) {
    throw new Error("song's url is invalid");
  }
  this.song = song;
  if (!song.image) {
    song.image = '/static/imgs/default.png'
  }
  this.duration = song.duration;
  this.context.src = song.url;
  this.context.play();
  return song;
}

function getCurrentAudio() {
  return audio;
}

module.exports = {
  Audio: Audio,
  getCurrentAudio: getCurrentAudio
}