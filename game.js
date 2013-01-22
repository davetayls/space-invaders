/*global Car,TO_RADIANS,drawRotatedImage */

var canvas  = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	ctxW    = canvas.width,
	ctxH    = canvas.height
;

function speedXY (rotation, speed) {
	return {
		x: Math.sin(rotation * TO_RADIANS) * speed,
		y: Math.cos(rotation * TO_RADIANS) * speed * -1,
	};
}

var x=10,y=10;
function draw (car) {
	context.clearRect(0,0,ctxW,ctxH);
	drawRotatedImage(car.img, car.x, car.y, car.rotation);
	drawPoint(car.collisions.top.getXY());
	drawPoint(car.collisions.right.getXY());
}
function step (car) {
	if (car.code === 'player'){

		// constantly decrease speed
		if (!car.isMoving()){
			car.speed = 0;
		} else {
			car.speed *= car.speedDecay;
		}
		// keys movements
		if (keys[key.UP])  { car.accelerate(); }
		if (keys[key.DOWN]){ car.decelerate(); }
		if (keys[key.LEFT]){ car.steerLeft(); }
		if (keys[key.RIGHT]){car.steerRight(); }

		var speedAxis = speedXY(car.rotation, car.speed);
		car.x += speedAxis.x;
		car.y += speedAxis.y;

		// info
		elPX.innerHTML = Math.floor(car.x);
		elPY.innerHTML = Math.floor(car.y);
	}
}


function frame () {
	step(player);
	draw(player);
	window.requestAnimationFrame(frame);
}

frame();


