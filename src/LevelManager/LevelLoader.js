import * as level_game from '../../assets/levels/level.json';

export default class LevelLoader {
    constructor() {
        this.setup();
    }

    setup() {
        this.json = level_game;
    }
}