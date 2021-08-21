import { Application, Text, TextStyle, utils } from "pixi.js";
import Scene from "./scene.js";
import SpriteObject from "./sprite-object.js";
import Keyboard from "./ActionManager/keyboard.js";
import ProcessBar from "./ProcessBar.js";
import TouchListener from "./ActionManager/touch.js";
import Level from "./LevelManager/level.js";

const TextureCache = utils.TextureCache;

let block = [];
let Nrow = 6;
let Ncolum = 5;
let blockSize = 80;
let XMilestones = 0;
let YMilestones = 0;
let speedBlock = 0.3;
let speedDown = speedBlock;
let indexNewBlock = 2;
let typeLoop = 1;
let listMove = [];
let listDown = [];
let blur = 0.8;

let data = []

export class Game extends Application {
    constructor() {
        blockSize = Math.min(document.documentElement.clientWidth / (Ncolum + 1), document.documentElement.clientHeight / (Nrow + 3));
        YMilestones = 2.2 * blockSize;
        XMilestones = 0.2 * blockSize;
        super({ width: (Ncolum + 0.4) * blockSize, height: (Nrow + 2.5) * blockSize });
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.top = "50%";
        this.renderer.view.style.left = "50%";
        this.renderer.view.style.transform = "translate(-50%,-50%)";
        document.body.appendChild(this.view);
        speedBlock = blockSize / 200;
    }

    load() {
        this.loader.add("./images/block.json");
        this.loader.load(() => this.setup());
    }

    setup() {
        this.Level = new Level();
        this.gameScene = new Scene(this.stage);

        this.gameOverScene = new Scene(this.stage);
        this.gameOverScene.setVisible(false);

        this.processBar = new ProcessBar();
        this.gameScene.addChild(this.processBar);


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
        this.gameScene.addChild(this.level_text);

        this.loadLevel(this.Level.currentLevel);

        for (let j = 0; j < Ncolum; j++) {
            let t = new SpriteObject(
                this.gameScene,
                TextureCache["head.png"],
                j * blockSize + XMilestones,
                YMilestones - blockSize
            );
            t.width = blockSize;
            t.height = blockSize;
        }

        this.loadData();
        this.touchListener = new TouchListener(this.view, true);
        this.createBlock(indexNewBlock, -1, 1);

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
        this.gameOverScene.addChild(this.message);

        this.setupController();
        this.ticker.add((delta) => this.loop(delta));
    }

    loadLevel(lv) {

        this.processBar = new ProcessBar(this.Level.getScore(lv), this.Level.getTarget(lv) + this.Level.getScore(lv), blockSize);
        data = this.Level.getData(lv)

        this.gameScene.addChild(this.processBar);
        this.gameScene.addChild(this.level_text);

        indexNewBlock = 2;
        this.createBlock(indexNewBlock, -1, 1);
    }

    loop(delta) {
        if (typeLoop == 1) {
            this.loopType1();
        } else if (typeLoop == 2) {
            this.loopType2();
        } else if (typeLoop == 3) {
            this.loopType3();
        } else if (typeLoop == 4) {
            this.loopType4();
        }

        if (this.processBar.score >= this.processBar.targetScore) {
            console.log("Next level");
            if (this.Level.currentLevel == this.Level.getNumberOfLevel()) {
                this.end();
                this.message.text = "You win!";
                this.ticker.stop();
            } else {
                listMove = [];
                for (let i = 0; i < Nrow; i++)
                    for (let j = 0; j < Ncolum; j++)
                        listMove.push({ start: { x: i, y: j }, end: { x: XMilestones + j * blockSize, y: -2 * blockSize } });
                typeLoop = 4;
            }
        }

        if (typeLoop == 1 && this.touchListener.ponit.x >= XMilestones && this.touchListener.ponit.x <= XMilestones + Ncolum * blockSize) {
            if ((this.newBlock.x + blockSize / 2) - (this.touchListener.ponit.x) > blockSize / 2)
                this.moveBlock(-1);
            else if ((this.newBlock.x + blockSize / 2) - (this.touchListener.ponit.x) < -blockSize / 2)
                this.moveBlock(1);
            speedDown = this.touchListener.ponit.z * speedBlock;
        }
    }

