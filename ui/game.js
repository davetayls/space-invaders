/*global keys,images,measuring,TO_RADIANS,Sprite, Ship, Invader, InvaderLine, InvaderLineCollection, INVADER_SPRITES */

var canvas  = document.getElementById('canvas'),
	c       = canvas.getContext('2d'),
	w       = canvas.width,
	h       = canvas.height,

	cleanup = { bullets: [], invaders: [] }
;
// share the context
images.context = measuring.context = c;

// setup sprites
var sprites = images.getImage('ui/sprites.png'),
	logo    = new Sprite(sprites, 350, 170, [ [170, 10] ])
;

// elements
var players = [],
	bullets = [],
	invaders = new InvaderLineCollection([
		new InvaderLine({ x: 50, y: 50 }),
		new InvaderLine({ x: 50, y: 100, spriteIndex: INVADER_SPRITES.PINK }),
		new InvaderLine({ x: 50, y: 150 })
	])
;

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
function winningPlayer(){
    var winning, points = 0;
    players.forEach(function(player){
        if (player.ship.points > points){
            winning = player;
        }
    });
    return winning;
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
			if (players.length){
				if (players[0].keys.left.down || players[0].keys.right.down || players[0].keys.space.down){
					gameStartTime = new Date().getTime();
					state = states.PLAYING;
				}
			}
			break;
		case states.PLAYING:
			// controls
			players.forEach(function(player){
				if (player.keys.left.down){
					player.ship.jumpLeft();
				}
				if (player.keys.right.down){
					player.ship.jumpRight();
				}
				if (player.keys.space.down && player.ship.canShoot()){
					player.ship.shoot();
				}
			});

			// elements
			eachClean(bullets, function(bullet, i){
				if (bullet.inView() && !bullet.destroyed){
					bullet.move();
                    var points = 0;
					invaders.forEach(function(line){
                        hitPoints = line.checkHit(bullet.getXY());
                        if (hitPoints > 0){
							bullet.destroyed = true;
						}
                        points += hitPoints;
					});
                    bullet.ship.points += points;
				} else {
					return true;
				}
			});
			invaders.forEach(function(line){
				line.move();
			});

			// check if you have won
			if (!invaders.invadersLeft()){
				state = states.WON;
				gameEndTime = new Date().getTime();
			}

			// check if you have lost
			if (invaders.lowestLine() > h - 60){
				state = states.LOST;
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
            c.textAlign = 'left';
			c.font = '18px Arial';
			c.fillStyle = '#fff';
			c.fillText('Press any key to start', 10, h-20);
			break;
		case states.PLAYING:
			players.forEach(function(player){
				player.draw();
			});
			bullets.forEach(function(bullet, i){
				bullet.draw();
			});
			invaders.draw();
            c.textAlign = 'left';
			c.font = '12px Arial';
			c.fillStyle = '#fff';
			c.fillText('Time: '+ gameTime(), 10, h-20);
			c.font = '16px Arial';
			c.fillText('Score: '+ players.map(function(player){
                return player.nickname +': '+ player.ship.points;
            }).join(', '), 10, h-40);
			break;
		case states.WON:
            var win = winningPlayer();
			logo.draw(0, (w/2)-170, 100);
            c.textAlign = 'left';
			c.font = '18px Arial';
			c.fillStyle = '#fff';
			c.fillText(win.nickname +' has WON! Your score is '+ win.ship.points +'. time: '+ finalTime(), 10, h-20);
			break;
		case states.LOST:
			logo.draw(0, (w/2)-170, 100);
			c.font = '18px Arial';
			c.fillStyle = '#fff';
            c.textAlign = 'left';
			c.fillText('You have LOST!', 10, h-20);
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
Array.prototype.eachClean = function(fn){
	return eachClean(this, fn);
};
