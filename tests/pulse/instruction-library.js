module.exports = {
  thumbPhoto: {
    name: 'click photo button',
    command: ['on-tap', '#bulbButtonEnd'],
    assertion: 'alpine_ble: send: GET_RECENT_THUMB',
    timeout: 30000
  },
  photoNav: {
    name: 'navigate to Photo page',
    command: ['navigate', 'photo'],
    assertion: undefined,
    timeout: 30000
  },
  videoNav: {
    name: 'navigate to Video page',
    command: ['navigate', 'video'],
    assertion: undefined,
    timeout: 30000
  },
  wait5:{
    name: 'wait 5 seconds',
    command: ['wait', 5000],
    assertion: undefined,
    timeout: 30000
  }
};
