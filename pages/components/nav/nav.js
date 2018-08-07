// pages/components/nav/nav.js
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
    tabs:[
      "推荐",
      "歌手",
      "排行",
      "搜索"
    ],
    current: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _switch: function (index) {
      if (index == this.data.current) {
        return;
      }
      this.setData({
        current: index
      });
    },
    switch: function (e) {
      let index = e.currentTarget.dataset['index'];
      this._switch(index);
      this.triggerEvent('switchEvent');
    },
    switchNoEvent: function (index) {
      this._switch(index);
    }
  }
})