    loopType4() {
        let checkEndLoop4 = false;

        if (listMove.length == 0)
            checkEndLoop4 = true;

        for (let i = 0; i < listMove.length; i++) {
            let x = listMove[i].end.x;
            let y = listMove[i].end.y;
            if (Math.abs(block[listMove[i].start.x][listMove[i].start.y].x - listMove[i].end.x) > blockSize / 5 || Math.abs(block[listMove[i].start.x][listMove[i].start.y].y - listMove[i].end.y) > blockSize / 5) {
                for (let k = 0; k < 5; k++) {
                    x = (block[listMove[i].start.x][listMove[i].start.y].x + x) / 2;
                    y = (block[listMove[i].start.x][listMove[i].start.y].y + y) / 2;
                }
                block[listMove[i].start.x][listMove[i].start.y].x = x;
                block[listMove[i].start.x][listMove[i].start.y].y = y;
            } else {
                checkEndLoop4 = true;
                break;
            }
        }

        if (checkEndLoop4) {
            this.loadLevel(this.Level.nextLevel());
            this.level_text.text = "Level " + this.Level.currentLevel;
            typeLoop = 1;
        }
    }

    loopType1() {
        this.newBlock.y += speedDown;
        if (this.checkLost()) {
            this.end();
            this.message.text = "You lost!";
            this.ticker.stop();
        }
        if (this.newBlock.y >= YMilestones && data[Math.floor((this.newBlock.y - YMilestones + blockSize) / blockSize)][Math.floor((this.newBlock.x - XMilestones + 0.5 * blockSize) / blockSize)] != 0) {
            data[Math.floor((this.newBlock.y - YMilestones + 0.5 * blockSize) / blockSize)][Math.floor((this.newBlock.x - XMilestones + 0.5 * blockSize) / blockSize)] = this.newBlock.value;
            indexNewBlock = Math.floor((this.newBlock.x - XMilestones + 0.5 * blockSize) / blockSize);
            this.newBlock.alpha = 0;
            typeLoop = 2;
            listMove = this.listMoveBlock(Math.floor((this.newBlock.y - YMilestones + 0.5 * blockSize) / blockSize), Math.floor((this.newBlock.x - XMilestones + 0.5 * blockSize) / blockSize));
        }
    }

    loopType2() {
        let checkEndLoop2 = false;
        if (listMove.length == 0)
            checkEndLoop2 = true;

        for (let i = 0; i < listMove.length; i++) {
            if (Math.abs(block[listMove[i].start.x][listMove[i].start.y].x - listMove[i].end.x) > 0.01 || Math.abs(block[listMove[i].start.x][listMove[i].start.y].y - listMove[i].end.y) > 0.01) {
                block[listMove[i].start.x][listMove[i].start.y].x = (block[listMove[i].start.x][listMove[i].start.y].x + listMove[i].end.x) / 2;
                block[listMove[i].start.x][listMove[i].start.y].y = (block[listMove[i].start.x][listMove[i].start.y].y + listMove[i].end.y) / 2;
            } else {
                checkEndLoop2 = true;
                break;
            }
        }

        if (checkEndLoop2) {
            this.loadData();
            for (let j = 0; j < Ncolum; j++) {
                let i = Nrow - 1;
                for (i = Nrow - 1; i >= 1; i--)
                    if (data[i][j] == 0 && data[i - 1][j] != 0) {
                        listDown.push({ x: i, y: j });
                        break;
                    }

                for (let k = i; k >= 1; k--) {
                    data[k][j] = data[k - 1][j];
                    listMove.push({ start: { x: k - 1, y: j }, end: { x: block[k][j].x, y: block[k][j].y } });
                    if (k == 1)
                        data[0][j] = 0;
                }
            }

            typeLoop = 3;
        }
    }

    loopType3() {
        let checkEndLoop3 = false;
        if (listMove.length == 0)
            checkEndLoop3 = true;

        for (let i = 0; i < listMove.length; i++) {
            if (Math.abs(block[listMove[i].start.x][listMove[i].start.y].x - listMove[i].end.x) > 0.01 || Math.abs(block[listMove[i].start.x][listMove[i].start.y].y - listMove[i].end.y) > 0.01) {
                block[listMove[i].start.x][listMove[i].start.y].x = (block[listMove[i].start.x][listMove[i].start.y].x + listMove[i].end.x) / 2;
                block[listMove[i].start.x][listMove[i].start.y].y = (block[listMove[i].start.x][listMove[i].start.y].y + listMove[i].end.y) / 2;
            } else {
                checkEndLoop3 = true;
                break;
            }
        }

        if (checkEndLoop3) {
            this.loadData();
            listMove = [];
            let listDown2 = listDown;
            listDown = [];
            for (let i = 0; i < listDown2.length; i++)
                listMove = listMove.concat(this.listMoveBlock(listDown2[i].x, listDown2[i].y));
            if (listMove.length == 0) {
                this.createBlock(indexNewBlock, -1, -1);
                typeLoop = 1;
            } else typeLoop = 2;
        }
    }

