import SpriteObject from "./SpriteManager/sprite-object.js";
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