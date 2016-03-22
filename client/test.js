var testInit = function() {

  console.log("Connecting to the test server...");

  var socket = io.connect("http://10.1.10.124:3000");

  var pass = function() {
    console.log("Returning result: Pass");
    socket.emit('result', {
      result: 'pass',
      timestamp: Date.now()
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
    setTimeout(pass, 2000);
  });

  socket.on('click', function(element) {
    console.log("Clicking: " + element);
    $(element).click();
    setTimeout(pass, 2000);
  });

  socket.on('verify_thumb', function() {
    console.log("Verifying thumbnail...");
    setTimeout(function() {
      if (thumbSuccess == true) pass();
    }, 25000);
  });
};
