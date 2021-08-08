"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Control = void 0;
/** Base class of every other controls */
class Control {
    constructor() {
        this.element = document.createElement("div");
        this.element.className = "control";
    }
}
exports.Control = Control;
