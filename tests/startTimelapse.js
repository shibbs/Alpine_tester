exports.testObjects = [
  {
    // * TL TESTS
    name: 'Start Timelapse',
    instructions: [{
      name: 'navigate home',
      command: ['navigate', 'home'],
      assertion: undefined,
      timeout: 30000
    }, {
      name: 'click new TL',
      command: ['click', '#newTimeLapse'],
      assertion: undefined,
      timeout: 30000
    }, {
      name: 'navigate to upload',
      command: ['navigate', '#timelapse/upload'],
      assertion: undefined,
      timeout: 30000
    }, {
      name: 'validate TL packet',
      command: ['click', '#timelapse'],
      assertion: 'valid_pkt',
      timeout: 30000
    }, {
      name: 'run TL',
      command: undefined,
      assertion: 'tl_stepping: Exit',
      timeout: 30000
    }]
  },

  {
    // * TAKE PHOTOS
    name: 'Take Photos',
    instructions: [{
      name: 'detect photos',
      command: undefined,
      assertion: 'TL_StartPhoto',
      timeout: 30000
    }]
  }
];
