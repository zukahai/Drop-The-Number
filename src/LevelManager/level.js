import LevelLoader from "./LevelLoader";

export default class Level {
    constructor() {
        this.currentLevel = 1;
        this.init();
    }

    init() {
        this.Nlevel = 6;
        this.levelLoader = new LevelLoader();
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
}