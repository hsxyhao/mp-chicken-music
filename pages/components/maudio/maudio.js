// pages/components/maudio/maudio.js
import { formatMusicTime, promise } from '../../../utils/util.js'
import { Base64 } from '../../../utils/base64.js'
import { Lyric } from '../../../utils/lyric-parser.js'
import { lyrics } from '../../../utils/data.js'
import { PLAYMODE } from '../../../utils/playlist.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    song: {
      type: Object,
      value: null
    },
    play: {
      type: Boolean,
      value: false
    },
    list: {
      type: Array,
      value: null
    },
    playMode: {
      type: Object,
      value: PLAYMODE.loop
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    show:false,
    wrapper:null,
    maskWrapper: null
  },
  ready: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    _createAnimation(duration, delay) {
      return wx.createAnimation({
        duration: duration,
        timingFunction: "linear",
        delay: delay
      });
    },
    _queryHeight: function (callback) {
      var query = wx.createSelectorQuery().in(this)
      query.select('#list_wrapper').boundingClientRect(function (res) {
        res
      }).exec(function(res) {
        let height = res[0].height
        callback && callback(height);
      })
    },
    show: function () {
      var that = this;
      that.setData({
        show: true
      });
      this._queryHeight(function (h) {

        let maskWrapper = that._createAnimation(800, 0, 'linear');
        maskWrapper.opacity(1).step();
        let anima = that._createAnimation(800, 0, 'linear');
        anima.translate3d(0, -h, 0).step();

        that.setData({
          wrapper: anima.export(),
          maskWrapper: maskWrapper.export()
        });
      })
    },
    hide: function () {
      var that = this;
      let anima = that._createAnimation(500, 0, 'linear');
      anima.translate3d(0, 0, 0).step();
      let maskWrapper = that._createAnimation(500, 0, 'linear');
      maskWrapper.opacity(0).step();

      that.setData({
        wrapper: anima.export(),
        maskWrapper: maskWrapper.export()
      });
      setTimeout(function () {
        that.setData({
          show: false
        });
      }, 500);
    },
    showPlay: function(e) {
      this.triggerEvent("showPlayEvent")
    },
    toggle: function () {
      this.triggerEvent("toggleEvent")
    },
    switchSong: function (e) {
      let i = e.currentTarget.dataset.i;
      let song = this.data.list[i];
      if (!song||song.mid === this.data.song.mid) {
        return;
      }
      this.triggerEvent("switchSongEvent", { song: song})
    },
    getLyric: function (index) {
      return lyrics[index];
    },
    updateLyric: function (line) {
      this.palyPage.lineNumUpdate(line.lineNum);
    },
    _chageMode: function () {
      this.triggerEvent('changeModeEvent')
    },
  }
})
