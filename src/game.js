import { Application, Text, TextStyle, TextureLoader, utils } from "pixi.js";
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
let speedDown = 0.3;
let indexNewBlock = 2;
let typeLoop = 1;
let listMove = [];

let data = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [8, 0, 8, 0, 4],
    [4, 8, 2, 2, 8],
    [1, 1, 1, 1, 1]
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

        this.processBar = new ProcessBar(200, blockSize);
        this.gameScene.addChild(this.processBar);

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
        this.creatBlock();

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

    loop(delta) {
        if (this.checkLost()) {
            this.end();
            this.message.text = "You lost!";
            this.ticker.stop();
        }
        if (typeLoop == 1) {
            this.loopType1();
        } else if (typeLoop == 2) {
            this.loopType2();
        }
    }

    loopType1() {
        this.newBlock.y += speedDown;
        if (this.newBlock.y >= YMilestones && data[Math.floor((this.newBlock.y - YMilestones + blockSize) / blockSize)][Math.floor((this.newBlock.x - XMilestones + 0.5 * blockSize) / blockSize)] != 0) {
            data[Math.floor((this.newBlock.y - YMilestones + 0.5 * blockSize) / blockSize)][Math.floor((this.newBlock.x - XMilestones + 0.5 * blockSize) / blockSize)] = this.newBlock.value;
            indexNewBlock = Math.floor((this.newBlock.x - XMilestones + 0.5 * blockSize) / blockSize);
            this.loadData();
            this.newBlock.alpha = 0;
            console.log(data);

            listMove = this.listMoveBlock();

            typeLoop = 2;
        }
    }

    loopType2() {
        console.log(listMove.length);
        let checkEndLoop2 = false;
        if (listMove.length <= 0)
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
            this.creatBlock();
            this.loadData();
            typeLoop = 1;
        }
    }

    listMoveBlock() {
        let listMove = [];
        let I = Math.floor((this.newBlock.y - YMilestones + 0.5 * blockSize) / blockSize);
        let J = Math.floor((this.newBlock.x - XMilestones + 0.5 * blockSize) / blockSize);

        let temp = data[I][J];
        if (I >= 0 && I < Nrow - 1 && data[I][J] == data[I + 1][J]) {
            listMove.push({ start: { x: I + 1, y: J }, end: { x: block[I][J].x, y: block[I][J].y } });
            temp *= 2;
            data[I + 1][J] = 0;
        }
        if (I >= 0 && J >= 1 && data[I][J] == data[I][J - 1]) {
            listMove.push({ start: { x: I, y: J - 1 }, end: { x: block[I][J].x, y: block[I][J].y } });
            temp *= 2;
            data[I][J - 1] = 0;
        }

        if (I >= 0 && J < Ncolum && data[I][J] == data[I][J + 1]) {
            listMove.push({ start: { x: I, y: J + 1 }, end: { x: block[I][J].x, y: block[I][J].y } });
            temp *= 2;
            data[I][J + 1] = 0;
        }
        if (this.processBar.score <= this.processBar.targetScore)
            this.processBar.update((temp == data[I][J]) ? 0 : temp);
        data[I][J] = temp;
        return listMove;
    }

    checkLost() {
        for (let j = 0; j < Ncolum; j++)
            if (data[0][j] != 0)
                return true;
        return false;
    }

    creatBlock() {
        let randomValue = Math.pow(2, Math.floor(Math.random() * 999) % 3 + 1);
        this.newBlock = new SpriteObject(
            this.gameScene,
            TextureCache[randomValue + ".png"],
            XMilestones + indexNewBlock * blockSize,
            YMilestones - blockSize
        );
        this.newBlock.width = blockSize;
        this.newBlock.height = blockSize;
        this.newBlock.value = randomValue;
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

    updateData() {
        for (let i = 0; i < Nrow; i++)
            for (let j = 0; j < Ncolum; j++) {
                data[i][j] *= 2;
                if (data[i][j] > Math.pow(2, 16))
                    data[i][j] = 2;
            }
        this.loadData();
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
            this.updateData();
        });

        right.setPress(() => {
            this.moveBlock(1);
        });

        down.setPress(() => {
            speedDown = 7;
        });

        left.setRelease(() => {

        });

        up.setRelease(() => {

        });

        right.setRelease(() => {

        });

        down.setRelease(() => {
            speedDown = 0.3;
        });
    }
}