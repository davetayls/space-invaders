/*global Car,TO_RADIANS,drawRotatedImage,preload */

var canvas  = document.getElementById('canvas'),
	c       = canvas.getContext('2d'),
	w       = canvas.width,
	h       = canvas.height,
	sprites = getImage('sprites.png')
;

var x=10,y=10;

function draw () {
	c.clearRect(0, 0, w, h);
	c.fillStyle="#fff";
	c.fillRect(0,0,w,h);
	drawSprite(c, sprites, 30, 100, 200, 200, 20, 20);
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

