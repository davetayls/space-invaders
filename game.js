/*global images,measuring,TO_RADIANS,Sprite */

var canvas  = document.getElementById('canvas'),
	c       = canvas.getContext('2d'),
	w       = canvas.width,
	h       = canvas.height
;
// share the context
images.context = measuring.context = c;

// setup sprites
var sprites = images.getImage('sprites.png'),
	invader1 = new Sprite(sprites, 32, 16, [[10,523]]),
	invader2 = new Sprite(sprites, 32, 16, [[131,523]]),
	ship     = new Sprite(sprites, 28, 16, [[272, 551]]),
	bullet   = new Sprite(sprites, 28, 18, [[191, 523]])
;

var x=10,y=10;

function draw () {
	c.clearRect(0, 0, w, h);
	c.fillRect(0,0,w,h);
	invader1.draw(0, 50, 50);
	invader2.draw(0, 150, 50);
	ship.draw(0, 50, 450);
	bullet.draw(0, 50, 250);
}
function step () {
}
function frame () {
	step();
	draw();
	window.requestAnimationFrame(frame);
}


// start the game
frame();

