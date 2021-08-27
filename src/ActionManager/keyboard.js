import { moveBlock } from "../Utils/blockMove";

export default class Keyboard {
    constructor(value) {
        this.value = value;
        this.isDown = false;
        this.isUp = true;
        this.release = undefined;
        this.press = undefined;
        this.handle();
    }

    setPress(fn) {
        this.press = fn;
    }

    setRelease(fn) {
        this.release = fn;
    }

    handle() {
        window.addEventListener(
            "keydown", (event) => this.downListener(event), false
        );
        window.addEventListener(
            "keyup", (event) => this.upListener(event), false
        );
    }

    downListener(event) {
        if (event.key === this.value)
            if (this.isUp && this.press)
                this.press();
    }

    upListener(event) {
        if (event.key === this.value) {
            this.release();
            this.isDown = false;
            this.isUp = true;
            event.preventDefault();
        }
    }

    unsubscribe() {
        window.removeEventListener("keydown", this.downListener);
        window.removeEventListener("keyup", this.upListener);
    }
}

export function setupController(game) {
    let left = new Keyboard("ArrowLeft"),
        up = new Keyboard("ArrowUp"),
        right = new Keyboard("ArrowRight"),
        down = new Keyboard("ArrowDown");

    left.setPress(() => {
        moveBlock(game, -1);
    });

    up.setPress(() => {

    });

    right.setPress(() => {
        moveBlock(game, 1);
    });

    down.setPress(() => {
        game.speedDown = 30 * game.speedBlock;
    });

    left.setRelease(() => {

    });

    up.setRelease(() => {

    });

    right.setRelease(() => {

    });

    down.setRelease(() => {
        game.speedDown = game.speedBlock;
    });
}