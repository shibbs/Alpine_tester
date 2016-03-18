function testServer(){
  var PORT = 3000;
  var AlpineTest = require('./AlpineTest').AlpineTest;
  var app = require('express')();
  var testObjects = require('./testObjects').testObjects;
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  var sp = require("serialport");
  var SerialPort = sp.SerialPort;
  var serialPort = new SerialPort("/dev/tty.usbmodem14221", {
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
  var mCurrTest = 0;

  var mTimestamp = 0;

  function nop(result){}

  io.on('connection', function(socket) {
      console.log(chalk.green("Radian App connected!"));
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
          console.log(chalk.green('opened serial port...\nRUNNING TESTS\n'));

          resetApp();

          serialPort.on('data', function(data) {
            if(mAssertListen){
                if(data.includes(mAssert)){
                    assertResult('pass');
                }
            }
          });
        }
      });
  }

  function testDone(result){
      if(result == 'pass')
          console.log(chalk.yellow(mTestInst.getName()) + " completed with result: "+chalk.green(result)+"\n");
      else {
          console.log(chalk.yellow(mTestInst.getName()) + " completed with result: "+chalk.red(result)+"\n");

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
      delete mTestInst;
      mTestInst = AlpineTest(testObjects[mCurrTest]);

      console.log("Running test "+(mCurrTest+1) +" of "+ testObjects.length+ ": " + chalk.yellow(mTestInst.getName()));

      mTestInst.run(executeCommand, listenForAssert, testDone);
  }

  function executeCommand(command, timeout){
      mCommandTimeout = setTimeout(commandTimeout, timeout);
      console.log("\t\tExecuting command: "+chalk.yellow(JSON.stringify(command)));

      mSocket.emit(command[0], command[1]);
  }

  function commandResult(result){
      if(result.timestamp <= mTimestamp){
        console.log(chalk.red("Bullshit response received: "+result.timestamp));
        return;
      }

      mTimestamp = result.timestamp;

      if(result.result == 'pass'){
        console.log("\t\tCommand got result: "+chalk.green(result.result));
      }else{
        console.log("\t\tCommand got result: "+chalk.red(result.result));
      }
      clearTimeout(mCommandTimeout);
      mTestInst.onCommandDone(result.result);
  }

  function commandTimeout(){
      console.log("\t\tCommand timed out: "+chalk.red("fail"));
      mTestInst.onCommandDone('fail');
  }

  function assertResult(result){
      if(result == 'pass')
        console.log("\t\tAssert got result: "+chalk.green(result));
      else {
        console.log("\t\tAssert got result: "+chalk.red(result));
      }
      clearAssert();
      mTestInst.onAssertDone(result);
  }

  function assertTimeout(){
      console.log("\t\tAssert timed out: "+chalk.red("fail"));
      clearAssert();
      mTestInst.onAssertDone('fail');
  }

  function listenForAssert(assert, timeout){
      console.log("\t\tListening for assertion: "+chalk.yellow(assert));
      mAssert = assert;
      mAssertListen = true;
      mAssertTimeout = setTimeout(assertTimeout, timeout);
  }

  function clearAssert(){
      mAssert = '';
      mAssertListen = false;
      clearTimeout(mAssertTimeout);
  }
}

testServer();
