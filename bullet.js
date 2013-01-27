/*global Sprite,sprites,w,h*/
function Bullet(opt){
	this.sprite = new Sprite(sprites, this.w, this.h, [[191, 523]]);
	this.x = opt.x || this.x;
	this.y = opt.y || this.y;
	this.ship = opt.ship;
}
Bullet.prototype = {
	x: 0,
	y: 0,
	w: 28,
	h: 18,
	jump: 4,
	draw: function(){
		this.sprite.draw(0, this.x, this.y);
	},
	move: function(){
		this.y-=this.jump;
		this.y = this.y < -50 ? -50 : this.y;
	},
	inView: function(){
		return this.y > -50;
	}
};