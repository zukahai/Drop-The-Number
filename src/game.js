import { Application, Text, TextStyle, utils } from "pixi.js";
import SpriteObject from "./SpriteManager/sprite-object.js";
import ProcessBar from "./ProcessManager/ProcessBar.js";
import TouchListener from "./ActionManager/touch.js";
import Level from "./LevelManager/level.js";
import gameScene from "./SceneManager/gameScene.js";
import gameOverScene from "./SceneManager/gameOverScene.js";
import { loadData } from "./Utils/utils.js";
import { setupController } from "./ActionManager/keyboard.js";
import { NextLevel, newBlockDown, listBlockDown, mergeBlock } from "./Utils/blockMove.js";

const TextureCache = utils.TextureCache;

let Nrow = 6;
let Ncolum = 5;
let blockSize = 80;
let XMilestones = 0;
let YMilestones = 0;

let blur = 0.8;

export class Game extends Application {
    constructor() {
        blockSize = Math.min(document.documentElement.clientWidth / (Ncolum + 1), document.documentElement.clientHeight / (Nrow + 3));
        YMilestones = 2.2 * blockSize;
        XMilestones = 0.2 * blockSize;
        super({ width: (Ncolum + 0.4) * blockSize, height: (Nrow + 2.5) * blockSize });
        this.init();
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.top = "50%";
        this.renderer.view.style.left = "50%";
        this.renderer.view.style.transform = "translate(-50%,-50%)";
        document.body.appendChild(this.view);
        this.speedBlock = this.blockSize / 200;
    }

    load() {
        this.loader.add("./images/block.json");
        this.loader.load(() => this.setup());
    }

    setup() {
        this.Level = new Level();
        this.gameScene = new gameScene(this.stage)
        this.gameOverScene = new gameOverScene(this.stage);
        this.processBar = new ProcessBar(this.Level, this.blockSize);
        this.gameScene.scene.addChild(this.processBar);

        this.Level.loadLevel(this);

        for (let j = 0; j < this.Ncolum; j++) {
            let t = new SpriteObject(
                this.gameScene.scene,
                TextureCache["head.png"],
                j * this.blockSize + this.XMilestones,
                this.YMilestones - this.blockSize
            );
            t.width = this.blockSize;
            t.height = this.blockSize;
        }

        loadData(this);
        this.touchListener = new TouchListener(this.view, true);
        this.createBlock(this.indexNewBlock, -1, 1);

        setupController(this);
        this.ticker.add((delta) => this.loop(delta));
    }

    init() {
        this.Nrow = Nrow;
        this.Ncolum = Ncolum;
        this.blockSize = blockSize;
        this.XMilestones = XMilestones;
        this.YMilestones = YMilestones;
        this.listMove = [];
        this.listDown = [];
        this.block = [];
        this.data = [];
        this.indexNewBlock = 2;
        this.typeLoop = 1;
        this.speedBlock = 0.3;
        this.speedDown = this.speedBlock;
    }

    loop(delta) {
        if (this.typeLoop == 1) {
            newBlockDown(this);
        } else if (this.typeLoop == 2) {
            listBlockDown(this);
        } else if (this.typeLoop == 3) {
            mergeBlock(this);
        } else if (this.typeLoop == 4) {
            NextLevel(this);
        }

        this.checkProcess();

        if (this.typeLoop == 1 && this.touchListener.ponit.x >= this.XMilestones && this.touchListener.ponit.x <= this.XMilestones + this.Ncolum * this.blockSize) {
            if ((this.newBlock.x + this.blockSize / 2) - (this.touchListener.ponit.x) > this.blockSize / 2)
                this.moveBlock(-1);
            else if ((this.newBlock.x + this.blockSize / 2) - (this.touchListener.ponit.x) < -this.blockSize / 2)
                this.moveBlock(1);
            this.speedDown = this.touchListener.ponit.z * this.speedBlock;
        }
    }

    checkLost() {
        for (let j = 0; j < this.Ncolum; j++)
            if (this.data[0][j] != 0)
                return true;
        return false;
    }

    createBlock(x, y, VALUE) {
        this.speedDown = this.speedBlock;
        if (this.touchListener != undefined)
            this.touchListener.ponit.z = 1;
        let k = 3;
        for (let i = 0; i < this.Nrow; i++)
            for (let j = 0; j < this.Ncolum; j++)
                if (k < Math.floor(Math.log2(this.data[i][j])))
                    k = Math.floor(Math.log2(this.data[i][j]));
        if (k > 6)
            k = Math.floor((k + 1) / 2);
        else k = 3;
        if (VALUE > 0)
            k = VALUE;
        let value = Math.pow(2, Math.floor(Math.random() * 999) % k + 1);
        loadData(this);
        if (this.newBlock != undefined)
            this.newBlock.alpha = 0;
        this.newBlock = new SpriteObject(
            this.gameScene.scene,
            TextureCache[value + ".png"],
            this.XMilestones + x * this.blockSize,
            this.YMilestones + y * this.blockSize
        );
        this.newBlock.width = this.blockSize;
        this.newBlock.height = this.blockSize;
        this.newBlock.value = value;
    }


    moveBlock(ch) {
        let I = Math.floor((this.newBlock.y - this.YMilestones + 1 * this.blockSize) / this.blockSize);
        let J = Math.floor((this.newBlock.x - this.XMilestones + 0.5 * this.blockSize) / this.blockSize);
        if (J + ch < 0 || J + ch >= this.Ncolum)
            return;
        if (I >= 0 && this.data[I][J + ch] != 0)
            return;
        this.newBlock.x += ch * this.blockSize;
    }

    checkProcess() {
        if (this.processBar.score >= this.processBar.targetScore) {
            if (this.Level.currentLevel == this.Level.getNumberOfLevel()) {
                this.gameOverScene.end(this);
                this.gameOverScene.setText("You win!");
                this.ticker.stop();
            } else {
                this.listMove = [];
                for (let i = 0; i < this.Nrow; i++)
                    for (let j = 0; j < this.Ncolum; j++)
                        this.listMove.push({ start: { x: i, y: j }, end: { x: this.XMilestones + j * this.blockSize, y: -2 * this.blockSize } });
                this.typeLoop = 4;
            }
        }
    }
}