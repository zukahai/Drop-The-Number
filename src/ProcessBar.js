import { Container, Graphics, Text, TextStyle } from 'pixi.js'


export default class ProcessBar extends Container {
    constructor(targetScore, blockSize) {
        super();
        this.targetScore = targetScore;
        this.blockSize = blockSize;
        this.score = 0;

        this.background = new Graphics();
        this.background.lineStyle(3, 0xFF00FF, 0);
        this.background.beginFill(0x00FFCC);
        this.background.drawRect(0.2 * this.blockSize, 0.1 * this.blockSize, 5 * this.blockSize, 1 * this.blockSize, 10)
        this.background.endFill();
        this.addChild(this.background);

        this.roundBox = new Graphics();
        this.roundBox.lineStyle(3, 0xFF0000, 1);
        this.roundBox.beginFill(0x1C1C1C);
        this.roundBox.drawRect(0.3 * this.blockSize, 0.7 * this.blockSize, 4.8 * this.blockSize, this.blockSize / 3, 10)
        this.roundBox.endFill();
        this.addChild(this.roundBox);

        this.processBar = new Graphics();
        this.processBar.lineStyle(3, 0xFF0000, 1);
        this.processBar.beginFill(0x00FF00);
        this.processBar.drawRect(0.3 * this.blockSize, 0.7 * this.blockSize, (this.score / this.targetScore) * 4.8 * this.blockSize, this.blockSize / 3, 10)
        this.processBar.endFill();
        this.addChild(this.processBar);

        this.message = new Text("0 / " + this.targetScore, new TextStyle({
            fontFamily: "Arial",
            fontSize: this.blockSize / 4,
            fill: "#00FFFF",
            stroke: '#ff3300',
            strokeThickness: 4
        }));

        this.message.x = 2 * this.blockSize;
        this.message.y = 0.7 * blockSize;
        this.addChild(this.message);
        this.update(0);
    }

    update(score) {
        this.message.x = (5.4 * this.blockSize - this.message.fontSize / 2) / 2;
        this.score += score;
        if (this.score > this.targetScore)
            this.score = this.targetScore;
        this.message.text = this.score + " / " + this.targetScore;
        this.processBar.beginFill(0x00FF00);
        this.processBar.drawRect(0.3 * this.blockSize, 0.7 * this.blockSize, (this.score / this.targetScore) * 4.8 * this.blockSize, this.blockSize / 3, 10);
    }
}