// pages/components/sdetails/sdetails.js

import { createAnimation } from '../../../utils/animation.js'
import { queryHeight } from '../../../utils/util.js'
import { DETAILS_MODE } from '../../../utils/details.js'

const padding_top = 60;
let pixelRatio = 2;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {            
      type: Array,     
      // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 'null'     
      // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    avatar: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '周杰伦',
    scaleAnima: null,
    translateAnima: null,
    detailsAnima: null,
    posY: 0,
    disY: 0,
    isScroll: true,
    scrollZ: 9,
    height: 0,
    details_mode: DETAILS_MODE.NORMAL
  },
  ready: function () {
    var that = this;
    queryHeight(this, '#details_img', (res) => {
      let height = Math.round(res[0]['0'].height)
      that.setData({
        height: height
      })
      that.data.maxUpTranslate = -height + padding_top;
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    top: function () {
      if (this.data.details_mode === DETAILS_MODE.TOP) {
        return;
      }
      this.setData({
        details_mode: DETAILS_MODE.TOP
      })
    },
    normal: function () {
      if (this.data.details_mode === DETAILS_MODE.NORMAL) {
        return;
      }
      this.setData({
        details_mode: DETAILS_MODE.NORMAL
      })
    },
    scroll: function (e) {
      this.data.disY += e.detail.deltaY;
      let translate = this.data.disY;
      if (translate > 0) {
        if (this.data.scrollZ === 300) {
          this.setData({
            'scrollZ': 9
          });
        }
        const percent = Math.abs(translate*2 / this.data.height);
        translate /= 2;
        this._imgScaleAima(0, 0, 1 + percent);
      } else {
        if (this.data.scrollZ === 9) {
          this.setData({
            'scrollZ': 300
          });
        } 
        translate = Math.max(translate, this.data.maxUpTranslate)
      }
      this._scrollPullAnima(0,0, translate);
    },
    _scrollPullAnima: function (du,da,y) {
      let translate = createAnimation(du, da);
      translate.translate3d(0,y,0).step();
      this.setData({
        translateAnima: translate.export()
      });
    },
    _imgScaleAima: function (du, de,percent) {
      let scale = createAnimation(du, de);
      scale.scale(percent).step();
      this.setData({
        scaleAnima: scale.export()
      });
    },
    show: function () {
      let show = createAnimation(200,0);
      show.translate3d('0',0,0).opacity(1).step();
      this._scrollPullAnima(0, 0, 0);
      this._imgScaleAima(0, 0, 1);
      this.setData({
        detailsAnima: show.export()
      })
    },
    hide: function () {
      let hide = createAnimation(200, 0);
      hide.translate3d('100%', 0, 0).opacity(0).step();
      this.setData({
        detailsAnima: hide.export()
      })
    },
    playMusic: function (e) {
      let index = e.currentTarget.dataset['i'];
      let song = this.data.list[index];
      if (song) {
        this.triggerEvent('playMusicEvent',{
          song:song
        })
      }
    }
  }
})
