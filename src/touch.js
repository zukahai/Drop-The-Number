export default class TouchListener {

    constructor(parent, listen = false) {
        this.parent = parent;

        this.ponit = {};

        if (listen) {
            this.isDown = false;
            this.signEvent("touchstart", "drag_start", params => this._actionDown(params));
            this.signEvent("touchmove", "drag_move", params => this._actionMove(params));
            this.signEvent("touchend", "drag_end", params => this._actionUp(params));
        }
    }

    _actionDown(params) {
        this.isDown = true;
        this.lastDownTimestamp = Date.now();
        this.startPosition = params;
        this.started = false;
    }

    _actionMove(params) {
        if (this.isDown) {
            if (!this.started) {
                this.handle('drag_start', this.startPosition)
                this.started = true;
            }
            this.handle('drag_move', params)
        }
    }

    _actionUp(params) {
        if (this.isDown) {
            if (Date.now() - this.lastDownTimestamp < 200) {
                this.handle('click', params)
            } else if (this.startPosition !== params && Date.now() - this.lastDownTimestamp > 200) {
                this.handle('drag_end', params);
            }
            this.isDown = false;
        }

    }

    signEvent(event, tag, modifier = null, reformat = true) {
        this.parent.addEventListener(event, (e) => {
            if (reformat) {
                let x = 0,
                    y = 0;
                e.clientX;
                if (e.type == "touchstart" || e.type == "touchmove" || e.type == "touchend") {
                    var touch = e.touches[0] || e.changedTouches[0];
                    let rect = e.target.getBoundingClientRect();
                    x = parseInt(touch.pageX - rect.left);
                    y = parseInt(touch.pageY - rect.top);
                    this.ponit = { x, y };
                }
            }
        });
    }
}