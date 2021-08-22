export default class listSprite {
    constructor() {
        this.init();
    }

    init() {
        this.list = [];
    }

    add(Oj) {
        this.list.push(Oj);
    }

    clear() {
        this.list = [];
    }
}