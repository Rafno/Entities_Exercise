// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// Initial, inheritable, default values
//
// (You might want these to assist with early testing,
//  even though they are unnecessary in the "real" code.)
//

// Convert times from seconds to "nominal" time units.
Bullet.prototype.lifeSpan = 3 * SECS_TO_NOMINALS;
/**
 * Update handles the lifetime of the bullet, shifting it out of the array
 * once the lifetime is up.
 * Update honestly copy/pasted from Rock.js as they almost basically do
 * the same thing.
 * @param {*} du 
 */
Bullet.prototype.update = function (du) {
    this.lifeSpan -= du;
    // No need to use KILL_ME_NOW, just shift the bullet out of the array.
    if(this.lifeSpan < 0){
        entityManager._bullets.shift();
    }
    this.cx += this.velX * du;
    this.cy += this.velY * du;
    // YOU SPIN ME RIGHT'ROUND BABY RIGHT ROUND.
    this.rotation = util.randRange(0,1) * du;
    this.rotation = util.wrapRange(this.rotation,
				   0, consts.FULL_CIRCLE);
};

Bullet.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
}

Bullet.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
}

Bullet.prototype.wrapPosition = function () {
    this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
    this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};
/**
 * Gradually fades the ctx.globalAlpha value
 * Until the bullet has expired, then bring it up again.
 * @param {*} ctx 
 */
Bullet.prototype.render = function (ctx) {

    let fadeThresh = Bullet.prototype.lifeSpan / 3;
    
    if(this.lifeSpan < fadeThresh){
        ctx.globalAlpha = this.lifeSpan/fadeThresh;
    }
    g_sprites.bullet.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
        );
    ctx.globalAlpha = 1;

};
