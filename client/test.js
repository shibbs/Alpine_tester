var testInit = function(){

    console.log("Connecting to the test server...");

    var socket = io.connect("http://10.1.10.160:3000");

    var pass = function(){
        console.log("Returning result: Pass");
        socket.emit('result', {result: 'pass', timestamp: Date.now()});
    };

    var fail = function(){
        console.log("Returning result: Pass");
        socket.emit('result', {result: 'fail', timestamp: Date.now()});
    };


    socket.on('connect', function() {
        console.log("Connected!");
    });

    socket.on('navigate', function(data) {
        window.location.hash = data;
        console.log("Navigating to: " + data);
        setTimeout(pass, 2000);
    });

    socket.on('click', function(data) {
        console.log("Clicking: " + data);
        $(data).click();
        setTimeout(pass, 2000);
    });
};
