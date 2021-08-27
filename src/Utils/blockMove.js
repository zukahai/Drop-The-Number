import { listMoveBlock, loadData } from "./utils";
import SpriteObject from "../SpriteManager/sprite-object";
import { TextureCache } from "@pixi/utils";
import { checkLost } from "./utils";

export function NextLevel(game) {
    let checkEndLoop4 = false;

    if (game.listMove == undefined)
        game.listMove = [];
    if (game.listMove.length == 0)
        checkEndLoop4 = true;

    for (let i = 0; i < game.listMove.length; i++) {
        let x = game.listMove[i].end.x;
        let y = game.listMove[i].end.y;
        if (Math.abs(game.block[game.listMove[i].start.x][game.listMove[i].start.y].x - game.listMove[i].end.x) > game.blockSize / 5 || Math.abs(game.block[game.listMove[i].start.x][game.listMove[i].start.y].y - game.listMove[i].end.y) > game.blockSize / 5) {
            for (let k = 0; k < 5; k++) {
                x = (game.block[game.listMove[i].start.x][game.listMove[i].start.y].x + x) / 2;
                y = (game.block[game.listMove[i].start.x][game.listMove[i].start.y].y + y) / 2;
            }
            game.block[game.listMove[i].start.x][game.listMove[i].start.y].x = x;
            game.block[game.listMove[i].start.x][game.listMove[i].start.y].y = y;
        } else {
            checkEndLoop4 = true;
            break;
        }
    }

    if (checkEndLoop4) {
        game.Level.nextLevel();
        game.Level.loadLevel(game);
        game.processBar.background.level_Text.setText("Level " + game.Level.currentLevel);
        game.typeLoop = 1;
    }
}

export function listBlockDown(game) {
    let checkEndLoop2 = false;
    if (game.listMove == undefined)
        game.listMove = [];
    if (game.listMove.length == 0)
        checkEndLoop2 = true;

    for (let i = 0; i < game.listMove.length; i++) {
        if (Math.abs(game.block[game.listMove[i].start.x][game.listMove[i].start.y].x - game.listMove[i].end.x) > 0.01 || Math.abs(game.block[game.listMove[i].start.x][game.listMove[i].start.y].y - game.listMove[i].end.y) > 0.01) {
            game.block[game.listMove[i].start.x][game.listMove[i].start.y].x = (game.block[game.listMove[i].start.x][game.listMove[i].start.y].x + game.listMove[i].end.x) / 2;
            game.block[game.listMove[i].start.x][game.listMove[i].start.y].y = (game.block[game.listMove[i].start.x][game.listMove[i].start.y].y + game.listMove[i].end.y) / 2;
        } else {
            checkEndLoop2 = true;
            break;
        }
    }

    if (checkEndLoop2) {
        loadData(game);
        for (let j = 0; j < game.Ncolum; j++) {
            let i = game.Nrow - 1;
            for (i = game.Nrow - 1; i >= 1; i--)
                if (game.data[i][j] == 0) {
                    let check = false;
                    for (let k = i - 1; k >= 0; k--)
                        if (game.data[k][j] != 0) {
                            check = true;
                            break;
                        }
                    let count = 0;
                    if (check) {
                        for (let k = i - 1; k >= 0; k--)
                            if (game.data[k][j] != 0) {
                                game.listDown.push({ x: i - count, y: j });
                                game.listMove.push({ start: { x: k, y: j }, end: { x: game.block[i - count][j].x, y: game.block[i - count][j].y } });
                                game.data[i - count][j] = game.data[k][j];
                                game.data[k][j] = 0;
                                if (k == 0)
                                    game.data[0][j] = 0;
                                count++;
                            }
                        break;
                    }
                }
        }

        game.typeLoop = 3;
    }
}

