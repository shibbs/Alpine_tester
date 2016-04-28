function testServer(tests, serial) {
  var testObjects = require(tests).testObjects;

  var fs = require('fs');
  var PORT = 3000;
  var AlpineTest = require('./AlpineTest').AlpineTest;
  var app = require('express')();
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  var sp = require("serialport");
  var SerialPort = sp.SerialPort;
  var serialPort = new SerialPort("/dev/tty.usbmodem" + serial, {
    baudrate: 115200,
    parser: sp.parsers.readline("\n")
  }, false);
  var chalk = require('chalk');
  var table = require('text-table');

  var mSocket;
  var mAssert = '';
  var mAssertListen = false;
  var mRecordSerial = false;
  var mSerialRecording = '';
  var mAssertTimeout;
  var mCommandTimeout;
  var mTestInst;
  var mResult;
  var mAssertSatisfy = false;
  var mAssertGoal;
  var mAssertPreviousTime = 0;
  var mAssertCount = 0;

  var mIntervalTest = false;
  var mDurationTest = false;
  var mTotalPhotoTest = false;
  var mSrampTest = false;
  var mErampTest = false;

  var mCurrTest = 0;
  var mTimestamp = 0;
  var mTests = [];

  var lastStepsTaken = 0; // for Sramping
  var lastShutterVal = 0; // for Eramping
  var lastISOVal = 0; // for Eramping

  function nop(result) {}

  // ********************************************************************************
  // * Initialization

  io.on('connection', function(socket) {
    console.log(chalk.green("Radian App connected!"));
    mSocket = socket;
    startSerial();
    socket.on('result', commandResult);
  });

  console.reset = function() {
    return process.stdout.write('\033c');
  };

  server.listen(PORT, function() {
    console.log(chalk.green('Alpine TestServer online. \nListening on port: ' + PORT + '\n'));
  });

  // ********************************************************************************
  // * SerialPort Analysis

  function startSerial() {
    serialPort.open(function(error) {
      if (error) {
        console.log(chalk.red('Failed to open serial port: ' + error));
      } else {
        console.log(chalk.green('Opened serial port. . . \nRunning tests. . . \n'));
        resetApp();
        serialPort.on('data', assertionListen);
      }
    });
  }

  // * Listen for assertion
  function assertionListen(data) {
    if (mRecordSerial) {
      mSerialRecording += data.replace(/\r?\n|\r/g, "\n");
      mSerialRecording = (' ' + mSerialRecording).slice(1);
    }

    if (mAssertListen) { // Only check the data if we're actually listening for it.
      if (mAssertSatisfy) {
        clearRecording(); // Don't record. We need real time data.
        if (mIntervalTest) verifyInterval(data);
        else if (mDurationTest) verifyDuration(data);
        else if (mTotalPhotoTest) verifyTotalPhotos(data);
        else if (mSrampTest) verifySramp(data);
        else if (mErampTest) verifyEramp(data);
      } else {
        if (mRecordSerial) { // If we've been recording then check the record
          if (mSerialRecording.includes(mAssert)) {
            assertResult('pass'); // Fail result comes from timeout
            clearRecording();
          }
        } else { // If we're not recording then just listen to the data stream
          if (data.includes(mAssert)) {
            assertResult('pass'); // Fail result comes from timeout
            clearRecording();
          }
        }
      }
    }
  }

  // ********************************************************************************
  // * Verification

  // * Verifies TL interval
  function verifyInterval(data) {
    if (mAssertCount == mAssertGoal) {
      assertResult('pass');
    } else {
      if (data.includes(mAssert)) { // Time this and count it
        if (mAssertCount == 0) {
          mAssertPreviousTime = Date.now();
          mAssertCount++;
        } else {
          if (Date.now() - mAssertPreviousTime >= (mAssertInterval - 30) && Date.now() - mAssertPreviousTime <= (mAssertInterval + 30)) {
            // console.log(Date.now() - mAssertPreviousTime);
            mAssertCount++;
            mAssertPreviousTime = Date.now();
          } else {
            if (mAssertCount < 3) {
              mAssertCount++;
              return;
            }
            console.log(chalk.red("\t\tInterval Timer blew it."));
            mAssertCount = 0;
            assertResult('fail');
          }
        }
      }
    }
  }

  // * Verifies total TL duration
  function verifyDuration(data) {
    if (mAssertPreviousTime === 0) mAssertPreviousTime = Date.now();
    if (data.includes(mAssert)) {
      // console.log(Date.now() - mAssertPreviousTime);
      if (Date.now() - mAssertPreviousTime >= mAssertDuration - 5000 && Date.now() - mAssertPreviousTime <= (mAssertDuration + 5000)) {
        assertResult('pass');
      } else {
        assertResult('fail');
      }
    }
  }

  // * Verifies total photos
  function verifyTotalPhotos(data) {
    if (mAssertCount == mAssertGoal) {
      assertResult('pass');
    } else {
      if (data.includes(mAssert)) {
        mAssertCount++;
      }
    }
  }

  function verifySramp(data) {
    if (data.includes(mAssert)) {
      // Extract number out of the serial print containing assert
      // Example: #steps actually taken: , 20 <-- we want to pull this number out
      var currStepsTaken = data.match(/\d+/g)[2];
      // console.log(currStepsTaken);

      // Make sure lastStepsTaken is not init value of 0, it should have a non-zero step value stored.
      if (lastStepsTaken) {
        if (currStepsTaken > lastStepsTaken) assertResult('pass');
      }
      lastStepsTaken = currStepsTaken;
    }
  }

  function verifyEramp(data) {
    if (data.includes(mAssert)) {
      if (mAssert.includes('shutter')) {
        // Extract hex code out of the serial print containing assert
        // Example: setting shutter. Index: 15, Code: 0x00000050 <-- we want to pull this hex value
        var currShutterVal = data.match(/[0-9A-Fa-x]{10}/gi);
        console.log(currShutterVal);

        // We want to know the general trend of these shutter values
        if (parseInt(lastShutterVal)) {
          if (parseInt(currShutterVal) > parseInt(lastShutterVal)) assertResult('pass');
        }
        lastShutterVal = currShutterVal;

      } else if (mAssert.includes('ISO')) {
        // Extract hex code out of the serial print containing assert
        // Example: setting ISO. Index: 0, Code: 0x00000064 <-- we want to pull this hex value
        var currISOVal = data.match(/[0-9A-Fa-x]{10}/gi);
        console.log(currISOVal);

        // We want to know the general trend of these shutter values
        if (parseInt(lastISOVal)) {
          if (parseInt(currISOVal) > parseInt(lastISOVal)) assertResult('pass');
        }
        lastISOVal = currISOVal;
      }
    }
  }

  // * Enumerates through test suite
  function testDone(result) {
    if (result == 'pass') {
      console.log(chalk.yellow(mTestInst.getName()) + " completed with result: " + chalk.green(result) + "\n");
    } else {
      console.log(chalk.yellow(mTestInst.getName()) + " completed with result: " + chalk.red(result) + "\n");
    }

    mCurrTest++;
    if (mCurrTest < testObjects.length) {
      resetApp();
    } else {
      console.log(chalk.green("All tests completed!"));
      reportResults();
    }
  }

  // ********************************************************************************
  // * Commands

  // * Sends command from test object to the client for execution
  function executeCommand(command, timeout) {
    mRecordSerial = true;
    if(!mCommandTimeout) {
      mCommandTimeout = setTimeout(commandTimeout, timeout);
      console.log("\t\t" + prettyDate() + " ~ Executing command: " + chalk.yellow(JSON.stringify(command)));

      switch(command[0]) {
        case 'click':
          mAssertSatisfy = false;
          mSocket.emit(command[0], command[1]);
          break;

        case 'wait':
          setTimeout(function() {
            commandResult({ result: 'pass' });
          }, command[1]);
          break;

        case 'listen':
          commandResult({ result: 'pass' });
          mAssertSatisfy = true;
          break;

        case 'query':
          if (command[1].type == 'interval') {
            mAssertSatisfy = true;
            mIntervalTest = true;
            mAssertGoal = command[1].goal;
          } else if (command[1].type == 'duration') {
            mAssertSatisfy = true;
            mDurationTest = true;
          } else if (command[1].type == 'totalPhotos') {
            mAssertSatisfy = true;
            mTotalPhotoTest = true;
          }
          mSocket.emit(command[0], command[1]);
          break;

        case 'set':
          if (command[1].type == 'duration') {
            mAssertSatisfy = false;
            mDurationTest = false;
          } else if (command[1].type == 'sramp') {
            mAssertSatisfy = true;
            mSrampTest = true;
          } else if (command[1].type == 'eramp') {
            mAssertSatisfy = true;
            mErampTest = true;
          }
          mSocket.emit(command[0], command[1]);
          break;

        default:
          mSocket.emit(command[0], command[1]);
          break;
      }
    }
  }

  // * Evaluates result from executeCommand
  function commandResult(result) {
    if (result.timestamp <= (mTimestamp + 5)) {
      console.log(chalk.red("Bullshit response received: " + result.timestamp));
      console.trace();
      return;
    }

    mTimestamp = result.timestamp;

    if (result.result == 'pass') {
      console.log("\t\t" + prettyDate() + " ~ Command got result: " + chalk.green(result.result));
    } else {
      console.log("\t\t" + prettyDate() + " ~ Command got result: " + chalk.red(result.result));
    }

    if (mAssertSatisfy) {
      switch(result.type) {
        case 'interval':
          // Assertion interval is now the interval of the timelapse.
          mAssertInterval = result.value;
          break;
        case 'duration':
          // Our duration is total duration of the timelapse.
          mAssertDuration = result.value;
          break;
        case 'totalPhotos':
          // Our goal is now the total number of photos.
          mAssertGoal = result.value;
          break;
      }
    }

    clearTimeout(mCommandTimeout);
    mCommandTimeout = undefined;
    mTestInst.onCommandDone(result);
  }

  // * Timeout to make sure tests keep moving if something fails
  function commandTimeout() {
    console.log("\t\t" + prettyDate() + " ~ Command timed out: " + chalk.red("fail"));
    mCommandTimeout = undefined;
    mTestInst.onCommandDone('fail');
  }

  // ********************************************************************************
  // * Assertions

  function assertResult(result) {
    if (result == 'pass') {
      console.log("\t\t" + prettyDate() + " ~ Assert got result: " + chalk.green(result));
    } else {
      console.log("\t\t" + prettyDate() + " ~ Assert got result: " + chalk.red(result));
    }
    clearAssert();
    mTestInst.onAssertDone(result);
  }

  function assertTimeout() {
    console.log("\t\t" + prettyDate() + " ~ Assert timed out: " + chalk.red("fail"));
    // console.log(mSerialRecording);
    clearAssert();
    mTestInst.onAssertDone('fail');
  }

  function listenForAssert(assert, timeout) {
    mAssert = assert;
    console.log("\t\t" + prettyDate() + " ~ Listening for assertion: " + chalk.yellow(mAssert));
    mAssertListen = true;
    mAssertTimeout = setTimeout(assertTimeout, timeout);
  }

  function clearAssert() {
    mAssert = '';
    mAssertListen = false;
    mSerialRecording = '';
    mRecordSerial = false;
    mAssertCount = 0;
    clearTimeout(mAssertTimeout);
  }

  // ********************************************************************************
  // *  Helpers

  // * Purge recorded serial data
  function clearRecording() {
    mSerialRecording = '';
    mRecordSerial = false;
  }

  // * Doesn't actually do anything yet
  function resetApp() {
    runTest();
  }

  // * Runs test
  function runTest() {
    mTestInst = AlpineTest(testObjects[mCurrTest]);
    mTests.push(mTestInst);
    console.log("Running test " + (mCurrTest + 1) + " of " + testObjects.length + ": " + chalk.yellow(mTestInst.getName()));
    mTestInst.run(executeCommand, listenForAssert, testDone);
  }

  // * Formats a pretty date
  function prettyDate() {
    var theTimeIsNow = new Date(Date.now());
    var hors = theTimeIsNow.getHours();
    var mens = theTimeIsNow.getMinutes();
    var sex = theTimeIsNow.getSeconds();
    return hors + ":" + mens + ":" + sex;
  }

  // * Prints final report & exits
  function reportResults() {
    console.log("\n\n|---------------- RESULTS ---------------|");
    var prettyTable = [];
    for (var t in mTests) {
      var reportingTest = mTests[t];
      if (reportingTest.mResult == 'pass')
        prettyTable.push([chalk.yellow(reportingTest.mName) + ": ", chalk.green.bold(reportingTest.mResult)]);
      else
        prettyTable.push([chalk.yellow(reportingTest.mName) + ": ", chalk.red.bold(reportingTest.mResult)]);

      for (var i in reportingTest.mInstructions) {
        var reportingInstruction = reportingTest.mInstructions[i];

        if (reportingInstruction.result == 'pass')
          prettyTable.push(['\t' + "- " + reportingInstruction.name, chalk.green(reportingInstruction.result)]);
        else
          prettyTable.push(['\t' + "- " + reportingInstruction.name, chalk.red(reportingInstruction.result)]);
      }
    }
    console.log(table(prettyTable));
    console.log("Exiting...");
    process.exit();
  }
}

testServer(process.argv[2], process.argv[3]);
