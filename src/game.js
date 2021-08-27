import { Application, Text, TextStyle, utils } from "pixi.js";
import SpriteObject from "./SpriteManager/sprite-object.js";
import ProcessBar from "./ProcessManager/ProcessBar.js";
import TouchListener from "./ActionManager/touch.js";
import Level from "./LevelManager/level.js";
import gameScene from "./SceneManager/gameScene.js";
import gameOverScene from "./SceneManager/gameOverScene.js";
import { loadData } from "./Utils/utils.js";
import { setupController } from "./ActionManager/keyboard.js";
import { NextLevel, newBlockDown, listBlockDown, mergeBlock, createBlock } from "./Utils/blockMove.js";
import { TouchListenerEvent } from "./ActionManager/touch.js";

const TextureCache = utils.TextureCache;

let Nrow = 6;
let Ncolum = 5;
let blockSize = 80;
let XMilestones = 0;
let YMilestones = 0;

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
        createBlock(this, -1, 1);

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
        this.blur = 0.75;
    }

    loop(delta) {
        switch (this.typeLoop) {
            case 1:
                newBlockDown(this);
                break;
            case 2:
                listBlockDown(this);
                break;
            case 3:
                mergeBlock(this);
                break;
            case 4:
                NextLevel(this);
                break;
        }

        this.processBar.checkProcess(this);
        TouchListenerEvent(this);
    }
}