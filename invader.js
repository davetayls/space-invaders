/*global Sprite,sprites,w,h, measuring*/
var INVADER_SPRITES = {
	GREEN: 0,
	PINK: 1,
	HIT: 2
};

function Invader(opt){
	this.sprite = new Sprite(sprites, this.w, this.h, [
		[10, 523], // green
		[131, 523] // pink
	]);
	this.x = opt.x || this.x;
	this.y = opt.y || this.y;
}
Invader.prototype = {
	x: 0,
	y: 0,
	w: 32,
	h: 16,
	isHit: false,
	jump: 4,
	spriteIndex: INVADER_SPRITES.GREEN,
	draw: function(){
		this.sprite.draw(this.spriteIndex, this.x, this.y);
	},
	move: function(){
		this.y-=this.jump;
		this.y = this.y < -50 ? -50 : this.y;
	},
	checkHit: function(xy){
		this.isHit = measuring.distance({ x: this.x, y: this.y }, xy) < 10;
		if (this.isHit){
			this.spriteIndex = INVADER_SPRITES.HIT;
		}
	}
};

function InvaderLine(opt){
	this.x = opt.x || this.x;
	this.y = opt.y || this.y;
	this.invaders = [];
	var self = this;
	[0, 50, 100, 150, 200, 250].forEach(function(x, i){
		self.invaders.push(new Invader({
			x: x + self.x,
			y: 0
		}));
	});
}
InvaderLine.prototype = {
	x: 0,
	y: 0,
	spacing: 50,
	jump: 25,
	jumpDir: 1, // 1 for right, -1 for left
	lastMove: new Date().getTime(),
	moveWait: 1000,
	draw: function(){
		var self = this;
		this.invaders.forEach(function(invader, i){
			invader.y = self.y;
			invader.draw();
		});
	},
	width: function(){
		return this.spacing * this.invaders.length;
	},
	onEdge: function(){
		var onRight = this.x + this.width() >= (w - 25),
			onLeft  = this.x <= 25
		;
		return { left: onLeft, right: onRight };
	},
	getJump: function(){
		var edge = this.onEdge();
		if (edge.left){
			this.jumpDir = 1;
		}
		if (edge.right){
			this.jumpDir = -1;
		}
		return this.jump * this.jumpDir;
	},
	move: function(){
		var self = this,
			jump = this.getJump()
		;

		if (new Date().getTime() - this.lastMove > this.moveWait){
			this.x+= jump;
			this.invaders.forEach(function(invader, i){
				invader.x+= jump;
			});
			this.lastMove = new Date().getTime();
		}
	},
	checkHit: function(xy){
		this.invaders.forEach(function(invader){
			invader.checkHit(xy);
		});
	}
};

