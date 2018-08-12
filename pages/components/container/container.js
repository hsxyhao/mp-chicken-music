// pages/components/container/container.js

import { sowingWap, songList, singerList, topList, hotKeys, search } from '../../../utils/api.js'
import { Singer } from '../../../domain/singer.js'
import { createSong } from '../../../domain/song.js'
import { getResultsFromList } from '../../../domain/result.js'
import { storeSet, storeGet, storeRemove, storeClear, getStoreVals, SEARCH_KEY } from '../../../utils/store.js'

const HOT_NAME = '热门';
const HOT_INDEX = 10;
const FIXED_TITLE_HEIGHT = 30;

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultSrc: '/static/imgs/default.png',
    checked: [
      false,
      false,
      false,
      false
    ],
    index:{
      sowingWap: [
      ],
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 3000,
      duration: 300,
      songList: []
    },
    singer:{
      chars: [],
      singers: [],
      scrollView: 0,
      scrollIndex: 0,
      heights: [],
      fixedTitle: '热门',
      fixedAni: {},
      fixedDisplay: true,
      canScroll: false
    },
    top:{
      tops: [
      ]
    },
    search:{
      hotKeys: null,
      searches: null,
      zhida: null,
      history: [],
      query: ''
    },
    move:{},
    isTouch: false,
    currentIndex: 0,
    posX: 0
  },

  /**
   * 组件的方法列表
   */
  ready: function() {
    this._tabOneDataInit();
  }, 
  methods: {
    _tabOneDataInit() {
      var that = this;
      sowingWap().then(function (res) {
        if (res.code === 0) {
          that.setData({
            'index.sowingWap': res.data.slider
          })
        }
      }).catch(function () {
        console.warn('sowingWap reqeust error')
      })
      songList().then(function (res) {
        if (res.code === 0) {
          that.setData({
            'index.songList': res.data.list
          })
        }
      }).catch(function () {
        console.warn('songList reqeust error')
      });
    },
    _createAnimation(duration, delay) {
      return wx.createAnimation({
        duration: duration,
        timingFunction: "linear",
        delay: delay
      });
    },
    _getListViewHeight: function () {
      var that = this;
      var query = wx.createSelectorQuery().in(this)
      query.selectAll('.list-item').boundingClientRect(function (res) {
        res.top // 这个组件内 #the-id 节点的上边界坐标
      }).exec(function(res){
        let height = [];
        let h = 0;
        let items = res[0];
        for (var item in items) {
          h += items[item].height;
          height.push(h)
        }
        that.setData({
          'singer.heights': height
        })
      })
    },
    _getDataByIndex: function (index) {
      var that = this;
      if (index === 1) {
        this._singerData();
      } else if (index === 2) {
        this._topListData();
      } else if(index === 3) {
        this._hotKeys();
      }
      this.data.checked[index] = true;
    },
    _hotKeys: function () {
      hotKeys().then((res)=>{
        let ret = [];
        if (res.code === 0) {
          for(let i = 0; i < 10; i++) {
            ret.push(res.data.hotkey[i]);
          }
        }
        this.setData({
          'search.hotKeys': ret
        })
      })
      this.setData({
        'search.history': getStoreVals()
      })
    },
    _singerData: function (list) {
      var that = this;
      singerList().then(function (res) {
        if (res.code === 0) {
          let list = res.data.list;
          let map = {
            hot: {
              title: HOT_NAME,
              items: []
            }
          }
          list.forEach((item, index) => {
            if (index < HOT_INDEX) {
              map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
            }
            const key = item.Findex;
            if (!map[key]) {
              map[key] = {
                title: key,
                items: []
              }
            }
            map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
          })
          let hot = [], ret = [], chars;
          for (let key in map) {
            let val = map[key];
            if (val.title.match(/[a-zA-Z]/)) {
              ret.push(val)
            } else if (val.title === HOT_NAME) {
              hot.push(val)
            }
          }
          ret.sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0);
          })
          let concatSingers = hot.concat(ret);
          chars = concatSingers.map((item) => {
            return item.title.substr(0, 1);
          });
          that.setData({
            'singer.singers': concatSingers,
            'singer.chars': chars
          })
          that._getListViewHeight();
        }
      }).catch(function (e) {
        console.warn(`singerList reqeust error: ${e}`)
      })
    },
    /**
     * search
     */
    deleteAll: function () {
      storeClear();
      this.setData({
        'search.history': []
      })
    },
    clear: function () {
      this.setData({
        'search.query': '',
        'search.searches': null,
        'search.zhida': null
      })
    },
    close: function (e) {
      storeRemove(e.target.dataset.k);
      this.setData({
        'search.history': getStoreVals()
      })
    },
    /**
     * 将有效的搜索结果缓存到本地
     */
    _storeResult: function (key, obj) {
      let newHistory = this.data.search.history;
      if (storeSet(key, obj)) {
        newHistory.push(obj);
        this.setData({
          'search.history': newHistory
        })
      }
    },
    /**
     * 搜索结果点击
     */
    zhidaClick: function (e) {
      let zhida = this.data.search.zhida;
      let singer = new Singer(zhida.singermid, zhida.singername)
      let key = zhida.singermid;
      this._storeResult(key, {
        key,
        name: zhida.singername,
        modeType: 'singer'
      })
      this.triggerEvent('zhidaClickEvent', { singer: singer});
    },
    resultClick: function (e) {
      let index = e.currentTarget.dataset.i;
      let song = this.data.search.searches[index];
      let key = song.mid;
      this._storeResult(song.mid, {
        key,
        name: song.name,
        modeType: 'song'
      })
      this.triggerEvent('searchClickEvent', { song: song});
    },
    /**
     * 热门搜索/历史搜索点击
     */
    searchClick: function (e) {
      let val = e.currentTarget.dataset.val;
      this.setData({
        'search.query': val
      })
      this.searchMusic();
    },
    input: function (e) {
      this.setData({
        'search.query': e.detail.value
      })
      this.searchMusic();
    },
    searchMusic: function () {
      let query = this.data.search.query;
      if (!query) {
        return;
      }
      var that = this;
      search(query,1,1,20).then(function (res){
        if (res.code === 0) {
          let ret = getResultsFromList(res.data.song.list)
          if (res.data.zhida.singermid) {
            getResultsFromList(res.data.song.list)
            that.setData({
              'search.searches': ret,
              'search.zhida': res.data.zhida
            })
          } else {
            that.setData({
              'search.searches': ret
            })
          }
        }
      })
    },
    /**
     * recommand
     */
    recomDetail: function (e) {
      let i = e.currentTarget.dataset.i;
      let song = this.data.index.songList[i];
      if (!song) {
        return;
      }
      this.triggerEvent('recomDetailEvent', { song: song })
    },
    /**
     * top
     */
    _topListData: function () {
      topList().then((res) => {
        if (res.code === 0) {
          console.log(res)
          this.setData({
            'top.tops': res.data.topList
          })
        }
      });
    },
    topListDetail: function (e) {
      let i = e.currentTarget.dataset.i;
      let details = this.data.top.tops[i];
      if (!details) {
        return;
      }
      this.triggerEvent('topListDetailEvent', { details: details })
    },
    /**
     * singer
     */
    _moveFixedTitle: function (diff) {
      // 滑动事件自动触发
      let dis = 0;
      let duration = 0;
      if (diff > 0 && diff < FIXED_TITLE_HEIGHT) {
        dis = diff - FIXED_TITLE_HEIGHT;
        duration = 50;
      }
      let fixedAni = this._createAnimation(duration, 0);
      fixedAni.translate3d(0, dis, 0).step();
      this.setData({
        'singer.fixedAni': fixedAni.export()
      });
    },
    touchScroll: function () {
      this.data.singer.canScroll = true;
    },
    singerScroll: function (e) {
      let singer = this.data.singer;
      // 将右边点击栏与滑动事件分开
      if (!singer.canScroll) {
        return;
      }
      let heights = singer.heights;
      let current = e.detail.scrollTop;
      let index = 0;
      if (current <= 0) {
        this._updateScrollIndex(index);
      } else if (current > 0 && current < heights[0]) {
        this._moveFixedTitle(heights[0] - current);
        return;
      }
      for (let i = 0; i < heights.length - 1; i++) {
        let h1 = heights[i];
        let h2 = heights[i + 1];
        if (current > h1 && current < h2) {
          index = i + 1;
          this._moveFixedTitle(h2 - current);
          break;
        }
      }
      this._updateScrollIndex(index);
    },
    singerDetails: function (e) {
      let id = e.currentTarget.dataset.id
      let name = e.currentTarget.dataset.name
      this.triggerEvent('singerDetailEvent', { id: id, name: name })
    },
    _updateScrollIndex: function (index) {
      let singer = this.data.singer;
      if (index !== singer.currentIndex) {
        this.setData({
          'singer.scrollIndex': index,
          'singer.fixedTitle': singer.singers[index].title
        })
      }
    },
    
    rightClick: function (e) {
      let index = e.currentTarget.dataset.index;
      let current = this.data.singer.scrollIndex;
      if (index === current) {
        return;
      }
      this.data.singer.canScroll = false;
      this.setData({
        'singer.scrollView': index,
        'singer.scrollIndex': index,
        'singer.fixedTitle': this.data.singer.singers[index].title
      })
    },
    /**
     * container.js
     */
    switchTab: function (index) {
      let move = this._createAnimation(300,0);
      let str = '-' + (index * 25) + '%';
      move.translate3d(str, 0, 0).step();
      this.data.currentIndex = index;
      this.setData({
        move: move.export()
      });
      var that = this;
      if (!that.data.checked[index]) {
        setTimeout(()=>{
          that._getDataByIndex(index)
        }, 300)
      }
    },
    touchstart: function (e) {
      this.data.isTouch = true;
      this.data.posX = e.touches[0].clientX;
    },
    touchmove: function (e) {
      if (!this.data.isTouch) {
        return;
      }
      let x = e.touches[0].clientX;
      let disX = x - this.data.posX;
      let index = this.data.currentIndex;
      if (Math.abs(disX) > 60) {
        if (disX > 60) {
          index--;
        } else {
          index++;
        }
        if (index < 0) {
          index = 0;
        } else if (index > 3) {
          index = 3;
        }
        this.data.isTouch = false;
        this.switchTab(index);
        this.triggerEvent('moveEvevnt');
      }
    },
    touchend: function (e) {
      this.data.isTouch = false;
    }
  }
})
