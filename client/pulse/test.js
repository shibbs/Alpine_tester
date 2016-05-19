if (vm.testing) {
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
    console.log('Connected!');
  });

  socket.on('navigate', function(view) {
    $location.path('app/' + view);
    $timeout(pass, 1000);
  });

  socket.on('toggle', function(item) {
    vm.handleLeftNavigation();
    pass();
  });

  socket.on('click', function(element) {
    console.log("Clicking: " + element);
    pass();
    $timeout(function() {
      angular.element(document.querySelector(element)).triggerHandler('click');
    }, 1000);
  });
}
