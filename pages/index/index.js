const app = getApp();

Page({
  data: {
    imgUrls: [
      'http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/305119.jpg',
      'http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/306834.jpg',
      'http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/306957.jpg',
      'http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/306657.jpg'
    ],
    player: app.player,
    indicatorDots: false,
    autoplay: true,
    circular:true,
    interval: 3000,
    duration: 300,
    app:app,
    player: app.player,
    musics:[
      {
        img:'http://p.qpic.cn/music_cover/llTQ9l2AeicK2OLIORnsUdpjeVgFc5mUe0kOdSfInhTlalehfhcEatA/600?n=1',
        singer:'风少',
        desc:'Ambient Pop：催眠冥想的氛围'
      },
      {
        img: 'http://p.qpic.cn/music_cover/QKCAlQCrzO1He8bMWM7FBEjqGSRDEpicYxcOjmiajQocrf8e40uIFsbQ/600?n=1',
        singer: '傲娇软萌雪染酱',
        desc: '20部感人肺腑的恋爱催泪番'
      },
      {
        img: 'http://p.qpic.cn/music_cover/xJLWlNicFPzWw3p1m4U86nY3efOib83qxdt3UibeWjib9LYTrDo4OHiao6w/600?n=1',
        singer: 'Jane&Danny',
        desc: '夏日傍晚乘凉特辑'
      },
      {
        img: 'http://p.qpic.cn/music_cover/UCJDptU3vGgQt6PS5Hn6C0ar8qdbP90xVwYbEibWOYNuoJNdbm8q2iag/600?n=1',
        singer: '五品带砖侍卫',
        desc: '在 古 风 中 品 读 历 史 人 物'
      },
      {
        img: 'http://p.qpic.cn/music_cover/tmk5HNSnJvJhsOvcIpWulbrowia33pn5libLI3zj3a4Y2XOYZ66yeM5w/600?n=1',
        singer: 'biG橘子',
        desc: '清吧音乐：惬意梦幻的巴萨诺瓦女声'
      },
    ]
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  togglePlay: function () {
    let play = this.data.player.playing;
    if (play) {
      // todo close code
    } else {
      // todo play code
    }
    app.player.playing = !play;
    this.setData({
      player: app.player
    });
  },
  goPlay: function () {
    wx.hideTabBar({
      aniamtion:false
    })
    wx.navigateTo({
      url: '/pages/play/play',
    })
  }
})
