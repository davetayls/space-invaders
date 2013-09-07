/*global socket,prompt,io */
window.onload = function(){
    var socket = io.connect();

    socket.on('connect', function(){

        // send a join event with your name
        socket.emit('join', prompt('What is your nickname?'));

        frame();
    });

    /**
     * space separated string with possible current keys
     * pressed.
     *
     * eg: 'left space' or 'right space' or 'left'
     *
     * @returns {string}
     */
    function getCurrentKeys(){
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
        return k.join(' ');
    }

    var lastKey;
    function frame () {
        window.requestAnimationFrame(frame);
        var keys = getCurrentKeys();
        if (keys){
            lastKey = keys;
            socket.emit('key', keys);
        } else if (lastKey){
            lastKey = null;
            socket.emit('key', '');
        }
//        setTimeout(frame, 50);
    }

};
