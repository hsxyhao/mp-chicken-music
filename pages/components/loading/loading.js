// pages/components/loading/loading.js
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
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function () {
      this.setData({
        show: true
      });
    },
    hide: function () {
      this.setData({
        show: false
      });
    },
    toggle: function () {
      let show = this.data.show;
      this.setData({
        show: !show
      });
    }
  }
})
