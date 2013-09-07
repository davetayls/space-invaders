/**
 * Start the script when the page is fully loaded
 */
window.onload = function(){

    /**
     * Here are some helper methods for you to output
     * information in to the page.
     *
     * This is really useful instead of console.log or
     * breakpoints because our data is changing
     * so often ... approximately every 16ms
     */
    var output = document.getElementById('output');
    function clearOutput(){
        output.innerHTML = '';
    }
    function addOutput(message){
        output.innerHTML += '\n\n'+ message;
    }

    /**
     * When we're ready to start listening for the
     * leap motion data we should call this and
     * set up the loop.
     */
    var lastKey;
    function startFrame() {

        /**
         * Give leap a callback function to call
         * every ~16ms with frame data
         */
        Leap.loop(function(frame){

            // our dummy controller tells the game to
            //  - go left if the hand is -40mm from the
            //    centre of the leap
            //  - go right if the hand is +40mm from the
            //    centre of the leap
            var xPos = 0; // default to 0

            // our dummy controller tells the game to
            // shoot if there is more than 1 finger visible
            var fingers = frame.fingers.length;

            // send some info to the page
            clearOutput();
            addOutput('hands: '+ frame.hands.length);
            addOutput('fingers: '+ frame.fingers.length);

            // check if there are any hands in view
            if (frame.hands.length){
                var pos = frame.hands[0].palmPosition.map(function(val){
                    return parseInt(val, 10);
                });
                addOutput('palm: '+ JSON.stringify(pos))

                // save the current xPos now that we know
                // we have a hand in view
                xPos = pos[0];
            }

            // get our keys string to send to the server
            var keys = getCurrentKeys(xPos, fingers);
            if (keys){
                lastKey = keys;
                socket.emit('key', keys);
            } else if (lastKey){
                lastKey = null;
                socket.emit('key', '');
            }
        });

    }

    /**
     * space separated string with possible current keys
     * pressed.
     *
     * eg: 'left space' or 'right space' or 'left'
     *
     * @returns {string}
     */
    function getCurrentKeys(xPos, fingers){
        var k = [];

        // if our hand is over 40mm to the left
        if (xPos < -40){
            k.push('left');
        }

        // if our hand is over 40mm to the right
        if (xPos > 40){
            k.push('right');
        }

        // if our hand has more than 1 finger visible
        if (fingers > 1){
            k.push('space');
        }

        // return space separated current keys
        return k.join(' ');
    }


    /**
     * Connect to the socket server to so that we
     * can send messages to the game to control
     * our ship
     */
    var socket = io.connect();
    socket.on('connect', function(){

        /**
         * Tell the game server that we want to join
         * and what our nickname is
         */
        socket.emit('join', prompt('What is your nickname?'));

        /**
         * now that we have joined the game we can start
         * sending frame data
         */
        startFrame();
    });


};




