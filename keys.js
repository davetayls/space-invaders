/**
 * Keyboard helpers
 */
function Key(code){
	this.code = code;
}
Key.prototype = {
	down: false
};

var keys = {
	UP:    new Key(38),
	DOWN:  new Key(40),
	LEFT:  new Key(37),
	RIGHT: new Key(39),
	SPACE: new Key(32)
};

function getKey(code){
	for (var key in keys){
		if (keys.hasOwnProperty(key)){
			if (keys[key].code === code){
				return keys[key];
			}
		}
	}
}

// Keyboard event listeners
window.addEventListener('keydown', function(e){
	console.log('keydown', e.which);
	var key = getKey(e.which);
	if (key){
		key.down = true;
	}
	e.preventDefault();
});
window.addEventListener('keyup', function(e){
	console.log('keyup', e.which);
	var key = getKey(e.which);
	if (key){
		key.down = true;
	}
	e.preventDefault();
});
