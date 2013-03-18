/*global socket,prompt,io */
window.onload = function(){
    var socket = io.connect();
    socket.on('connect', function(){
        // send a join event with your name
        socket.emit('join', prompt('What is your nickname?'));

        frame();
    });

    function frame () {
        var k = [];
        if (keys.left.down){
            k.push('left');
        }
        if (keys.right.down){
            k.push('right');
        }
        if (keys.space.down){
            k.push('space');
        }
        socket.emit('key', k.join(' '));
        // window.requestAnimationFrame(frame);
        setTimeout(frame, 50);
    }

};
