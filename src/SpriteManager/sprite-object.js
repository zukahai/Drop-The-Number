import { Sprite } from 'pixi.js';

export default class SpriteObject extends Sprite {

    constructor(parent, textureCache, x, y) {
        super(textureCache);
        parent.addChild(this);
        this.setPosition(x, y);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setVelocity(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }

    update(delta) {
        if (this.vx != undefined)
            this.x += this.vx * delta;
        if (this.vy != undefined)
            this.y += this.vy * delta;
    }
}