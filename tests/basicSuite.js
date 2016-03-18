exports.testObjects = [
    {
        name: 'Basic Test',
        instructions:[
        {
            name: 'Reset App',
            command: ['navigate', 'home'],
            assertion: "usb_off: Entry",
            timeout: 3000
        },
        {
            name: 'New TimeLapse.',
            command: ['click', '#newTimeLapse'],
            assertion: "usb_on: Entry",
            timeout: 3000
        }]
    },

    {
        name: "Photo Test",
        instructions:[
        {
            name: 'Reset App',
            command: ['navigate', 'home'],
            assertion: "usb_init: Exit",
            timeout: 3000
        },
        {
            name: 'New TimeLapse.',
            command: ['click', '#newTimeLapse'],
            assertion: "usb_on: Init",
            timeout: 3000
        }]
    },

    {
        name: "ISO Test",
        instructions:[
        {
            name: 'Reset App',
            command: ['navigate', 'home'],
            assertion: undefined,
            timeout: 3000
        },
        {
            name: 'New TimeLapse.',
            command: ['click', '#newTimeLapse'],
            assertion: undefined,
            timeout: 3000
        }]
    },

    {
        name: "Aperture Test",
        instructions:[
        {
            name: 'Reset App',
            command: ['navigate', 'home'],
            assertion: undefined,
            timeout: 3000
        },
        {
            name: 'New TimeLapse.',
            command: ['click', '#newTimeLapse'],
            assertion: undefined,
            timeout: 3000
        }]
    },

    {
        name: "Shutter Speed Test",
        instructions:[
        {
            name: 'Reset App',
            command: ['navigate', 'home'],
            assertion: undefined,
            timeout: 3000
        },
        {
            name: 'New TimeLapse.',
            command: ['click', '#newTimeLapse'],
            assertion: undefined,
            timeout: 3000
        },
        {
            name: 'Reset App',
            command: ['navigate', 'home'],
            assertion: "Never gonna hear this!",
            timeout: 3000
        }]
    }
];
