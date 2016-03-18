exports.testObjects = [
  {
      name: 'Start Timelapse',
      instructions:[
      {
          name: 'Reset App',
          command: ['navigate', 'home'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'click New TimeLapse',
          command: ['click', '#newTimeLapse'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'Navigate to Start TL page',
          command: ['navigate', '#timelapse/upload'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'run timelapse',
          command: ['click', '#timelapse'],
          assertion: "tl_stepping: Exit",
          timeout: 20000
      }
      ]
  },
  {
      name: 'Start Timelapse again',
      instructions:[
      {
          name: 'Reset App',
          command: ['navigate', 'home'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'click New TimeLapse',
          command: ['click', '#newTimeLapse'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'Navigate to Start TL page',
          command: ['navigate', '#timelapse/upload'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'run timelapse',
          command: ['click', '#timelapse'],
          assertion: "tl_stepping: Exit",
          timeout: 20000
      }
      ]
  },
  {
      name: 'Start Timelapse and again',
      instructions:[
      {
          name: 'Reset App',
          command: ['navigate', 'home'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'click New TimeLapse',
          command: ['click', '#newTimeLapse'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'Navigate to Start TL page',
          command: ['navigate', '#timelapse/upload'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'run timelapse',
          command: ['click', '#timelapse'],
          assertion: "tl_stepping: Exit",
          timeout: 20000
      }
      ]
  },
  {
      name: 'Start Timelapse and fail',
      instructions:[
      {
          name: 'Reset App',
          command: ['navigate', 'home'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'click New TimeLapse',
          command: ['click', '#newTimeLapse'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'Navigate to Start TL page',
          command: ['navigate', '#timelapse/upload'],
          assertion: undefined,
          timeout: 3000
      },
      {
          name: 'run timelapse',
          command: ['click', '#timelapse'],
          assertion: "tl_stepping: Exit",
          timeout: 3000
      }
      ]
  }
];
