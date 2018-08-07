const SEARCH_KEY= 'search_'

const storeSet = (key,obj) => {
  try {
    let val = storeGet(key);
    if (val != null && val != "") {
      return false;
    }
    wx.setStorageSync(SEARCH_KEY + key, obj)
    return true
  } catch (e) {
    console.error('setStorageSync error')
    return false
  }
}

const storeGet = (key) => {
  try {
    return wx.getStorageSync(key);
  } catch (e) {
    console.error('getStorageSync error')
  }
}

const storeRemove = (key) => {
  try {
    wx.removeStorageSync(SEARCH_KEY + key)
  } catch (e) {
    console.error('removeStorageSync error')
  }
}

const storeClear = () => {
  try {
    wx.clearStorageSync()
  } catch (e) {
    console.error('clearStorageSync error')
  }
}

const getStoreVals = ()=> {
  try {
    let ret = [];
    let storageInfo = wx.getStorageInfoSync();
    let keys = storageInfo.keys;
    for (let key in keys) {
      let keyStr = keys[key];
      if (keyStr && keyStr.lastIndexOf(SEARCH_KEY)!==-1) {
        ret.push(storeGet(keyStr))
      }
    }
    return ret
  } catch (e) {
    console.error('getStorageInfoSync error')
  }
}

module.exports = {
  storeSet: storeSet,
  storeGet: storeGet,
  storeRemove: storeRemove,
  storeClear: storeClear,
  getStoreVals: getStoreVals
}