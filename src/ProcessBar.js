import { Container, Graphics } from 'pixi.js'


export default class ProcessBar extends Container {
    constructor(targetScore, blockSize) {
        super();
        this.targetScore = targetScore;
        this.blockSize = blockSize;
        this.score = 0;

        this.roundBox = new Graphics();
        this.roundBox.lineStyle(5, 0xFF00FF, 1);
        this.roundBox.beginFill(0xC0C0C0);
        this.roundBox.drawRoundedRect(0.2 * this.blockSize, 0.2 * this.blockSize, 5 * this.blockSize, this.blockSize / 3, 10)
        this.roundBox.endFill();
        this.addChild(this.roundBox);

        this.processBar = new Graphics();
        this.processBar.lineStyle(5, 0xFF00FF, 1);
        this.processBar.beginFill(0x00FFCC);
        this.processBar.drawRoundedRect(0.2 * this.blockSize, 0.2 * this.blockSize, (this.score / this.targetScore) * 5 * this.blockSize, this.blockSize / 3, 10)
        this.processBar.endFill();
        this.addChild(this.processBar);
    }

    update(score) {
        this.score += score;
        this.processBar.beginFill(0x00FFCC);
        this.processBar.drawRoundedRect(0.2 * this.blockSize, 0.2 * this.blockSize, (this.score / this.targetScore) * 5 * this.blockSize, this.blockSize / 3, 10);
    }
}