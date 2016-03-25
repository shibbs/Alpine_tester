var testInit = function() {
  console.log("Connecting to the test server...");
  var socket = io.connect("http://10.1.10.124:3000");

  var pass = function(dataObject) {
    console.log("Returning result: Pass");

    // Default return object
    var resultObject = {
      result: 'pass',
      timestamp: Date.now(),
      type: '',
      value: ''
    };

    // If it's a specific data object, we pass that in as well.
    if (dataObject) {
      resultObject.value = dataObject.value;
      resultObject.type = dataObject.type;
    }

    socket.emit('result', resultObject);
  };

  var fail = function() {
    console.log("Returning result: Fail");
    socket.emit('result', {
      result: 'fail',
      timestamp: Date.now()
    });
  };

  // ********************************************************************************
  // * Actions the client responds to

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
    pass();
    $(element).click();
  });

  socket.on('query', function(data) {
    var type = data.type;
    console.log("Querying: " + type);
    var dataObject = { type: 'interval', value: RadianApp.app.visibleTimeLapse.get('intervalSeconds') * 1000 };
    pass(dataObject);
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

  socket.on('camSetting', function(data) {
    var setting = data.setting;
    var index = data.index;
    var dataObject = { type: "cameraSetting", value: 0 };

    switch(setting) {
      case 'shutter':
        console.log('Testing Shutter...');
        for (var i = 0; i < index; i++) shutterFrame.next();
        dataObject.value = GetShutterCode(index);
        pass(dataObject);
        break;

      case 'aperture':
        console.log('Testing Aperture...');
        for (var i = 0; i < index; i++) apertureFrame.next();
        dataObject.value = GetApertureCode(index);
        pass(dataObject);
        break;

      case 'iso':
        console.log('Testing ISO...');
        for (var i = 0; i < index; i++) isoFrame.next();
        dataObject.value = GetIsoCode(index);
        pass(dataObject);
        break;
    }
  });

  socket.on('resetSetting', function(data) {
    var setting = data.setting;
  })
};
