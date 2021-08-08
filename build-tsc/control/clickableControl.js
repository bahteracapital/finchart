"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickableControl = void 0;
const control_1 = require("./control");
/** Base class of every other clickable control */
class ClickableControl extends control_1.Control {
    constructor(onClickEvent) {
        super();
        this.element.addEventListener("click", () => {
            if (onClickEvent)
                onClickEvent(this);
        });
    }
}
exports.ClickableControl = ClickableControl;
