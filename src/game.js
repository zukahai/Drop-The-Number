import { Application, Text, TextStyle, utils } from "pixi.js";
import Scene from "./scene.js";
import SpriteObject from "./sprite-object.js";
import Keyboard from "./keyboard.js";

let SpeedExplorer = 5;
let margin = 0;
let Nblob = 6;
let checktreasure = false;

const TextureCache = utils.TextureCache;

export class Game extends Application {
    constructor() {
        super({ width: 502, height: 502 });
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.top = "50%";
        this.renderer.view.style.left = "50%";
        this.renderer.view.style.transform = "translate(-50%,-50%)";
        document.body.appendChild(this.view);
    }

    load() {
        this.loader.add("./images/block.json");
        this.loader.load(() => this.setup());
    }

    setup() {
        this.gameScene = new Scene(this.stage);

        this.gameOverScene = new Scene(this.stage);
        this.gameOverScene.setVisible(false);

        this.explorer = new SpriteObject(
            this.gameScene,
            TextureCache["explorer.png"],
            this.stage.height / 10,
            this.stage.height / 10
        );


        this.message = new Text("", new TextStyle({
            fontFamily: "Futura",
            fontSize: 64,
            fill: "white",
        }));
        this.message.x = 120;
        this.message.y = this.stage.height / 2 - 32;
        this.gameOverScene.addChild(this.message);

        this.setupController();
        this.ticker.add((delta) => this.loop(delta));
    }

    loop(delta) {
        this.explorer.x++;
    }

    end() {
        this.gameScene.setVisible(false);
        this.gameOverScene.setVisible(true);
    }

    moveBlob(blob) {
        blob.vy = blob.direction * SpeedExplorer / 2;
        blob.update(1);
        if (blob.y < margin || blob.y > this.stage.height - margin - blob.height)
            blob.direction *= -1;
    }

    UpdateExplorer(sprite) {
        if (sprite.x < margin)
            sprite.x = margin;
        if (sprite.y < margin / 2)
            sprite.y = margin / 2;
        if (sprite.x > this.stage.width - margin - sprite.width)
            sprite.x = this.stage.width - margin - sprite.width;
        if (sprite.y > this.stage.height - margin - sprite.height)
            sprite.y = this.stage.height - margin - sprite.height;
    }

    checkCollision() {
        for (let i = 0; i < Nblob; i++)
            if (this.distance(this.explorer.x + this.explorer.width / 2 - this.blob[i].x - this.blob[i].width / 2, this.explorer.y + this.explorer.height / 2 - this.blob[i].y - this.blob[i].height / 2) < margin)
                return true;
        return false;
    }

    distance(x, y) {
        return Math.sqrt(x * x + y * y);
    }

    setupController() {
        let left = new Keyboard("ArrowLeft"),
            up = new Keyboard("ArrowUp"),
            right = new Keyboard("ArrowRight"),
            down = new Keyboard("ArrowDown");

        left.setPress(() => {
            if (this.explorer.x > 0)
                this.explorer.vx = -SpeedExplorer;
            else
                this.explorer.vx = 0;
        });

        up.setPress(() => {
            if (this.explorer.y > 0)
                this.explorer.vy = -SpeedExplorer;
            else
                this.explorer.vy = 0;
        });

        right.setPress(() => {
            if (this.explorer.x < this.stage.width - this.explorer.width / 2 - margin)
                this.explorer.vx = SpeedExplorer;
            else
                this.explorer.vx = 0;
        });

        down.setPress(() => {
            if (this.explorer.y < this.stage.width - this.explorer.height / 2 - margin)
                this.explorer.vy = SpeedExplorer;
            else
                this.explorer.vy = 0;
        });

        left.setRelease(() => {
            this.explorer.vx = 0;
        });

        up.setRelease(() => {
            this.explorer.vy = 0;
        });

        right.setRelease(() => {
            this.explorer.vx = 0;
        });

        down.setRelease(() => {
            this.explorer.vy = 0;
        });
    }
}