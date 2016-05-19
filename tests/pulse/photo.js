exports.testObjects = [

  // * PHOTO
  {
    name: 'Take Photo',
    instructions: [{
      name: 'navigate to Photo',
      command: ['navigate', 'photo'],
      assertion: undefined,
      timeout: 5000
    }, {
      name: 'toggle to connect',
      command: ['toggle', ''],
      assertion: undefined,
      timeout: 5000
    }, {
      name: 'wait...',
      command: ['wait', 3000],
      assertion: undefined,
      timeout: 30000
    }, {
      name: 'toggle to connect',
      command: ['toggle', ''],
      assertion: undefined,
      timeout: 5000
    }, {
      name: 'click photo button',
      command: ['click', '.takePhoto'],
      assertion: 'HCI: Sending data',
      timeout: 30000
    }, {
      name: 'wait...',
      command: ['wait', 500],
      assertion: undefined,
      timeout: 30000
    }, {
      name: 'click photo button',
      command: ['click', '.takePhoto'],
      assertion: 'HCI: Sending data',
      timeout: 30000
    }, {
      name: 'wait...',
      command: ['wait', 500],
      assertion: undefined,
      timeout: 30000
    }, {
      name: 'click photo button',
      command: ['click', '.takePhoto'],
      assertion: 'HCI: Sending data',
      timeout: 30000
    }]
  }
];
