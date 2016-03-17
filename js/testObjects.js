exports.testObjects = [
    {
        name: 'Basic Test',
        instructions:[{
            name: 'New TimeLapse.',
            command: ['click', '#newTimeLapse'],
            assertion: 'firmware said this',
            timeout: 3000
        },
        {
            name: "My Second Instruction",
            command: ["setField","$FieldName", 0],
            assertion: undefined,
            type: 'positive',
            timeout: 3000
        }]
    },

    {
        name: "Photo Test",
        instructions:[{
            name: "Check # of Photos.",
            command: ["click","$TAG"],
            assertion: "how are you",
            timeout: 3000
        }]
    },

    {
        name: "ISO Test",
        instructions:[{
            name: "Check that ISO control is functional.",
            command: ["click","$TAG"],
            assertion: "great to meet you",
            timeout: 3000
        }]
    },

    {
        name: "Aperture Test",
        instructions:[{
            name: "Check that Aperture control is functional.",
            command: ["click","$TAG"],
            assertion: "produce products",
            timeout: 3000
        }]
    },

    {
        name: "Shutter Speed Test",
        instructions:[{
            name: "Check that Shutter Speed control is functional",
            command: ["click","$TAG"],
            assertion: "sample the products",
            timeout: 3000
        }]
    }
];
