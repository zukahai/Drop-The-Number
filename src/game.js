import { Application, Text, TextStyle, utils, Graphics } from "pixi.js";
import Scene from "./scene.js";
import SpriteObject from "./sprite-object.js";
import Keyboard from "./keyboard.js";
import ProcessBar from "./ProcessBar.js";

const TextureCache = utils.TextureCache;

let block = [];
let Nrow = 6;
let Ncolum = 5;
let blockSize = 80;
let XMilestones = 0;
let YMilestones = 0;

let data = [
    [2, 0, 0, 0, 0],
    [4, 0, 0, 0, 0],
    [8, 0, 0, 0, 0],
    [16, 0, 0, 0, 0],
    [512, 0, 0, 0, 512],
    [2048, 8, 4, 2, 1024]
]

export class Game extends Application {
    constructor() {
        blockSize = Math.min(document.documentElement.clientWidth / (Ncolum + 1), document.documentElement.clientHeight / (Nrow + 3));
        YMilestones = 1.7 * blockSize;
        XMilestones = 0.2 * blockSize;
        super({ width: (Ncolum + 0.4) * blockSize, height: (Nrow + 2) * blockSize });
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

        this.processBar = new ProcessBar(1000, blockSize);
        this.gameScene.addChild(this.processBar);

        let head = [];
        for (let j = 0; j < Ncolum; j++) {
            head[j] = new SpriteObject(
                this.gameScene,
                TextureCache["head.png"],
                j * blockSize + XMilestones,
                YMilestones - blockSize
            );
            head[j].width = blockSize;
            head[j].height = blockSize;
        }

        for (let i = 0; i < Nrow; i++) {
            let temp = [];
            for (let j = 0; j < Ncolum; j++) {
                temp[j] = new SpriteObject(
                    this.gameScene,
                    TextureCache[data[i][j] + ".png"],
                    j * blockSize + XMilestones,
                    i * blockSize + YMilestones
                );
                temp[j].width = blockSize;
                temp[j].height = blockSize;
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
        if (this.processBar.score <= this.processBar.targetScore)
            this.processBar.update(3);
        else
            console.log("Win");
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