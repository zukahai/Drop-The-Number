import { Container, Graphics, Text, TextStyle } from 'pixi.js'


export default class ProcessBar extends Container {
    constructor(targetScore, blockSize) {
        super();
        this.targetScore = targetScore;
        this.blockSize = blockSize;
        this.score = 0;

        this.roundBox = new Graphics();
        this.roundBox.lineStyle(3, 0xFF00FF, 1);
        this.roundBox.beginFill(0x1C1C1C);
        this.roundBox.drawRect(0.2 * this.blockSize, 0.7 * this.blockSize, 5 * this.blockSize, this.blockSize / 3, 10)
        this.roundBox.endFill();
        this.addChild(this.roundBox);

        this.processBar = new Graphics();
        this.processBar.lineStyle(3, 0xFF00FF, 1);
        this.processBar.beginFill(0x00FFCC);
        this.processBar.drawRect(0.2 * this.blockSize, 0.7 * this.blockSize, (this.score / this.targetScore) * 5 * this.blockSize, this.blockSize / 3, 10)
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
    }

    update(score) {
        this.score += score;
        if (this.score > this.targetScore)
            this.score = this.targetScore;
        this.message.text = this.score + " /" + this.targetScore;
        this.processBar.beginFill(0x00FFCC);
        this.processBar.drawRect(0.2 * this.blockSize, 0.7 * this.blockSize, (this.score / this.targetScore) * 5 * this.blockSize, this.blockSize / 3, 10);
    }
}