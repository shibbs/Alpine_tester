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

  socket.on('camSetting', function(data){
    var setting = data.setting;
    var code;

    switch(setting) {
      case 'shutter':
        console.log('Testing Shutter...');
        if (currentShutterIndex === data.index) ++data.index
        code = GetShutterCode(data.index);
        shutterItemsCallbackMap.active("active", data.index);
        pass(code);
        break;

      case 'aperture':
        console.log('Testing Aperture...');
        if (currentApertureIndex === data.index) ++data.index
        code = GetApertureCode(data.index);
        apertureItemsCallbackMap.active("active", data.index);
        pass(code);
        break;

      case 'iso':
        console.log('Testing ISO...');
        if (currentIsoIndex === data.index) ++data.index
        code = GetIsoCode(data.index);
        isoItemsCallbackMap.active("active", data.index);
        pass(code);
        break;
    }
  });

  socket.on('resetSetting', function(data){
    var setting = data.setting;
  })
};
