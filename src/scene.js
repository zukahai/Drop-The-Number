import {Container } from 'pixi.js';

export default class Scene extends Container {
    constructor(stage){
        super();
        stage.addChild(this);
    }

    setVisible(visible){
        this.visible = visible;
    }

    addChild(child){
        super.addChild(child);
    }
}