import { Application, Text, TextStyle, utils } from "pixi.js";
import Scene from "./scene.js";
import SpriteObject from "./sprite-object.js";
import Keyboard from "./keyboard.js";

const TextureCache = utils.TextureCache;

let block = [];
let Nrow = 6;
let Ncolum = 5;

export class Game extends Application {
    constructor() {
        super({ width: 500, height: 600 });
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

        for (let i = 0; i < Nrow; i++) {
            let temp = [];
            for (let j = 0; j < Ncolum; j++) {
                temp[j] = new SpriteObject(
                    this.gameScene,
                    TextureCache[Math.floor(Math.pow(2, Math.floor(Math.random() * 99999) % 16 + 1)) + ".png"],
                    j * 100,
                    i * 100
                );
            }
            block[i] = temp;
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

    }

    end() {
        this.gameScene.setVisible(false);
        this.gameOverScene.setVisible(true);
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

        });

        up.setPress(() => {

        });

        right.setPress(() => {

        });

        down.setPress(() => {

        });

        left.setRelease(() => {

        });

        up.setRelease(() => {

        });

        right.setRelease(() => {

        });

        down.setRelease(() => {

        });
    }
}