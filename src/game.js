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
        this.loader.add("./images/treasureHunter.json");
        this.loader.load(() => this.setup());
    }

    setup() {
        this.gameScene = new Scene(this.stage);

        this.gameOverScene = new Scene(this.stage);
        this.gameOverScene.setVisible(false);

        this.dungeon = new SpriteObject(
            this.gameScene,
            TextureCache["dungeon.png"],
            0,
            0
        );

        margin = this.stage.width / 20;

        this.door = new SpriteObject(
            this.gameScene,
            TextureCache["door.png"],
            this.stage.width / 17,
            0
        );

        this.treasure = new SpriteObject(
            this.gameScene,
            TextureCache["treasure.png"],
            this.stage.width - 3 * margin,
            this.stage.height - 3 * margin
        );

        this.explorer = new SpriteObject(
            this.gameScene,
            TextureCache["explorer.png"],
            this.stage.height / 10,
            this.stage.height / 10
        );

        this.blob = [];
        for (let i = 0; i < Nblob; i++) {
            this.blob[i] = new SpriteObject(
                this.gameScene,
                TextureCache["blob.png"],
                this.stage.width / 5 + i * this.stage.width / 9,
                this.stage.height / 2 + (Math.random() - Math.random()) * this.stage.height / 3
            );
            this.blob[i].direction = (Math.random() < 0.5) ? 1 : -1;
        }

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
        // console.log(this.explorer.x, ' ', this.explorer.y);
        if (this.explorer.vx * this.explorer.vy == 0)
            this.explorer.update(1);
        else
            this.explorer.update(1 / Math.sqrt(2));
        this.UpdateExplorer(this.explorer);
        for (let i = 0; i < Nblob; i++) {
            this.moveBlob(this.blob[i]);
            this.UpdateExplorer(this.blob[i]);
        }

        if (this.checkCollision()) {
            this.end();
            this.message.text = "You lost!";
            this.ticker.stop();
        }

        if (this.distance(this.door.x - this.treasure.x, this.door.y - this.treasure.y) < margin) {
            this.end();
            this.message.text = "You won!";
            this.ticker.stop();
        }

        if (this.distance(this.explorer.x - this.treasure.x, this.explorer.y - this.treasure.y) < margin / 2)
            checktreasure = true;
        if (checktreasure)
            this.treasure.setPosition(this.explorer.x + this.explorer.width / 2, this.explorer.y + this.explorer.height - this.treasure.height);
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