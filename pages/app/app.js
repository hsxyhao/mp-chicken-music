import { singerDetails, dissDetails, topListDetails } from '../../utils/api.js'
import { Singer } from '../../domain/singer.js'
import { createSong, getMusicVKey} from '../../domain/song.js'
import { Audio } from '../../utils/mini_audio.js'
import { PLAYMODE, PlayList, chageMode } from '../../utils/playlist.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [],
    avatar: '',
    state: false,
    song: null,
    mini: false,
    playlist: null
  },
  switchContainer: function () {
    let index = this.nav.data.current;
    this.container.switchTab(index);
  },
  moveEvevnt: function () {
    let index = this.container.data.currentIndex;
    this.nav.switchNoEvent(index);
  },
  onReady: function () {
    this.container = this.selectComponent("#container");
    this.nav = this.selectComponent("#nav");
    this.details = this.selectComponent("#details");
    this.play = this.selectComponent("#play_music");
    this._initAudio();
    this._bindTimeUpdate();
    this.setData({
      'playlist': new PlayList()
    })
  },
  _initAudio: function () {
    this.audio = new Audio();
  },
  _bindTimeUpdate: function () {
    var that = this;
    let play = this.play;
    this.audio.context.onTimeUpdate(function () {
      if (play.data.showPlay) {
        play.timeUpdate(that.audio.context.currentTime);
      }
    });
    this.audio.context.onEnded(function () {
      let song = that.data.playlist.getNextSong();
      that.setData({
        'song': song,
        'state': false
      });
      that._playMusic(song, false);
      that.setData({
        'state': true
      });
    });
  },
  topListDetail: function (e) {
    console.log(e)
    let detail = e.detail.details;
    this.setData({
      avatar: detail.picUrl,
      name: detail.topTitle
    });
    topListDetails(detail.id).then((res)=>{
      let ret = [];
      if (res.code === 0) {
        let ret = [];
        this.details.top();
        res.songlist.forEach((item) => {
          ret.push(createSong(item.data))
        })
        this.setData({
          detailList: ret
        });
        this.details.show()
      }
    });
  },
  zhidaClick: function (e) {
    this._singerDetail(e.detail.singer);
  },
  searchClick: function (e) {
    let song = e.detail.song;
    this.setData({
      'song': song,
      'mini': true,
      'state': true
    });
    let playlist = this.data.playlist;
    if (playlist.addSong(song)) {
      playlist.updatewWxml(this, 'playlist.list');
    }
    this._playMusic(song,true);
  },
  recomDetail: function (e) {
    let song = e.detail.song;
    var that = this;
    this.setData({
      avatar: song.imgurl,
      name: song.dissname
    });
    dissDetails(song.dissid).then((res) => {
      let ret = [];
      if (res.code === 0) {
        let ret = [];
        this.details.normal();
        res.cdlist[0]['songlist'].forEach((item) => {
          ret.push(createSong(item))
        })
        this.setData({
          detailList: ret
        });
        this.details.show()
      }
    })
  },
  _singerDetail: function (singer) {
    var that = this;
    if (!singer.id) {
      return;
    }
    this.setData({
      avatar: singer.avatar,
      name: singer.name
    });
    singerDetails(singer.id).then((res) => {
      let ret = [];
      that.details.normal();
      if (res.code === 0) {
        let ret = [];
        res.data.list.forEach((item) => {
          ret.push(createSong(item.musicData))
        })
        that.setData({
          detailList: ret
        });
        that.details.show()
      }
    })
  },
  singerDetail: function (e) {
    let id = e.detail.id;
    let name = e.detail.name;
    this._singerDetail(new Singer(id, name))
  },
  _playMusic: function (song, show) {
    getMusicVKey(song.mid, (u) => {
      song.url = u; 
      this.setData({
        'song': song,
        'mini': true,
        'state': true
      });
      this.audio.newPlay(song);
      if (show) {
        this.play.show();
      }
    })
  },
  playMusic: function (e) {
    let song = e.detail.song;
    if (this.data.song && this.data.song.mid === song.mid) {
      this.play.show();
      return;
    }
    this.setData({
      'song': song,
      'mini': true, 
      'state': true
    });
    let playlist = this.data.playlist;
    if (playlist.addSong(song)) {
      playlist.updatewWxml(this,'playlist.list');
    }
    this._playMusic(song,true);
  },
  showPlayPage: function () {
    this.play.show(this.data.song);
  },
  playSeek: function (e) {
    this.audio.seek(Math.floor(e.detail.t))
  },
  togglePlay: function (e) {
    let state = !this.data.state;
    if (state) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
    this.setData({
      'state': state
    })
  },
  changeMode: function (e) {
    let mode = chageMode(this.data.playlist.playMode.code);
    console.log(mode)
    this.setData({
      'playlist.playMode': mode
    })
  },
  prev: function () {

  },
  next: function () {

  }
})