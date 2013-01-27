/*global Bullet,bullets,Sprite,sprites,w,h*/
function Ship(){
	this.x = Math.floor(w/2);
	this.y = Math.floor(h*0.9);

	this.sprite = new Sprite(sprites, this.w, this.h, [[272, 551]]);
}
Ship.prototype = {
	x: 0,
	y: 0,
	w: 28,
	h: 16,
	jump: 4,
	lastBullet: new Date().getTime(),
	timeBetweenBullets: 500,
	draw: function(){
		var o = this.offset();
		this.sprite.draw(0, this.x - o.x, this.y - o.y);
	},
	offset: function(){
		return {
			x: Math.floor(this.w/2),
			y: Math.floor(this.h/2)
		};
	},
	jumpLeft: function(){
		this.x-=this.jump;
		this.x = this.x < 10 ? 10 : this.x;
	},
	jumpRight: function(){
		var maxR = w - this.w - 10;
		this.x+=this.jump;
		this.x = this.x > maxR ? maxR : this.x;
	},
	canShoot: function(){
		return (new Date().getTime() - this.lastBullet) > this.timeBetweenBullets;
	},
	shoot: function(){
		this.lastBullet = new Date().getTime();
		bullets.push(new Bullet({
			x: this.x,
			y: this.y,
			ship: this
		}));
	}
};