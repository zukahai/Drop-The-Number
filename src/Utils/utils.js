import SpriteObject from "../SpriteManager/sprite-object.js";
import { utils } from "pixi.js";

const TextureCache = utils.TextureCache;

export function loadData(game) {
    if (game.block.length > 0)
        for (let i = 0; i < game.Nrow; i++)
            for (let j = 0; j < game.Ncolum; j++)
                game.block[i][j].alpha = 0;
    for (let i = 0; i < game.Nrow; i++) {
        let temp = [];
        for (let j = 0; j < game.Ncolum; j++) {
            temp[j] = new SpriteObject(
                game.gameScene.scene,
                TextureCache[game.data[i][j] + ".png"],
                j * game.blockSize + game.XMilestones,
                i * game.blockSize + game.YMilestones
            );
            temp[j].width = game.blockSize;
            temp[j].height = game.blockSize;
        }
        game.block[i] = temp;
    }
}

export function listMoveBlock(game, x, y) {
    let listMove = [];
    let I = x;
    let J = y;

    let temp = game.data[I][J];
    if (I >= 0 && I < game.Nrow - 1 && game.data[I][J] == game.data[I + 1][J]) {
        listMove.push({ start: { x: I + 1, y: J }, end: { x: game.block[I][J].x, y: game.block[I][J].y } });
        temp *= 2;
        game.data[I + 1][J] = 0;
        game.block[I + 1][J].alpha = blur;
    }

    if (I >= 1 && I < game.Nrow - 1 && game.data[I][J] == game.data[I - 1][J]) {
        listMove.push({ start: { x: I - 1, y: J }, end: { x: game.block[I][J].x, y: game.block[I][J].y } });
        temp *= 2;
        game.data[I - 1][J] = 0;
        game.block[I - 1][J].alpha = blur;
    }

    if (I >= 0 && J >= 1 && game.data[I][J] == game.data[I][J - 1]) {
        listMove.push({ start: { x: I, y: J - 1 }, end: { x: game.block[I][J].x, y: game.block[I][J].y } });
        temp *= 2;
        game.data[I][J - 1] = 0;
        game.block[I][J - 1].alpha = blur;
    }

    if (I >= 0 && J < game.Ncolum && game.data[I][J] == game.data[I][J + 1]) {
        listMove.push({ start: { x: I, y: J + 1 }, end: { x: game.block[I][J].x, y: game.block[I][J].y } });
        temp *= 2;
        game.data[I][J + 1] = 0;
        game.block[I][J + 1].alpha = blur;
    }

    if (game.data[I][J] != temp && game.data[I + 1][J] != 0) {
        let check = true;
        for (let i = 0; i < game.listDown.length; i++)
            if (game.listDown[i] != { x: I, y: J })
                check = false;
        if (check)
            game.listDown.push({ x: I, y: J });
    }

    if (game.processBar.score < game.processBar.targetScore)
        game.processBar.update((temp == game.data[I][J]) ? 0 : temp);

    game.data[I][J] = temp;
    return listMove;
}