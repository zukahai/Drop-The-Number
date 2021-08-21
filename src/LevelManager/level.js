import LevelLoader from "./LevelLoader";

export default class Level {
    constructor() {
        this.level = 1;
        this.init();
    }

    init() {
        this.Nlevel = 6;
        this.levelLoader = new LevelLoader();
        this.lv = this.levelLoader.getLevel();
    }

    getTarget(lv) {
        return this.lv[lv - 1].target;
    }

    getData(lv) {
        return this.lv[lv - 1].data;
    }

    getScore(lv) {
        let score = 0;
        for (let i = 0; i < lv - 1; i++)
            score += this.lv[i].target;
        return score;
    }

    getNumberOfLevel() {
        return this.Nlevel;
    }

    nextLevel() {
        this.level++;
        return this.level;
    }
}