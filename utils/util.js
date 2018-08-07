const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatMusicTime = n => {
  let time = n | 0;
  let second = time % 60;
  let minute = time / 60 | 0;
  let timeStr = '';
  timeStr = timeStr.concat(minute);
  timeStr = timeStr.concat(':');
  if (second < 10) {
    timeStr = timeStr.concat('0');
  }
  timeStr = timeStr.concat(second);
  return timeStr;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}

const promise = (target,id) => {
  return new Promise(function (resolve, reject) {
    let query = wx.createSelectorQuery().in(target)
    query.select(`#${id}`).boundingClientRect(function (res) {
      res
    }).exec(function (elements) {
      resolve(elements[0])
    })
  });
}

const queryWidth = (component,selector,callback) => {
  var query = wx.createSelectorQuery().in(component)
  query.selectAll(selector).boundingClientRect(function (res) {
    res
  }).exec(function (res) {
    callback && callback(res)
  })
}

const queryHeight = (component, selector, callback) => {
  var query = wx.createSelectorQuery().in(component)
  query.selectAll(selector).boundingClientRect(function (res) {
    res
  }).exec(function (res) {
    callback && callback(res)
  })
}

module.exports = {
  formatTime: formatTime,
  formatMusicTime: formatMusicTime,
  wxPromisify: wxPromisify,
  promise: promise,
  queryWidth: queryWidth,
  queryHeight: queryHeight
}
