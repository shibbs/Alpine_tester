var testInit = function() {

  console.log("Connecting to the test server...");

  var socket = io.connect("http://10.1.10.124:3000");

  var pass = function(code) {
    console.log("Returning result: Pass");
    socket.emit('result', {
      result: 'pass',
      timestamp: Date.now(),
      p: code
    });
  };

  var fail = function() {
    console.log("Returning result: Fail");
    socket.emit('result', {
      result: 'fail',
      timestamp: Date.now()
    });
  };

  socket.on('connect', function() {
    console.log("Connected!");
  });

  socket.on('navigate', function(hash) {
    window.location.hash = hash;
    console.log("Navigating to: " + hash);
    setTimeout(pass, 500);
  });

  socket.on('click', function(element) {
    console.log("Clicking: " + element);
    $(element).click();
    setTimeout(pass, 500);
  });

  socket.on('verify_thumb', function() {
    console.log("Verifying thumbnail...");
    setTimeout(function() {
      if (thumbSuccess == true) {
        pass();
        thumbSuccess = false;
      }
    }, 25000);
  });

  socket.on('camSettingShutter', function(data) {
    console.log('Testing Shutter...');
    var code = GetShutterCode(data.index)
    pass(code);

    setTimeout(function() {
      shutterItemsCallbackMap.active("active", data.index);
    }, 1000);
  });

  socket.on('camSettingAperture', function(data) {
    console.log('Testing Aperture...');
    var code = GetApertureCode(data.index);
    pass(code);

    setTimeout(function() {
      apertureItemsCallbackMap.active("active", data.index);
    }, 1000);
  });

  socket.on('camSettingISO', function(data) {
    console.log('Testing ISO...');
    var code = GetIsoCode(data.index);
    pass(code);

    setTimeout(function() {
      isoItemsCallbackMap.active("active", data.index);
    }, 1000);

  });
};
