import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import backgroundProcess from './backgroundProcess';


export default class ProcessBar extends Container {
    constructor(Level, blockSize) {
        super();
        this.targetScore = Level.getTarget() + Level.getScore();
        this.blockSize = blockSize;
        this.score = Level.getScore();

        this.background = new backgroundProcess(this.blockSize);
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

    checkProcess(game) {
        if (game.processBar.score >= game.processBar.targetScore) {
            if (game.Level.currentLevel == game.Level.getNumberOfLevel()) {
                game.gameOverScene.end(game);
                game.gameOverScene.setText("You win!");
                game.ticker.stop();
            } else {
                game.listMove = [];
                for (let i = 0; i < game.Nrow; i++)
                    for (let j = 0; j < game.Ncolum; j++)
                        game.listMove.push({ start: { x: i, y: j }, end: { x: game.XMilestones + j * game.blockSize, y: -2 * game.blockSize } });
                game.typeLoop = 4;
            }
        }
    }
}