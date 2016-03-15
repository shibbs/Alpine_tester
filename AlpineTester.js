var tests = [];
var reports = [];

var basicTest = {
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
};

function AlpineTester() {
    this.displayTestInfo = function(testObject) {
        console.log("Name: " + testObject.name);
        console.log("Instructions: " + testObject.instructions[0].name)
    },

    this.run = function(testObject) {
        this.report(testObject);
        this.displayTestInfo(testObject);
        // return result;
    },

    this.report = function(result) {
        // console.log("Report: " + result);
        // reports.push("Report!");
    }
}

var tester = new AlpineTester();
tester.run(basicTest)
