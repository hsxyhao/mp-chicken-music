// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audio:null
  },
  container: {},
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
  }
})