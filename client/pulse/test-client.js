var testing = false;

if (testing) {
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
    console.log("Navigating to: "+view);
		$location.path('#/app/' + view);
		$timeout(pass, 1000);
	});

  socket.on('wait', function(time) {
    $timeout(pass, time);
  });

	socket.on('on-click', function(element) {
		console.log("Clicking: " + element);
		ionic.trigger('click', {
			target: document.querySelector(element)
		});
		pass();
	});

	socket.on('on-tap', function(element) {
		console.log("Tapping: " + element);
		ionic.trigger('tap', {
			target: document.querySelector(element)
		});
		pass();
	});

	socket.on('ng-click', function(element) {
		console.log("Clicking: " + element);
		angular.element(document.querySelector(element)).triggerHandler('click');
		pass();
	});

	socket.on('ng-tap', function(element) {
		console.log("Tapping: " + element);
		angular.element(document.querySelector(element)).triggerHandler('tap');
		pass();
	});
}
