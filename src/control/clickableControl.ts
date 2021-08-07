import { Control } from "./control";

/** Base class of every other clickable control */
export class ClickableControl extends Control {
    constructor(onClickEvent?: Function) {
        super()
        this.element.addEventListener("click", () => {
            if (onClickEvent) onClickEvent(this)
        })
    }
}