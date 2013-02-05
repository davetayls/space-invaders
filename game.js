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
var sprites = images.getImage('sprites.png'),
	logo    = new Sprite(sprites, 350, 170, [ [170, 10] ])
;

// elements
var ship = new Ship(),
	bullets = [],
	invaders = [
		new InvaderLine({ x: 50, y: 50 }),
		new InvaderLine({ x: 50, y: 100, spriteIndex: INVADER_SPRITES.PINK }),
		new InvaderLine({ x: 50, y: 150 })
	]
;
function invadersLeft(){
	var left = 0;
	invaders.forEach(function(line, i){
		left += line.invaders.length;
	});
	return left;
}

// score
var score = 0,
	gameStartTime,
	gameEndTime,
	maxTime = 75000
;
function gameTimeMilliseconds(){
	return new Date().getTime() - gameStartTime;
}
function gameTime(ms){
	var t = ms || gameTimeMilliseconds();
	t = new Date(t);
	return t.getMinutes() + ':' + t.getSeconds();
}
function finalTime(){
	return gameTime(gameEndTime - gameStartTime);
}
function addScore(points){
	var timeDecay = (1 - (gameTimeMilliseconds()/maxTime));
	timeDecay = timeDecay < 0.3 ? 0.3 : timeDecay;
	score += Math.ceil(points * timeDecay);
}

// state
var states = {
		NOT_STARTED: 'NOT_STARTED',
		PLAYING: 'PLAYING',
		WON: 'WON',
		LOST: 'LOST'
	},
	state = states.NOT_STARTED
;

// set up environment
function step () {

	switch (state){
		case states.NOT_STARTED:
			if (keys.left.down || keys.right.down || keys.space.down){
				gameStartTime = new Date().getTime();
				state = states.PLAYING;
			}
			break;
		case states.PLAYING:
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

			if (!invadersLeft()){
				state = states.WON;
				gameEndTime = new Date().getTime();
			}
			break;
	}

}

// draw environment
function draw () {
	c.clearRect(0, 0, w, h);
	c.fillStyle = '#000';
	c.fillRect(0,0,w,h);
	switch (state){
		case states.NOT_STARTED:
			logo.draw(0, (w/2)-170, 100);
			c.font = '18px Arial';
			c.fillStyle = '#fff';
			c.fillText('Press any key to start', 10, h-20);
			break;
		case states.PLAYING:
			ship.draw();
			bullets.forEach(function(bullet, i){
				bullet.draw();
			});
			invaders.forEach(function(line){
				line.draw();
			});
			c.font = '12px Arial';
			c.fillStyle = '#fff';
			c.fillText('Time: '+ gameTime(), 10, h-20);
			c.font = '16px Arial';
			c.fillText('Score: '+ score, 10, h-40);
			break;
		case states.WON:
			logo.draw(0, (w/2)-170, 100);
			c.font = '18px Arial';
			c.fillStyle = '#fff';
			c.fillText('You have WON! Your score is '+ score +'. time: '+ finalTime(), 10, h-20);
			break;
	}
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