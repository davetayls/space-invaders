/*global keys,images,measuring,TO_RADIANS,Sprite, Ship, Invader, InvaderLine, INVADER_SPRITES */

var canvas  = document.getElementById('canvas'),
	c       = canvas.getContext('2d'),
	w       = canvas.width,
	h       = canvas.height,

	cleanup = { bullets: [], invaders: [] }
;
// share the context
images.context = measuring.context = c;

// setup sprites
var sprites = images.getImage('sprites.png');

// elements
var ship = new Ship(),
	bullets = [],
	invaders = [
		new InvaderLine({ x: 100, y: 50 }),
		new InvaderLine({ x: 50, y: 100, spriteIndex: INVADER_SPRITES.PINK }),
		new InvaderLine({ x: 150, y: 150 })
	]
;

// set up environment
function step () {
	// controls
	if (keys.left.down){
		ship.jumpLeft();
	}
	if (keys.right.down){
		ship.jumpRight();
	}
	if (keys.space.down && ship.canShoot()){
		ship.shoot();
	}

	// elements
	eachClean(bullets, function(bullet, i){
		if (bullet.inView() && !bullet.destroyed){
			bullet.move();
			invaders.forEach(function(line){
				if (line.checkHit(bullet.getXY())){
					bullet.destroyed = true;
				}
			});
		} else {
			return true;
		}
	});
	invaders.forEach(function(line){
		line.move();
	});


}

// draw environment
function draw () {
	c.clearRect(0, 0, w, h);
	// c.fillStyle = '#fff';
	c.fillRect(0,0,w,h);
	ship.draw();
	bullets.forEach(function(bullet, i){
		bullet.draw();
	});
	invaders.forEach(function(line){
		line.draw();
	});
}
function frame () {
	step();
	draw();
	window.requestAnimationFrame(frame);
}


// start the game
frame();


// helpers
function eachClean(arr, fn){
	var ln = arr.length;
	while (ln--){
		if (fn.call(arr, arr[ln], ln) === true){
			arr.splice(ln, 1);
		}
	}
}