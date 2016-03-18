var testInit = function(){

    console.log("Connecting to the test server...");

    var socket = io.connect("http://10.1.10.124:3000");

    var pass = function(){
        socket.emit('result', {result: 'pass'});
    };

    var fail = function(){
        socket.emit('result', {result: 'fail'});
    };


    socket.on('connect', function() {
        console.log("Connected!");
    });

    socket.on('navigate', function(data) {
        window.location.hash = data;
        console.log("Navigating to: " + data);
        setTimeout(pass, 250);
    });

    socket.on('click', function(data) {
        console.log("Clicking: " + data);
        $(data).click();
        setTimeout(pass, 250);
    });
}
