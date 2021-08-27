import LevelLoader from "./LevelLoader";
import ProcessBar from "../ProcessManager/ProcessBar";

export default class Level {
    constructor() {
        this.currentLevel = 1;
        this.init();
    }

    init() {
        this.levelLoader = new LevelLoader();
        this.Nlevel = this.levelLoader.getNumberOfLevel();
        this.lv = this.levelLoader.getLevel();
    }

    getTarget() {
        return this.lv[this.currentLevel - 1].target;
    }

    getData() {
        return this.lv[this.currentLevel - 1].data;
    }

    getScore() {
        let score = 0;
        for (let i = 0; i < this.currentLevel - 1; i++)
            score += this.lv[i].target;
        return score;
    }

    getNumberOfLevel() {
        return this.Nlevel;
    }

    nextLevel() {
        this.currentLevel++;
        return this.currentLevel;
    }

    loadLevel(game) {
        game.processBar = new ProcessBar(game.Level, game.blockSize);
        game.data = game.Level.getData();

        game.gameScene.scene.addChild(game.processBar);

        game.indexNewBlock = 2;
        game.createBlock(game.indexNewBlock, -1, 1);

        game.listDown = game.listDown = [];
    }
}