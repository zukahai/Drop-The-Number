import { Container, Graphics } from 'pixi.js';
import TextLevel from "./TextLevel.js";


export default class backgroundProcess extends Container {
    constructor(blockSize) {
        super();
        this.blockSize = blockSize;
        this.background = new Graphics();
        this.background.lineStyle(this.blockSize / 20, 0xFF00FF, 0);
        this.background.beginFill(0x00FFCC);
        this.background.drawRect(0.2 * this.blockSize, 0.1 * this.blockSize, 5 * this.blockSize, 1 * this.blockSize, 10)
        this.background.endFill();
        this.addChild(this.background);

        this.level_Text = new TextLevel(this.blockSize);
        this.addChild(this.level_Text);
    }
}