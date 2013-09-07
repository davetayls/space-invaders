/**
 * Module Dependencies
 */
var express = require('express'),
    sio = require('socket.io'),
    join = require('path').join
;

/**
 * Create app
 */
var app = express.createServer(
    express.bodyParser(),
    express.static('public')
);
app.use('/ui', express.static(join(__dirname, '../ui')));

/**
 * Listen
 */
app.listen(3000);

 /**
  * Socket.io
  */
var io = sio.listen(app);

var nicks = {};

io.sockets.on('connection', function(socket){

    socket.on('join', function(name){
        if (!nicks[name]){
            nicks[name] = socket;
            socket.nickname = name;
            socket.broadcast.emit('newplayer', name);
        } else {
            socket.nickname = name;
            socket.broadcast.emit('reconnect', name);
        }
    });

    socket.on('key', function(name){
        socket.broadcast.emit('key', socket.nickname, name);
    });
});




