"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const icon_1 = require("../icon");
const clickableControl_1 = require("./clickableControl");
/** Button class for handling simple click interaction */
class Button extends clickableControl_1.ClickableControl {
    constructor(data, onClickEvent) {
        super(onClickEvent);
        this.label = data.label ? data.label : undefined;
        this.icon = data.icon ? data.icon : undefined;
        // Configure element
        this.element.classList.add("button");
        this.element.innerHTML = ``;
        if (this.icon)
            this.element.innerHTML += `<div class="icon">` + icon_1.Icon.get(this.icon) + `</div>`;
        if (this.label)
            this.element.innerHTML += `<div class="label">${this.label}</div>`;
    }
}
exports.Button = Button;
