// pages/components/play/play.js
import { formatMusicTime, promise } from '../../../utils/util.js'
import { PLAYMODE } from '../../../utils/playlist.js'
import { Lyric } from '../../../utils/lyric-parser.js'
import { getLyric } from '../../../utils/api.js'
import { Base64 } from '../../../utils/base64.js'

Component({
  externalClasses: ['icon-random', 'icon-sequence','icon-loop'],
  /**
   * 组件的属性列表
   */
  properties: {
    isPlaying: {
      type: Boolean,
      value: false
    },
    playMode: {
      type: Object,
      value: PLAYMODE.loop
    },
    song: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    curTime: 0,
    current: '0:00',
    duration: '0:00',
    /**
     * true：部分歌词
     * false: 全屏歌词
     */
    allLyric: false,
    lineNum: 0,
    text: '加载歌词...',
    isLike: false,
    isTouch: false,
    posX: 0,
    showPlay:false,
    transform: '',
    cssStyle: '',
    animations: {
      top: {},
      bottom: {},
      back: {},
      center: {}
    }
  },
  ready: function(){
    var that = this;
    let query = promise(that, 'song_img');
    let element = null;
    this.process = this.selectComponent("#progress");
    let info = wx.getSystemInfoSync();
    this.width = info.windowWidth;
    this.height = info.windowHeight; 
    this.pixelRatio = info.pixelRatio;
  },
  /**
   * 组件的方法列表
   */
  methods: {
    touchstart: function (e) {
      this.data.posX = e.touches[0].clientX;
    },
    touchmove: function (e) {
      let x = e.touches[0].clientX;
      let disX = x - this.data.posX;
      if (Math.abs(disX) > 60) {
        if (disX > 60) {
          this.setData({
            transform: 'transform: translate3d(0px, 0px, 0px);transition-duration: 500ms;',
            cssStyle: 'opacity: 1;transition-duration: 500ms;',
            allLyric: false
          });
        } else {
          this.setData({
            transform: 'transform: translate3d(-100%, 0px, 0px);transition-duration: 500ms;',
            cssStyle: 'opacity: 0;transition-duration: 500ms;',
            allLyric: true
          });
        }
      }
    },
    like: function () {
      let like = !this.data.isLike
      this.setData({
        isLike: like
      });
    },
    back: function () {
      let top = this._createAnimation(500, 0);
      top.translate3d(0, -100, 0).step();
      top.translate3d(0, 0, 0).step();

      let bottom = this._createAnimation(500, 0);
      bottom.translate3d(0, -100, 0).step();
      bottom.translate3d(0, 0, 0).step();

      let back = this._createAnimation(500, 0);
      back.opacity(0).step();

      const { x, y, scale } = this._getPosAndScale();

      let center = this._createAnimation(300, 0);
      center.translate3d(-x, y, 0).scale(scale).step();
      this.setData({
        animations: {
          center: center.export()
        }
      })

      this.setData({
        animations: {
          top: top.export(),
          bottom: bottom.export(),
          back: back.export()
        }
      });
      var that = this;
      setTimeout(function(){
        that.setData({
          showPlay: false
        })
      }, 600)
    },
    _createAnimation(duration, delay, timing) {
      return wx.createAnimation({
        duration: duration,
        timingFunction: timing||"cubic-bezier(0.86,0.18,0.82,1.32)",
        delay: delay
      });
    },
    _getPosAndScale: function () {
      if (this.pos) {
        return this.pos;
      }
      const targetWidth = 40;
      const sourceWidth = 270;
      const left = 20;
      const bottom = 25;
      const top = 120;
      this.pos = {
        x: ((this.width - targetWidth) / 2 - left) ,
        y: (this.height - bottom - sourceWidth / 2 - targetWidth / 2 - top) ,
        scale: targetWidth / sourceWidth
      } 
      return this.pos;
    },
    show: function () {
      this.setData({
        'duration': formatMusicTime(this.data.song.duration)
      })
      let top = this._createAnimation(500,0);
      top.translate3d(0, 118, 0).step();

      let bottom = this._createAnimation(500, 0);
      bottom.translate3d(0, -200, 0).step();

      //背景
      let back = this._createAnimation(0,0);
      back.opacity(1).step();

      const { x, y, scale } = this._getPosAndScale();
      let center = this._createAnimation(500, 0);
      center.translate3d(0, 0, 0).scale(1.05).step();
      center.translate3d(0, 0, 0).scale(1).step({
        duration: 300
      });

      this.setData({
        showPlay: true,
        animations: {
          top: top.export(),
          center: center.export(),
          bottom: bottom.export()
        }
      });
      if (this.data.song && !this.data.song.lyric) {
        this._lyricInit(this.data.song)
      } else {
        let song = this.data.song;
        song.lyric.seek(this.data.curTime * 1000);
        !this.data.isPlaying && song.lyric.stop();
      }
    },
    _lyricInit: function (song) {
      var that = this;
      getLyric(song.mid).then((res) => {
        var ret = res;
        if (typeof ret === 'string') {
          var reg = /^\w+\(({[^()]+})\)$/ // 用来匹配 jsonp 字符串
          var matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1])
            let lyricStr = Base64.decode(ret.lyric)
            let lyric = new Lyric(lyricStr, function ({ lineNum, txt }) {
              if (that.data.allLyric) {
                that.setData({
                  'lineNum': lineNum
                })
              }
              that.setData({
                'text': txt
              })
            })
            that.setData({
              'song.lyric': lyric
            })
            if (that.data.isPlaying) {
              that.data.song.lyric.play(that.data.curTime * 1000)
            }
          }
        }
      })
    },
    setPayingState: function (val) {
      this.setData({
        isPlaying: val
      });
    },
    change: function (song) {
      this.setData({
        song: song
      });
    },
    timeUpdate: function (time) {
      if (!this.process.data.canUpdate) {
        return;
      }
      let timeStr = formatMusicTime(time);
      this.setData({
        curTime: time,
        current: timeStr
      });
    },
    _progressMove: function (e) {
      let t = e.detail.t;
      let lyric = this.data.song && this.data.song.lyric
      if (lyric) {
        lyric.seek(t * 1000);
      }
    },
    _seek: function (e) {
      let t = e.detail.t;
      let lyric = this.data.song && this.data.song.lyric
      if (lyric) {
        lyric.seek(t * 1000);
      }
      this.triggerEvent('playSeekEvevnt', { t: t });
    },
    lineNumUpdate: function (val) {
      this.setData({
        lineNum: val
      });
    },
    _chageMode: function () {
      this.triggerEvent('changeModeEvent')
    },
    _prev: function () {
      this.triggerEvent("prevEvent")
    },
    _next: function () {
      this.triggerEvent("nextEvent")
    },
    _toggle: function () {
      this.triggerEvent("toggleEvent")
      let lyric = this.data.song && this.data.song.lyric
      if (!lyric) {
        return;
      }
      if (this.data.isPlaying) {
        lyric.play(this.data.curTime * 1000)
      } else {
        lyric.stop()
      }
    }
  }
})
