var testObjects = {
    basicTest: {
        name: "Basic Test",
        instructions:[{
            name: "Click This Tag",
            command: ["click","$TAG"],
            assertion: "firmware said this",
            timeout: 120
        },
        {
            name: "My Second Instruction",
            command: ["setField","$FieldName", 0],
            assertion: undefined,
            type: 'positive',
            timeout: 360
        }]
    },

    photoTest: {
        name: "Photo Test",
        instructions:[{
            name: "Check # of Photos.",
            command: ["click","$TAG"],
            assertion: "firmware said this",
            timeout: 120
        }]
    },

    ISOTest: {
        name: "ISO Test",
        instructions:[{
            name: "Check that ISO control is functional.",
            command: ["click","$TAG"],
            assertion: "firmware said this",
            timeout: 120
        }]
    },

    ApertureTest: {
        name: "Aperture Test",
        instructions:[{
            name: "Check that Aperture control is functional.",
            command: ["click","$TAG"],
            assertion: "firmware said this",
            timeout: 120
        }]
    },

    ShutterSpeedTest: {
        name: "Shutter Speed Test",
        instructions:[{
            name: "Check that Shutter Speed control is functional",
            command: ["click","$TAG"],
            assertion: "firmware said this",
            timeout: 120
        }]
    }
};