    listMoveBlock(x, y) {
        let listMove2 = [];
        let I = x;
        let J = y;

        let temp = data[I][J];
        if (I >= 0 && I < Nrow - 1 && data[I][J] == data[I + 1][J]) {
            listMove2.push({ start: { x: I + 1, y: J }, end: { x: block[I][J].x, y: block[I][J].y } });
            temp *= 2;
            data[I + 1][J] = 0;
            block[I + 1][J].alpha = blur;
        }

        if (I >= 1 && I < Nrow - 1 && data[I][J] == data[I - 1][J]) {
            listMove2.push({ start: { x: I - 1, y: J }, end: { x: block[I][J].x, y: block[I][J].y } });
            temp *= 2;
            data[I - 1][J] = 0;
            block[I - 1][J].alpha = blur;
        }

        if (I >= 0 && J >= 1 && data[I][J] == data[I][J - 1]) {
            listMove2.push({ start: { x: I, y: J - 1 }, end: { x: block[I][J].x, y: block[I][J].y } });
            temp *= 2;
            data[I][J - 1] = 0;
            block[I][J - 1].alpha = blur;
        }

        if (I >= 0 && J < Ncolum && data[I][J] == data[I][J + 1]) {
            listMove2.push({ start: { x: I, y: J + 1 }, end: { x: block[I][J].x, y: block[I][J].y } });
            temp *= 2;
            data[I][J + 1] = 0;
            block[I][J + 1].alpha = blur;
        }

        if (data[I][J] != temp && data[I + 1][J] != 0) {
            let check = true;
            for (let i = 0; i < listDown.length; i++)
                if (listDown[i] != { x: I, y: J })
                    check = false;
            if (check)
                listDown.push({ x: I, y: J });
        }

        if (this.processBar.score < this.processBar.targetScore)
            this.processBar.update((temp == data[I][J]) ? 0 : temp);

        data[I][J] = temp;
        return listMove2;
    }

    checkLost() {
        for (let j = 0; j < Ncolum; j++)
            if (data[0][j] != 0)
                return true;
        return false;
    }

    createBlock(x, y, VALUE) {
        speedDown = speedBlock;
        if (this.touchListener != undefined)
            this.touchListener.ponit.z = 1;
        let k = 3;
        for (let i = 0; i < Nrow; i++)
            for (let j = 0; j < Ncolum; j++)
                if (k < Math.floor(Math.log2(data[i][j])))
                    k = Math.floor(Math.log2(data[i][j]));
        if (k > 6)
            k = Math.floor((k + 1) / 2);
        else k = 3;
        if (VALUE > 0)
            k = VALUE;
        let value = Math.pow(2, Math.floor(Math.random() * 999) % k + 1);
        this.loadData();
        if (this.newBlock != undefined)
            this.newBlock.alpha = 0;
        this.newBlock = new SpriteObject(
            this.gameScene,
            TextureCache[value + ".png"],
            XMilestones + x * blockSize,
            YMilestones + y * blockSize
        );
        this.newBlock.width = blockSize;
        this.newBlock.height = blockSize;
        this.newBlock.value = value;
    }

    loadData() {
        if (block.length > 0)
            for (let i = 0; i < Nrow; i++)
                for (let j = 0; j < Ncolum; j++)
                    block[i][j].alpha = 0;
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
    }

    end() {
        this.gameScene.setVisible(false);
        this.gameOverScene.setVisible(true);
    }

    distance(x, y) {
        return Math.sqrt(x * x + y * y);
    }

    moveBlock(ch) {
        let I = Math.floor((this.newBlock.y - YMilestones + 1 * blockSize) / blockSize);
        let J = Math.floor((this.newBlock.x - XMilestones + 0.5 * blockSize) / blockSize);
        if (J + ch < 0 || J + ch >= Ncolum)
            return;
        if (I >= 0 && data[I][J + ch] != 0)
            return;
        this.newBlock.x += ch * blockSize;
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