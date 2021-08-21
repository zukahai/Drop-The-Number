import { Text, TextStyle } from "pixi.js";
import Scene from "./scene";

export default class gameOverScene {
    constructor(stage) {
        this.stage = stage;
        this.scene = new Scene(this.stage);
        this.scene.setVisible(false);
        this.init();
    }

    init() {
        this.message = new Text("", new TextStyle({
            fontFamily: "Arial",
            fontSize: 64,
            fill: "#00FFFF",
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "green",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        }));
        this.message.x = 60;
        this.message.y = this.stage.height / 2 - 32;
        this.scene.addChild(this.message);
    }
}