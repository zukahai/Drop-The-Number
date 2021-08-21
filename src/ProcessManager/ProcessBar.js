import { Container, Graphics, Text, TextStyle } from 'pixi.js'


export default class ProcessBar extends Container {
    constructor(Level, blockSize) {
        super();
        this.targetScore = Level.getTarget() + Level.getScore();
        this.blockSize = blockSize;
        this.score = Level.getScore();

        this.background = new Graphics();
        this.background.lineStyle(this.blockSize / 20, 0xFF00FF, 0);
        this.background.beginFill(0x00FFCC);
        this.background.drawRect(0.2 * this.blockSize, 0.1 * this.blockSize, 5 * this.blockSize, 1 * this.blockSize, 10)
        this.background.endFill();
        this.addChild(this.background);

        this.roundBox = new Graphics();
        this.roundBox.lineStyle(this.blockSize / 20, 0xFF0000, 1);
        this.roundBox.beginFill(0x1C1C1C);
        this.roundBox.drawRect(0.3 * this.blockSize, 0.7 * this.blockSize, 4.8 * this.blockSize, this.blockSize / 3, 10)
        this.roundBox.endFill();
        this.addChild(this.roundBox);

        this.processBar = new Graphics();
        this.processBar.lineStyle(this.blockSize / 20, 0xFF0000, 1);
        this.processBar.beginFill(0x00FF00);
        this.processBar.drawRect(0.3 * this.blockSize, 0.7 * this.blockSize, (this.score / this.targetScore) * 4.8 * this.blockSize, this.blockSize / 3, 10)
        this.processBar.endFill();
        this.addChild(this.processBar);

        this.message = new Text("0 / " + this.targetScore, new TextStyle({
            fontFamily: "Arial",
            fontSize: this.blockSize / 4,
            fill: "#00FFFF",
            stroke: '#ff3300',
            strokeThickness: this.blockSize / 20
        }));

        this.message.x = 2 * this.blockSize;
        this.message.y = 0.7 * blockSize;
        this.addChild(this.message);
        this.update(0);
    }

    update(score) {
        this.message.x = (5.4 * this.blockSize - this.message.text.length * this.blockSize / 8) / 2;
        this.score += score;
        if (this.score > this.targetScore)
            this.score = this.targetScore;
        this.message.text = this.score + " / " + this.targetScore;
        this.processBar.beginFill(0x00FF00);
        this.processBar.drawRect(0.3 * this.blockSize, 0.7 * this.blockSize, (this.score / this.targetScore) * 4.8 * this.blockSize, this.blockSize / 3, 10);
    }
}