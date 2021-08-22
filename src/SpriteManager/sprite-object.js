import { Sprite } from 'pixi.js';

export default class SpriteObject extends Sprite {

    constructor(parent, textureCache, x, y) {
        super(textureCache);
        this.parent = parent;
        parent.addChild(this);
        this.setPosition(x, y);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    remove() {
        this.parent.visible(false);
    }
}