var tests = [];
var reports = [];

function AlpineTester(_test) {
    this.test = _test;
    this.run = function(test) {
        console.log("Running: " + this.test);
    },

    this.report = function(test) {
        console.log("Report: " + this.test);
    }
}

var test = "Hello!";
var tester = new AlpineTester(test);
tester.run(test)
