// * AlpineTester
// ***********************************************************************
function AlpineTester() {
    this.displayTestInfo = function(test) {
        console.log("Name: " + test.name);
        console.log("Instructions: " + JSON.stringify(test.instructions));
    },

    this.run = function(test) {
        this.displayTestInfo(test);
        return "PASS!";
    }
}

// ***********************************************************************

// * Tests & Reports Array to hold before and after data.
var tests = [], reports = [];

// * Push testObjects into tests array.
for (test in testObjects) tests.push(testObjects[test]);

// * RUN TESTS!
var AlpineTester = new AlpineTester();
for (test in tests) {
    reports.push(AlpineTester.run(tests[test]));
}

// * Print reports.
console.log(reports);
