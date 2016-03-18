function testServer(tests, serial){
  var testObjects = require(tests).testObjects;

  var PORT = 3000;
  var AlpineTest = require('./AlpineTest').AlpineTest;
  var app = require('express')();
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  var sp = require("serialport");
  var SerialPort = sp.SerialPort;
  var serialPort = new SerialPort("/dev/tty.usbmodem"+serial, {
    baudrate: 115200,
    parser: sp.parsers.readline("\n")
  }, false);
  var chalk = require('chalk');
  var table = require('text-table');

  var mSocket;
  var mAssert = '';
  var mAssertListen = false;
  var mAssertTimeout;
  var mCommandTimeout;
  var mTestInst;
  var mResult;
  var mCurrTest = 0;

  var mTimestamp = 0;

  var mTests = [];

  function nop(result){}

  io.on('connection', function(socket) {
      console.log(chalk.green("Radian App connected!"));
      mSocket = socket;

      startSerial();

      socket.on('result', commandResult);
  });

  server.listen(PORT, function() {
      console.log(chalk.green('Alpine TestServer online. \nListening on port: ' + PORT+'\n'));
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
          reportResults();
      }
  }

  function reportResults(){
    console.log("\n\n|-------------- RESULTS --------------|");
    var prettyTable = [];
    for(var t in mTests){
      var reportingTest = mTests[t];

      if(reportingTest.mResult == 'pass')
        prettyTable.push([chalk.yellow(reportingTest.mName)+": ", chalk.green.bold(reportingTest.mResult)]);
      else
        prettyTable.push([chalk.yellow(reportingTest.mName)+": ", chalk.red.bold(reportingTest.mResult)]);

      for(var i in reportingTest.mInstructions){
        var reportingInstruction = reportingTest.mInstructions[i];

        if(reportingInstruction.result == 'pass')
          prettyTable.push([ '\t'+reportingInstruction.name, chalk.green(reportingInstruction.result)]);
        else
          prettyTable.push([ '\t'+reportingInstruction.name, chalk.red(reportingInstruction.result)]);
      }
    }
    console.log(table(prettyTable));

    console.log("Exiting...");
    process.exit();
  }

  /* This doesn't actually do anything yet */
  function resetApp(){
      runTest();
  }

  function runTest(){
      mTestInst = AlpineTest(testObjects[mCurrTest]);
      mTests.push(mTestInst);

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

testServer(process.argv[2], process.argv[3]);
