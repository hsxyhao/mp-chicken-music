
const createAnimation = (duration, delay, timing) => {
  let t = 'linear' || timing;
  let de = 0 || delay;
  let du = 0 || duration;
  return wx.createAnimation({
    duration: du,
    timingFunction: t,
    delay: de
  })
}

module.exports = {
  createAnimation: createAnimation 
}
