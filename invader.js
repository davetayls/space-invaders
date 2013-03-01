/*global Sprite,sprites,w,h, measuring,eachClean*/
var INVADER_SPRITES = {
	GREEN: 0,
	PINK: 1,
	HIT: 2
};

function Invader(opt){
	this.sprite = new Sprite(sprites, this.w, this.h, [
		[10, 523],  // green
		[131, 523], // pink
		[191, 523]  // hit
	]);
	this.spriteIndex = opt.spriteIndex || this.spriteIndex;
	this.x = opt.x || this.x;
	this.y = opt.y || this.y;
}
Invader.prototype = {
	x: 0,
	y: 0,
	w: 32,
	h: 16,
	isHit: false,
	points: 10,
	jump: 4,
	spriteIndex: INVADER_SPRITES.GREEN,
	draw: function(){
		var o = this.offset();
		this.sprite.draw(this.spriteIndex, this.x - o.x, this.y - o.y);
	},
	offset: function(){
		return {
			x: Math.floor(this.w/2),
			y: Math.floor(this.h/2)
		};
	},
	move: function(){
		this.y-=this.jump;
		this.y = this.y < -100 ? -100 : this.y;
	},
	checkHit: function(xy){
		var isHit = measuring.distance({ x: this.x, y: this.y }, xy) < 20;
		if (!this.isHit && isHit){
			this.isHit = new Date().getTime();
			this.spriteIndex = INVADER_SPRITES.HIT;
			addScore(this.points);
			return true;
		}
		return false;
	},
	isDestroyed: function(){
		if (this.isHit){
			var since = new Date().getTime() - this.isHit;
			return since > 1000;
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
			spriteIndex: opt.spriteIndex || 0,
			x: x + self.x,
			y: 0
		}));
	});
}
InvaderLine.prototype = {
	x: 0,
	y: 0,
	spacing: 50,
	jump: 10,
	jumpY: 25,
	jumpYEdge: 'left',
	jumpDir: 1, // 1 for right, -1 for left
	lastMove: new Date().getTime(),
	moveWait: 100,
	draw: function(){
		var self = this;
		this.invaders.forEach(function(invader, i){
			invader.y = self.y;
			invader.draw();
		});
	},
	width: function(){
		this.w = this.w || this.spacing * this.invaders.length;
		return this.w;
	},
	onEdge: function(){
		var onRight = this.x + this.width() >= (w - 25),
			onLeft  = this.x <= 50
		;
		return { left: onLeft, right: onRight };
	},
	getJump: function(){
		var edge = this.onEdge(),
			y    = 0
		;
		if (edge.left){
			this.jumpDir = 1;
			if (this.jumpYEdge !== 'left'){
				y = this.jumpY;
				this.jumpYEdge = 'left';
			}
		}
		if (edge.right){
			this.jumpDir = -1;
			if (this.jumpYEdge !== 'right'){
				y = this.jumpY;
				this.jumpYEdge = 'right';
			}
		}
		return {
			y: y,
			x: y === 0 ? this.jump * this.jumpDir : 0
		};
	},
	getJumpY: function(){

	},
	move: function(){
		var self = this, jump;

		if (new Date().getTime() - this.lastMove > this.moveWait){
			jump = this.getJump();
			this.x+= jump.x;
			this.y+= jump.y;
			eachClean(this.invaders, function(invader, i){
				invader.x+= jump.x;
				if (invader.isDestroyed()){
					return true;
				}
			});
			this.lastMove = new Date().getTime();
		}
	},
	checkHit: function(xy){
		var hit = false,
			ln  = this.invaders.length;
		while(ln--){
			if (this.invaders[ln].checkHit(xy)){
				hit = true;
			}
		}
		return hit;
	},
	notHit: function(){
		var notHit = [];
		this.invaders.forEach(function(invader){
			if (!invader.isHit){
				notHit.push(invader);
			}
		});
		return notHit;
	}
};

