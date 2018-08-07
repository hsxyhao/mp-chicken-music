const HOST = 'https://www.hsxyhao.com:8080'

const URL = {
  sowing_map: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
  song_list: `${HOST}/getSongList`,
  singer_list: `${HOST}/getSingerList`,
  singer_details: `${HOST}/getSingerDetails`,
  diss_details: `${HOST}/getDissDetails`,
  top_list: `${HOST}/getTopList`,
  top_list_details: `${HOST}/getTopListDetails`,
  hot_keys: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
  search_music: `${HOST}/searchMusic`,
  v_key: `${HOST}/getSongVkey`
}

const METHOD = {
  GET: 'get',
  POST: 'post'
}

const PARAM = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

const ajax = (url,data,method) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      header: {
      },
      method: method,
      dataType: 'json',
      success: function (res) {
        resolve(res.data);
      },
      fail: function (res) { 
        reject()
      }
    })
  })
}

const sowingWap = () => {
  const param = Object.assign({},PARAM,{
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return ajax(URL.sowing_map, param);
}

const songList = () => {
  const param = Object.assign({}, PARAM, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });
  return ajax(URL.song_list,param)
}

const singerList = () => {
  const param = Object.assign({}, PARAM, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    format: 'json'
  })
  return ajax(URL.singer_list, param)
}

const singerDetails = (id) => {
  const param = Object.assign({}, PARAM, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: id
  })
  return ajax(URL.singer_details, param)
}

const dissDetails = (disstid) => {
  const param = Object.assign({}, PARAM, {
    disstid: disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  })
  return ajax(URL.diss_details, param)
}

const topList = () => {
  const param = Object.assign({}, PARAM, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })
  return ajax(URL.top_list, param)
}

const topListDetails = (topid) => {
  const param = Object.assign({}, PARAM, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })
  return ajax(URL.top_list_details, param)
}

const hotKeys = () => {
  const param = Object.assign({}, PARAM, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return ajax(URL.hot_keys, param)
}

const songVKey = (mid) => {
  const param = Object.assign({}, PARAM, {
    songmid: mid,
    filename: 'C400' + mid + '.m4a',
    guid: 3034680215, 
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    format: 'json',
    cid: 205361747,
    uin: 0
  })
  return ajax(URL.v_key, param)
}

const search = (query, page, zhida, perpage)=> {
  const param = Object.assign({}, PARAM, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    format: 'json',
    platform: 'h5'
  })
  return ajax(URL.search_music, param)
}

module.exports = {
  sowingWap: sowingWap,
  songList: songList,
  singerList: singerList,
  singerDetails: singerDetails,
  dissDetails: dissDetails,
  topList: topList,
  topListDetails: topListDetails,
  hotKeys: hotKeys,
  songVKey: songVKey,
  search: search
}