export function newBlockDown(game) {
    game.newBlock.y += game.speedDown;
    if (checkLost(game)) {
        game.gameOverScene.end(game);
        game.gameOverScene.setText("You lost!");
        game.ticker.stop();
    }
    if (game.newBlock.y >= game.YMilestones && game.data[Math.floor((game.newBlock.y - game.YMilestones + game.blockSize) / game.blockSize)][Math.floor((game.newBlock.x - game.XMilestones + 0.5 * game.blockSize) / game.blockSize)] != 0) {
        game.data[Math.floor((game.newBlock.y - game.YMilestones + 0.5 * game.blockSize) / game.blockSize)][Math.floor((game.newBlock.x - game.XMilestones + 0.5 * game.blockSize) / game.blockSize)] = game.newBlock.value;
        game.indexNewBlock = Math.floor((game.newBlock.x - game.XMilestones + 0.5 * game.blockSize) / game.blockSize);
        game.newBlock.alpha = 0;
        game.typeLoop = 2;
        game.listMove = listMoveBlock(game, Math.floor((game.newBlock.y - game.YMilestones + 0.5 * game.blockSize) / game.blockSize), Math.floor((game.newBlock.x - game.XMilestones + 0.5 * game.blockSize) / game.blockSize));
    }
}

export function mergeBlock(game) {
    let checkEndLoop3 = false;
    if (game.listMove.length == 0)
        checkEndLoop3 = true;

    for (let i = 0; i < game.listMove.length; i++) {
        if (Math.abs(game.block[game.listMove[i].start.x][game.listMove[i].start.y].x - game.listMove[i].end.x) > 0.01 || Math.abs(game.block[game.listMove[i].start.x][game.listMove[i].start.y].y - game.listMove[i].end.y) > 0.01) {
            game.block[game.listMove[i].start.x][game.listMove[i].start.y].x = (game.block[game.listMove[i].start.x][game.listMove[i].start.y].x + game.listMove[i].end.x) / 2;
            game.block[game.listMove[i].start.x][game.listMove[i].start.y].y = (game.block[game.listMove[i].start.x][game.listMove[i].start.y].y + game.listMove[i].end.y) / 2;
        } else {
            checkEndLoop3 = true;
            break;
        }
    }

    if (checkEndLoop3) {
        loadData(game);
        game.listMove = [];
        let listDown2 = game.listDown;
        game.listDown = [];
        for (let i = 0; i < listDown2.length; i++)
            game.listMove = game.listMove.concat(listMoveBlock(game, listDown2[i].x, listDown2[i].y));
        if (game.listMove.length == 0) {
            createBlock(game, -1, -1);
            game.typeLoop = 1;
        } else game.typeLoop = 2;
    }
}

export function createBlock(game, y, VALUE) {
    let x = game.indexNewBlock;
    game.speedDown = game.speedBlock;
    if (game.touchListener != undefined)
        game.touchListener.ponit.z = 1;
    let k = 3;
    for (let i = 0; i < game.Nrow; i++)
        for (let j = 0; j < game.Ncolum; j++)
            if (k < Math.floor(Math.log2(game.data[i][j])))
                k = Math.floor(Math.log2(game.data[i][j]));
    if (k > 6)
        k = Math.floor((k + 1) / 2);
    else k = 3;
    if (VALUE > 0)
        k = VALUE;
    let value = Math.pow(2, Math.floor(Math.random() * 999) % k + 1);
    loadData(game);
    if (game.newBlock != undefined)
        game.newBlock.alpha = 0;
    game.newBlock = new SpriteObject(
        game.gameScene.scene,
        TextureCache[value + ".png"],
        game.XMilestones + x * game.blockSize,
        game.YMilestones + y * game.blockSize
    );
    game.newBlock.width = game.blockSize;
    game.newBlock.height = game.blockSize;
    game.newBlock.value = value;
}

export function moveBlock(game, ch) {
    let I = Math.floor((game.newBlock.y - game.YMilestones + 1 * game.blockSize) / game.blockSize);
    let J = Math.floor((game.newBlock.x - game.XMilestones + 0.5 * game.blockSize) / game.blockSize);
    if (J + ch < 0 || J + ch >= game.Ncolum)
        return;
    if (I >= 0 && game.data[I][J + ch] != 0)
        return;
    game.newBlock.x += ch * game.blockSize;
}