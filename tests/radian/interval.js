exports.testObjects = [

  // * INTERVAL
  {
    name: 'Intervals',
    instructions: [{
      name: 'verify interval',
      command: ['query', { type: 'interval', goal: 6 }],
      assertion: 'TL_StartPhoto',
      timeout: 300000
    }]
  },
];
