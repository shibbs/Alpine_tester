var PORT = 3000;
var AlpineTest = require('./AlpineTest').AlpineTest;
var app = require('express')();
var testObjects = require('./testObjects').testObjects;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sp = require("serialport");
var SerialPort = sp.SerialPort;
var serialPort = new SerialPort("/dev/tty.usbmodem14241", {
  baudrate: 115200,
  parser: sp.parsers.readline("\n")
}, false);
var chalk = require('chalk');

var mSocket;
var mAssert = '';
var mAssertListen = false;
var mAssertTimeout;
var mCommandTimeout;
var mTestInst;
var mResult;
var mCallback;
var mCurrTest = 0;

function nop(result){}

io.on('connection', function(socket) {
    console.log(chalk.green("Radian App connected! Running tests..."));
    mSocket = socket;

    startSerial();

    socket.on('result', commandResult);
});

server.listen(PORT, function() {
    console.log(chalk.green('TestServer online. \nListening on port: ' + PORT+'\n'));
});

function startSerial(){
    serialPort.open(function (error) {
      if ( error ) {
        console.log(chalk.red('failed to open serial port: '+error));
      }
      else {
        console.log(chalk.green('opened serial port...'));

        resetApp();

        serialPort.on('data', function(data) {
          if(mAssertListen){
              if(data.includes(mAssert)){
                  // Tell the test it passed
                  clearAssert();
                  mCallback('pass');
              }
          }
        });
      }
    });
}

function testDone(result){
    if(result == 'pass')
        console.log(chalk.yellow(mTestInst.getName()) + " completed with result: "+chalk.green(result));
    else {
        console.log(chalk.yellow(mTestInst.getName()) + " completed with result: "+chalk.red(result));

    }
    mCurrTest++;
    if(mCurrTest < testObjects.length){
        resetApp();
    }
    else{
        console.log(chalk.green("All tests completed."));
        process.exit();
    }
}

function resetApp(){
    /*// Make sure we're always at the start of the app when running a test.
    console.log("Resetting App...");
    executeCommand(['navigate', 'home'], 1000, runTest);
    */
    runTest();
}

function runTest(){
    mTestInst = new AlpineTest(testObjects[mCurrTest]);

    console.log("Running test "+(mCurrTest+1) +" of "+ testObjects.length+ ": " + chalk.yellow(mTestInst.getName()));

    mTestInst.run(executeCommand, listenForAssert, testDone);
}

function executeCommand(command, timeout, callback){
    mCallback = callback;
    mCommandTimeout = setTimeout(commandTimeout, timeout);
    console.log("\t\tExecuting command: "+JSON.stringify(command));

    mSocket.emit(command[0], command[1]);
}

function commandResult(result){
    console.log("\t\tCommand got result: "+result.result);
    clearTimeout(mCommandTimeout);
    mCallback(result.result);
}

function commandTimeout(){
    console.log("\t\tCommand timed out");
    mCallback('fail');
}

function assertTimeout(){
    console.log("\t\tAssert timed out");
    clearAssert();
    mCallback('fail');
}

function listenForAssert(assert, timeout, callback){
    console.log("\t\tListening for assertion: "+chalk.yellow(assert));
    mCallback = callback;
    mAssert = assert;
    mAssertListen = true;
    mAssertTimeout = setTimeout(assertTimeout, timeout);
}

function clearAssert(){
    mAssert = '';
    mAssertListen = false;
    clearTimeout(mAssertTimeout);
}
