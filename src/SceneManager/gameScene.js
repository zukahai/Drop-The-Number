import Scene from "./scene";

export default class gameScene {
    constructor(stage) {
        this.stage = stage;
        this.scene = new Scene(this.stage);
    }
}