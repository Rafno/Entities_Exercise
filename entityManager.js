/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

    // "PRIVATE" DATA

    _rocks: [],
    _bullets: [],
    _ships: [],

    _bShowRocks: false,

    // "PRIVATE" METHODS

    
    _generateRocks: function () {
        var i,
            NUM_ROCKS = 4;
        for (i = 0; i < NUM_ROCKS; i++) {
            let rockTemp = new Rock();
            this._rocks.push(rockTemp);
        }
    },

    /**
     * GLITCH: Currently doesn't correctly return the index of the ship to kill
     * Otherwise works fine
     * 
     * Iterates through every ship and checks who is closest
     * returns the closest ship and attempts to return its index.
     */
    _findNearestShip: function (posX, posY) {
        let dist = 0;
        let wrappedDist = 0;
        let final;
        //  OVERKILL
        let maxDistance = Number.MAX_SAFE_INTEGER;
        let closestShip,
            closestIndex;
        this._ships.forEach(ship => {
            wrappedDist = util.wrappedDistSq(posX, posY, ship.cx, ship.cy);
            dist = util.distSq(posX, posY, ship.cx, ship.cy);
            if (wrappedDist > dist) {
                final = dist;
            } else {
                final = wrappedDist;
            }
            if (final <= maxDistance) {
                maxDistance = final;
                closestShip = ship;
                closestIndex = closestShip.indexOf;
            }
        });
        // TODO: Implement this

        // NB: Use this technique to let you return "multiple values"
        //     from a function. It's pretty useful!
        //
        return {
            theShip: closestShip,   // the object itself
            theIndex: closestIndex   // the array index where it lives
        };
    },
    
    _forEachOf: function (aCategory, fn) {
        for (var i = 0; i < aCategory.length; ++i) {
            fn.call(aCategory[i]);
        }
    },

    // PUBLIC METHODS

    // A special return value, used by other objects,
    // to request the blessed release of death!
    // me_irl
    KILL_ME_NOW: -1,

    // Some things must be deferred until after initial construction
    // i.e. thing which need `this` to be defined.
    //
    deferredSetup: function () {
        this._categories = [this._rocks, this._bullets, this._ships];
    },

    init: function () {
        this._generateRocks();

        // I could have made some ships here too, but decided not to.
    },
    /**
     * Create a single bullet and push it into the array.
     */
    fireBullet: function (cx, cy, velX, velY, rotation) {
        let singleShot = new Bullet({
            cx: cx,
            cy: cy,
            velX: velX,
            velY: velY,
            rotation: rotation
        });
        this._bullets.push(singleShot);
    },
    /**
     * Generate a single ship and push it into the array.
     */
    generateShip: function (descr) {
        let g_ship = new Ship({
            cx: descr.cx,
            cy: descr.cy
        });
        this._ships.push(g_ship);
    },

    /**
     * Currently kills the incorrect ship, due to a findNearestShip glitch.
     * array.shift() used instead of splice or other iteration.
     */
    killNearestShip: function (xPos, yPos) {

        let nearestShip = this._findNearestShip(xPos, yPos);
        this._ships.shift();
        // NB: Don't forget the "edge cases"
    },

    /**
     * ALMOST correctly grabs nearest ship, except in edge cases.
     */
    yoinkNearestShip: function (xPos, yPos) {
        // TODO: Implement this
        let nearestShip = this._findNearestShip(xPos, yPos);
        nearestShip.theShip.setPos(xPos, yPos);
        // NB: Don't forget the "edge cases"
        // Forget edge cases
    },
    /**
     * resets ship, but also checks that if there are no more ships
     * If no ships exist, create 3.
     * 
     */
    resetShips: function () {
        this._forEachOf(this._ships, Ship.prototype.reset);
        // Simple null/undefined check, then length check for array
        if(!Array.isArray(this._ships) || !this._ships.length){
            for(let i = 140; i <= 260; i += 60){
                this.generateShip({
                    cx : i,
                    cy : 200
                });
            }
        }
    },

    haltShips: function () {
        this._forEachOf(this._ships, Ship.prototype.halt);
    },

    toggleRocks: function () {
        this._bShowRocks = !this._bShowRocks;
    },
    // Iterate through all arrays.
    update: function (du) {
        this._rocks.forEach(rock => rock.update(du));
        this._ships.forEach(ship => ship.update(du));
        this._bullets.forEach(bullet => bullet.update(du));


        // NB: Remember to handle the "KILL_ME_NOW" return value!
        //     and to properly update the array in that case.
    },
    // Iterate through all arrays.
    render: function (ctx) {
        this._ships.forEach(ship => ship.render(ctx));
        this._bullets.forEach(bullet => bullet.render(ctx));

        // Toggle created in render.js
        if (!this._bShowRocks) {
            this._rocks.forEach(rock => rock.render(ctx));
        }
    }

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
