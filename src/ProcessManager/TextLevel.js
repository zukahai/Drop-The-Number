import { Container, Graphics, Text, TextStyle } from 'pixi.js'


export default class TextLevel extends Container {
    constructor(blockSize) {
        super();
        this.blockSize = blockSize;
        this.background = new Graphics();
        this.background.lineStyle(this.blockSize / 20, 0xFF00FF, 0);
        this.background.beginFill(0x00FFCC);
        this.background.drawRect(0.2 * this.blockSize, 0.1 * this.blockSize, 5 * this.blockSize, 1 * this.blockSize, 10)
        this.background.endFill();
        this.addChild(this.background);

        this.level_text = new Text("Level 1", new TextStyle({
            fontFamily: "Arial",
            fontSize: blockSize * 0.4,
            fill: "#FFFF00",
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        }));

        this.level_text.x = 2 * blockSize;
        this.level_text.y = 0.1 * blockSize;
        this.addChild(this.level_text);
    }

    setText(Text) {
        this.level_text.text = Text;
    }
}