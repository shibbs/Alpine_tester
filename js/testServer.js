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

var mSocket;

var mAssert = '';
var mAssertListen = false;
var mAssertTimeout;

var mCommandTimeout;

var mTestInst;

var mResult;

var mCallback;

var mCurrTest = 0;

io.on('connection', function(socket) {
    mSocket = socket;
    runSerial();

    socket.on('result', commandResult);
});

server.listen(PORT, function() {
    console.log('Listening to... ' + PORT)
});

function runSerial(){
    serialPort.open(function (error) {
      if ( error ) {
        console.log('failed to open serial port: '+error);
      }
      else {
        console.log('opened serial port...');

        runTest();

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
    console.log(mTestInst.getName() + " completed with result: "+result);
    mCurrTest++;
    if(mCurrTest < testObjects.length){
        runTest();
    }
    else{
        console.log("Tests completed!");
        process.exit();
    }
}

function runTest(){
        mTestInst = new AlpineTest(testObjects[mCurrTest]);
        console.log("Running test: " + mTestInst.getName());
        mTestInst.run(executeCommand, listenForAssert, testDone);

}

function executeCommand(command, timeout, callback){
    mCallback = callback;
    mCommandTimeout = setTimeout(commandTimeout, timeout);

    mSocket.emit(command);
}

function commandResult(result){
    clearTimeout(mCommandTimeout);
    mCallback(result)
}

function commandTimeout(){
    console.log("Command timed out");
    mCallback('fail');
}

function assertTimeout(){
    console.log("Assert timed out");
    clearAssert();
    mCallback('fail');
}

function listenForAssert(assert, timeout, callback){
    console.log("Listening for assertion: "+assert);
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
