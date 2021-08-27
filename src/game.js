import { Application, Text, TextStyle, utils } from "pixi.js";
import SpriteObject from "./SpriteManager/sprite-object.js";
import Keyboard from "./ActionManager/keyboard.js";
import ProcessBar from "./ProcessManager/ProcessBar.js";
import TouchListener from "./ActionManager/touch.js";
import Level from "./LevelManager/level.js";
import gameScene from "./SceneManager/gameScene.js";
import gameOverScene from "./SceneManager/gameOverScene.js";
import { loadData, listMoveBlock } from "./Utils/utils.js";

const TextureCache = utils.TextureCache;

let Nrow = 6;
let Ncolum = 5;
let blockSize = 80;
let XMilestones = 0;
let YMilestones = 0;
let speedBlock = 0.3;
let speedDown = speedBlock;

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
        speedBlock = this.blockSize / 200;
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

        this.loadLevel(this.Level.currentLevel);

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

        this.setupController();
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
    }

    loadLevel() {

        this.processBar = new ProcessBar(this.Level, this.blockSize);
        this.data = this.Level.getData();

        this.gameScene.scene.addChild(this.processBar);

        this.indexNewBlock = 2;
        this.createBlock(this.indexNewBlock, -1, 1);

        this.listDown = this.listDown = [];
    }

    loop(delta) {
        if (this.typeLoop == 1) {
            this.newBlockDown();
        } else if (this.typeLoop == 2) {
            this.listBlockDown();
        } else if (this.typeLoop == 3) {
            this.mergeBlock();
        } else if (this.typeLoop == 4) {
            this.NextLevel();
        }

        this.checkProcess();

        if (this.typeLoop == 1 && this.touchListener.ponit.x >= this.XMilestones && this.touchListener.ponit.x <= this.XMilestones + this.Ncolum * this.blockSize) {
            if ((this.newBlock.x + this.blockSize / 2) - (this.touchListener.ponit.x) > this.blockSize / 2)
                this.moveBlock(-1);
            else if ((this.newBlock.x + this.blockSize / 2) - (this.touchListener.ponit.x) < -this.blockSize / 2)
                this.moveBlock(1);
            speedDown = this.touchListener.ponit.z * speedBlock;
        }
    }

    NextLevel() {
        let checkEndLoop4 = false;

        if (this.listMove == undefined)
            this.listMove = [];
        if (this.listMove.length == 0)
            checkEndLoop4 = true;

        for (let i = 0; i < this.listMove.length; i++) {
            let x = this.listMove[i].end.x;
            let y = this.listMove[i].end.y;
            if (Math.abs(this.block[this.listMove[i].start.x][this.listMove[i].start.y].x - this.listMove[i].end.x) > this.blockSize / 5 || Math.abs(this.block[this.listMove[i].start.x][this.listMove[i].start.y].y - this.listMove[i].end.y) > this.blockSize / 5) {
                for (let k = 0; k < 5; k++) {
                    x = (this.block[this.listMove[i].start.x][this.listMove[i].start.y].x + x) / 2;
                    y = (this.block[this.listMove[i].start.x][this.listMove[i].start.y].y + y) / 2;
                }
                this.block[this.listMove[i].start.x][this.listMove[i].start.y].x = x;
                this.block[this.listMove[i].start.x][this.listMove[i].start.y].y = y;
            } else {
                checkEndLoop4 = true;
                break;
            }
        }

        if (checkEndLoop4) {
            this.loadLevel(this.Level.nextLevel());
            this.processBar.background.level_Text.setText("Level " + this.Level.currentLevel);
            this.typeLoop = 1;
        }
    }

    newBlockDown() {
        this.newBlock.y += speedDown;
        if (this.checkLost()) {
            this.gameOverScene.end();
            this.gameOverScene.setText("You lost!");
            this.ticker.stop();
        }
        if (this.newBlock.y >= this.YMilestones && this.data[Math.floor((this.newBlock.y - this.YMilestones + this.blockSize) / this.blockSize)][Math.floor((this.newBlock.x - this.XMilestones + 0.5 * this.blockSize) / this.blockSize)] != 0) {
            this.data[Math.floor((this.newBlock.y - this.YMilestones + 0.5 * this.blockSize) / this.blockSize)][Math.floor((this.newBlock.x - this.XMilestones + 0.5 * this.blockSize) / this.blockSize)] = this.newBlock.value;
            this.indexNewBlock = Math.floor((this.newBlock.x - this.XMilestones + 0.5 * this.blockSize) / this.blockSize);
            this.newBlock.alpha = 0;
            this.typeLoop = 2;
            this.listMove = listMoveBlock(this, Math.floor((this.newBlock.y - this.YMilestones + 0.5 * this.blockSize) / this.blockSize), Math.floor((this.newBlock.x - this.XMilestones + 0.5 * this.blockSize) / this.blockSize));
        }
    }

    listBlockDown() {
        let checkEndLoop2 = false;
        if (this.listMove == undefined)
            this.listMove = [];
        if (this.listMove.length == 0)
            checkEndLoop2 = true;

        for (let i = 0; i < this.listMove.length; i++) {
            if (Math.abs(this.block[this.listMove[i].start.x][this.listMove[i].start.y].x - this.listMove[i].end.x) > 0.01 || Math.abs(this.block[this.listMove[i].start.x][this.listMove[i].start.y].y - this.listMove[i].end.y) > 0.01) {
                this.block[this.listMove[i].start.x][this.listMove[i].start.y].x = (this.block[this.listMove[i].start.x][this.listMove[i].start.y].x + this.listMove[i].end.x) / 2;
                this.block[this.listMove[i].start.x][this.listMove[i].start.y].y = (this.block[this.listMove[i].start.x][this.listMove[i].start.y].y + this.listMove[i].end.y) / 2;
            } else {
                checkEndLoop2 = true;
                break;
            }
        }

        if (checkEndLoop2) {
            loadData(this);
            for (let j = 0; j < this.Ncolum; j++) {
                let i = this.Nrow - 1;
                for (i = this.Nrow - 1; i >= 1; i--)
                    if (this.data[i][j] == 0) {
                        let check = false;
                        for (let k = i - 1; k >= 0; k--)
                            if (this.data[k][j] != 0) {
                                check = true;
                                break;
                            }
                        let count = 0;
                        if (check) {
                            for (let k = i - 1; k >= 0; k--)
                                if (this.data[k][j] != 0) {
                                    this.listDown.push({ x: i - count, y: j });
                                    this.listMove.push({ start: { x: k, y: j }, end: { x: this.block[i - count][j].x, y: this.block[i - count][j].y } });
                                    this.data[i - count][j] = this.data[k][j];
                                    this.data[k][j] = 0;
                                    if (k == 0)
                                        this.data[0][j] = 0;
                                    count++;
                                }
                            break;
                        }
                    }
            }

            this.typeLoop = 3;
        }
    }

    mergeBlock() {
        let checkEndLoop3 = false;
        if (this.listMove.length == 0)
            checkEndLoop3 = true;

        for (let i = 0; i < this.listMove.length; i++) {
            if (Math.abs(this.block[this.listMove[i].start.x][this.listMove[i].start.y].x - this.listMove[i].end.x) > 0.01 || Math.abs(this.block[this.listMove[i].start.x][this.listMove[i].start.y].y - this.listMove[i].end.y) > 0.01) {
                this.block[this.listMove[i].start.x][this.listMove[i].start.y].x = (this.block[this.listMove[i].start.x][this.listMove[i].start.y].x + this.listMove[i].end.x) / 2;
                this.block[this.listMove[i].start.x][this.listMove[i].start.y].y = (this.block[this.listMove[i].start.x][this.listMove[i].start.y].y + this.listMove[i].end.y) / 2;
            } else {
                checkEndLoop3 = true;
                break;
            }
        }

        if (checkEndLoop3) {
            loadData(this);
            this.listMove = [];
            let listDown2 = this.listDown;
            this.listDown = [];
            for (let i = 0; i < listDown2.length; i++)
                this.listMove = this.listMove.concat(listMoveBlock(this, listDown2[i].x, listDown2[i].y));
            if (this.listMove.length == 0) {
                this.createBlock(this.indexNewBlock, -1, -1);
                this.typeLoop = 1;
            } else this.typeLoop = 2;
        }
    }

    checkLost() {
        for (let j = 0; j < this.Ncolum; j++)
            if (this.data[0][j] != 0)
                return true;
        return false;
    }

    createBlock(x, y, VALUE) {
        speedDown = speedBlock;
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
                this.gameOverScene.end();
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

    setupController() {
        let left = new Keyboard("ArrowLeft"),
            up = new Keyboard("ArrowUp"),
            right = new Keyboard("ArrowRight"),
            down = new Keyboard("ArrowDown");

        left.setPress(() => {
            this.moveBlock(-1);
        });

        up.setPress(() => {

        });

        right.setPress(() => {
            this.moveBlock(1);
        });

        down.setPress(() => {
            speedDown = 30 * speedBlock;
        });

        left.setRelease(() => {

        });

        up.setRelease(() => {

        });

        right.setRelease(() => {

        });

        down.setRelease(() => {
            speedDown = speedBlock;
        });

    }
}