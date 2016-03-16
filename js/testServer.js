var PORT = 3000;
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    setTimeout(function() { socket.emit('click', '#newTimeLapse'); }, 2000);
});

server.listen(PORT, function() {
    console.log('Listening to... ' + PORT)
});
