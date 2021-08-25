import * as level_game_1 from '../../assets/levels/level_1.json';
import * as level_game_2 from '../../assets/levels/level_2.json';
import * as level_game_3 from '../../assets/levels/level_3.json';
import * as level_game_4 from '../../assets/levels/level_4.json';
import * as level_game_5 from '../../assets/levels/level_5.json';
import * as level_game_6 from '../../assets/levels/level_6.json';

export default class LevelLoader {
    constructor() {
        this.init();
    }

    init() {
        this.level = [];
        this.level.push(level_game_2);
        this.level.push(level_game_2);
        this.level.push(level_game_3);
        this.level.push(level_game_4);
        this.level.push(level_game_5);
        this.level.push(level_game_6);
    }

    getLevel() {
        return this.level;
    }

    getNumberOfLevel() {
        return this.level.length;
    }
}