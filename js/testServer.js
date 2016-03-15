var socket = io.connect("http://10.1.10.40:3000");
console.log("Connecting...");
socket.on('connect', function() {
    console.log("Connected!");
});

socket.on('navigate', function(data) {
    window.location.hash = data;
    console.log("Navigating to: " + data);
});

socket.on('click', function(data) {
    console.log("Clicking: " + data);
    $(data).click();
});
