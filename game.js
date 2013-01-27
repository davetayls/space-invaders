/*global keys,images,measuring,TO_RADIANS,Sprite, Ship, Invader, InvaderLine */

var canvas  = document.getElementById('canvas'),
	c       = canvas.getContext('2d'),
	w       = canvas.width,
	h       = canvas.height
;
// share the context
images.context = measuring.context = c;

// setup sprites
var sprites = images.getImage('sprites.png');

// elements
var ship = new Ship(),
	bullets = [],
	invaders = new InvaderLine({ x: 100, y: 70 })
;

// set up environment
function step () {
	if (keys.left.down){
		ship.jumpLeft();
	}
	if (keys.right.down){
		ship.jumpRight();
	}
	if (keys.space.down && ship.canShoot()){
		ship.shoot();
	}
	bullets.forEach(function(bullet, i){
		if (bullet.inView()){
			bullet.move();
		}
	});
	invaders.move();
}

// draw environment
function draw () {
	c.clearRect(0, 0, w, h);
	c.fillRect(0,0,w,h);
	ship.draw();
	bullets.forEach(function(bullet, i){
		bullet.draw();
	});
	invaders.draw();
}
function frame () {
	step();
	draw();
	window.requestAnimationFrame(frame);
}


// start the game
frame();

