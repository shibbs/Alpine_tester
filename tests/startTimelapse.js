exports.testObjects = [

  // // * TIMELAPSE
  // {
  //   name: 'Start Timelapse',
  //   instructions: [{
  //     name: 'navigate home',
  //     command: ['navigate', 'home'],
  //     assertion: undefined,
  //     timeout: 30000
  //   }, {
  //     name: 'click new TL',
  //     command: ['click', '#newTimeLapse'],
  //     assertion: undefined,
  //     timeout: 30000
  //   }, {
  //     name: 'navigate to upload',
  //     command: ['navigate', '#timelapse/upload'],
  //     assertion: undefined,
  //     timeout: 30000
  //   }, {
  //     name: 'validate TL packet',
  //     command: ['click', '#timelapse'],
  //     assertion: 'valid_pkt',
  //     timeout: 30000
  //   }, {
  //     name: 'run TL',
  //     command: undefined,
  //     assertion: 'tl_stepping: Exit',
  //     timeout: 30000
  //   }]
  // },
  //
  // // * PHOTOS
  // {
  //   name: 'Take Photos',
  //   instructions: [{
  //     name: 'detect photos',
  //     command: undefined,
  //     assertion: 'TL_StartPhoto',
  //     timeout: 30000
  //   }]
  // },
  //
  // // * THUMBNAILS
  // {
  //   name: 'Verify Thumbnails',
  //   instructions: [{
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

  // * CAMERA SETTINGS
  {
    name: 'Verify Camera Settings',
    instructions: [{
      name: 'verify shutter speed',
      command: ['camSettingShutter', { index: 3 }],
      assertion: 'Got Shutter Spd Pkt',
      timeout: 30000
    }, {
      name: 'verify aperture',
      command: ['camSettingAperture', { index: 3 }],
      assertion: 'Got Aperture Pkt',
      timeout: 30000
    }, {
      name: 'verify iso',
      command: ['camSettingISO', { index: 3 }],
      assertion: 'Got Iso Pkt',
      timeout: 40000
    }]
  }

];
