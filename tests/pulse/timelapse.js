exports.testObjects = [

  // * TIMELAPSE
  {
    name: 'Basic Timelapse',
    instructions: [{
      name: 'navigate to Time Lapse',
      command: ['navigate', 'timelapse'],
      assertion: undefined,
      timeout: 5000
    }, {
    //   name: 'toggle to connect',
    //   command: ['toggle', ''],
    //   assertion: undefined,
    //   timeout: 5000
    // }, {
    //   name: 'wait...',
    //   command: ['wait', 5000],
    //   assertion: undefined,
    //   timeout: 30000
    // }, {
    //   name: 'toggle to connect',
    //   command: ['toggle', ''],
    //   assertion: undefined,
    //   timeout: 5000
    // }, {
      name: 'click Time Lapse & validate TL packet',
      command: ['click', '.TLStart'],
      assertion: 'HCI: Sending data',
      timeout: 30000
    }, {
      name: 'run TL',
      command: undefined,
      assertion: 'BSP_LOG :Signal:',
      timeout: 30000
    }, {
      name: 'wait...',
      command: ['wait', 10000],
      assertion: undefined,
      timeout: 30000
    }, {
      name: 'pause TL',
      command: ['click', '.one'],
      assertion: 'tl_paused: Entry',
      timeout: 30000
    }, {
      name: 'wait...',
      command: ['wait', 5000],
      assertion: undefined,
      timeout: 30000
    }, {
      name: 'resume TL',
      command: ['click', '.two'],
      assertion: 'tl_paused: Unpause',
      timeout: 30000
    }]
  },

  // * PHOTOS
  {
    name: 'Take Photos',
    instructions: [
      {
      name: 'detect photos',
      command: undefined,
      assertion: 'TL_StartPhoto',
      timeout: 30000
    }]
  },

  // * TOTAL PHOTOS
  // {
  //   name: 'Total Photos',
  //   instructions: [{
  //     name: 'verify total photos',
  //     command: ['query', { type: 'totalPhotos'}],
  //     assertion: 'TL_StartPhoto',
  //     timeout: 30000000
  //   }]
  // },

  // * CAMERA SETTINGS
  // {
  //   name: 'Verify Camera Settings',
  //   instructions: [{
  //     name: 'navigate to camera settings page',
  //     command: ['navigate', '#settings/camera'],
  //     assertion: undefined,
  //     timeout: 30000
  //   }, {
  //     name: 'verify shutter speed',
  //     command: ['camSetting', { setting: 'shutter', index: Math.floor(Math.random() * 1) + 10 }],
  //     assertion: 'Set Val :',
  //     timeout: 30000
  //   }, {
  //     name: 'verify aperture',
  //     command: ['camSetting', { setting: 'aperture', index: Math.floor(Math.random() * 1) + 5 }],
  //     assertion: 'Set Val :',
  //     timeout: 30000
  //   }, {
  //     name: 'verify iso',
  //     command: ['camSetting', { setting: 'iso', index: Math.floor(Math.random() * 3) + 7 }],
  //     assertion: 'Set Val :',
  //     timeout: 30000
  //   }]
  // },

  // * THUMBNAILS
  // {
  //   name: 'Verify Thumbnails',
  //   instructions: [{
  //     name: 'navigate to timelapse page',
  //     command: ['navigate', '#timelapse/upload'],
  //     assertion: undefined,
  //     timeout: 30000
  //   }, {
  //     name: 'request thumbnail',
  //     command: ['click', '.preview'],
  //     assertion: undefined,
  //     timeout: 30000
  //   }, {
  //     name: 'bypass thumbnail modal',
  //     command: ['click', '#get-thumb'],
  //     assertion: undefined,
  //     timeout: 30000
  //   }, {
  //     name: 'verify thumbnail request',
  //     command: undefined,
  //     assertion: 'usb_thumb: Init',
  //     timeout: 30000
  //   }, {
  //     name: 'check for valid thumbnail',
  //     command: ['verify_thumb'],
  //     assertion: undefined,
  //     timeout: 40000
  //   }]
  // },
];
