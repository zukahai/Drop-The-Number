export default class Level {
    constructor(JsonData) {
        this.JsonData = JsonData;
        this.lv = [];
        this.init();
    }

    init() {
        this.Nlevel = Object.keys(this.JsonData).length - 1;
        this.lv.push({ target: this.JsonData.level1.target, data: this.JsonData.level1.data });
        this.lv.push({ target: this.JsonData.level2.target, data: this.JsonData.level2.data });
        this.lv.push({ target: this.JsonData.level3.target, data: this.JsonData.level3.data });
        this.lv.push({ target: this.JsonData.level4.target, data: this.JsonData.level4.data });
        this.lv.push({ target: this.JsonData.level5.target, data: this.JsonData.level5.data });
        this.lv.push({ target: this.JsonData.level6.target, data: this.JsonData.level6.data });
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
}