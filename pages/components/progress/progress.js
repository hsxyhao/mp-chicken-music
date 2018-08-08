// pages/components/progress/progress.js
import { formatMusicTime } from '../../../utils/util.js'
function getSystemScreenRatio() {
  var res = wx.getSystemInfoSync();
  return 750 / res.screenWidth
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    current: {
      type: String,
      // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '0:00'
    },
    duration: {
      type: String,
      value: '0:00'
    },
    curTime: {
      type: Number,
      value: 0
    },
    durTime: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: 0,
    bigLength: 0,
    ratio: 1,
    end: 0,
    start: 0,
    left: 0,
    boxHalfSide: 15,
    canUpdate: true
  },
  ready: function () {
    var that = this;
    this.data.ratio = getSystemScreenRatio();
    this.query((res) => {
      that.setData({
        end: res[0].width,
        start: res[0].left
      })
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _cancel: function () {
      this.data.canUpdate = true
    },
    _start: function () {
      this.data.canUpdate = false
    },
    _end: function () {
      this.data.canUpdate = true
      this.triggerEvent('seekEvent', { t: this.data.curTime });
    },
    _move: function (e) {
      let disX = e.changedTouches[0].pageX - this.data.start;
      let percent = disX / this.data.end;
      if (percent >= 1) {
        percent = 1;
      } else if (percent <= 0) {
        percent = 0
      }
      let newTime = percent * this.data.durTime
      this.setData({
        curTime: newTime,
        current: formatMusicTime(newTime)
      })
      this.triggerEvent('moveEvent', { t: newTime})
    },
    query: function (callback) {
      var that = this;
      let width = 0;
      var query = wx.createSelectorQuery().in(this)
      query.select('#progress_bar').boundingClientRect(function (res) {
        res.width // 这个组件内 #the-id 节点的上边界坐标
      }).exec(function(res){
        callback && callback(res);
      })
    }
  }
})
