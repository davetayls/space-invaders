/*global TO_RADIANS:false */
var images = {

    drawRotatedImage: function(image, x, y, angle) {

        // save the current co-ordinate system
        // before we screw with it
        this.context.save();

        // move to the middle of where we want to draw our image
        this.context.translate(x, y);

        // rotate around that point, converting our
        // angle from degrees to radians
        this.context.rotate(angle * TO_RADIANS);

        // draw it up and to the left by half the width
        // and height of the image
        this.context.drawImage(image, -(image.width / 2), -(image.height / 2));

        // and restore the co-ords to how they were when we began
        this.context.restore();
    },

    drawPoint: function(xy) {
        this.context.fillRect(xy.x, xy.y, 1, 1);
    },

    images: {},
    getImage: function(src) {
        var self = this;
        return self.images[src] ||
        function() {
            var img = new Image();
            img.src = src;
            self.images[src] = img;
            return img;
        }();
    },
    preload: function(sources) {
        var self = this;
        sources.forEach(function(src, i) {
            self.getImage(src);
        });
    },

    drawSprite: function(img, left, top, width, height, x, y) {
        this.context.drawImage(img, left, top, width, height, x, y, width, height);
    }

};

    function Sprite(img, width, height, positions){
        this.img = img;
        this.width = width;
        this.height = height;
        this.positions = positions;
    }
    Sprite.prototype = {
        draw: function(position, x, y){
            var pos = this.positions[position];
            images.drawSprite(this.img, pos[0], pos[1], this.width, this.height, x, y);
        }
    };