// pages/components/scroll/scroll.js

import { createAnimation } from '../../../utils/animation.js'
var slideBgColors = 'green,gray,blueviolet,blue,rebeccapurple,yellowgreen,gold,darkslategray,brown,darkslategray'.split(',');
var deceleration = 0.005;//阻尼系数,越小越快
function momentum(current, start, time, lowerMargin, wrapperSize) {
  var distance = current - start,
    speed = Math.abs(distance) / time,
    destination,
    duration;
  destination = current + speed / deceleration * (distance < 0 ? -1 : 1);
  duration = speed / deceleration;

  if (destination < lowerMargin) {
    destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
    distance = Math.abs(destination - current);
    duration = distance / speed;
  } else if (destination > 0) {
    destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
    distance = Math.abs(current) + destination;
    duration = distance / speed;
  }
  return {
    destination: Math.round(destination),
    duration: duration
  };
}
function getTime() {
  return +new Date()
}
var bounceTime = 500, sysInfo = wx.getSystemInfoSync();
var windowWidth = sysInfo.windowWidth;
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
    slideBgColors,
    distX: 0,
    duration: 0,
    scrollWidth: 100000
  },
  x: 0,
  maxScrollX: 0,
  wrapperWidth: windowWidth,
  /**
   * 组件的方法列表
   */
  ready() {
    var sum = 0, that = this;

    wx.createSelectorQuery().selectAll('.slide').boundingClientRect(function (rects) {
      //计算scroller宽度和可滚动距离
      rects.forEach(rect => sum += rect.width);
      that.maxScrollX = that.wrapperWidth - sum;
      that.setData({
        scrollWidth: sum
      })
    }).exec();
  },
  methods: {
    _start(e) {
      var point = e.touches[0];
      this.moved = false;
      this.distX = 0;

      this.startTime = getTime();
      this.lastMoveTime = getTime();
      this.startX = this.x;
      this.absStartX = this.x;
      this.pointX = point.pageX;
    },
    _move(e) {
      var point = e.touches[0],
        deltaX = point.pageX - this.pointX,
        timestamp = +new Date(),
        newX, absDistX;
      this.pointX = point.pageX;
      this.distX += deltaX;
      absDistX = Math.abs(this.distX);
      // We need to move at least 10 pixels for the scrolling to initiate
      if (timestamp - this.endTime > 300 && absDistX < 10) {
        return;
      }
      newX = this.x + deltaX;
      // Slow down if outside of the boundaries
      if (newX > 0 || newX < this.maxScrollX) {
        newX = this.x + deltaX / 3;
      }
      this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
      this.moved = true;
      debugger
      this._translate(newX);
      if (timestamp - this.startTime > 300) {
        this.startTime = timestamp;
        this.startX = this.x;
        this.startY = this.y;
      }
    },
    _end(e) {
      var momentumX,
        duration = getTime() - this.startTime,
        newX = Math.round(this.x),
        time = 0,
        that = this;
      this.endTime = getTime();

      if (!this.moved) {
        return;
      }
      if (this.resetPosition(bounceTime)) {
        return;
      }
      // start momentum animation if needed
      if (duration < 300 && Math.abs(this.startX - this.x) > 10) {
        momentumX = momentum(this.x, this.startX, duration, this.maxScrollX, this.wrapperWidth);
        newX = momentumX.destination;
        time = momentumX.duration;
        this._translate(newX, time);
        setTimeout(function () {
          that.resetPosition(bounceTime)
        }, time)
      }
    },
    _translate: function (x, time) {
      x = Math.round(x);
      this.setData({
        distX: x,
        duration: time || 0
      });
      this.x = x;
    },
    resetPosition: function (time) {
      var x = this.x,
        time = time || 0;
      if (this.x > 0) {
        x = 0;
      } else if (this.x < this.maxScrollX) {
        x = this.maxScrollX;
      }
      if (x == this.x) {
        return false;
      }
      this._translate(x, time);
      return true;
    }
  }
})
