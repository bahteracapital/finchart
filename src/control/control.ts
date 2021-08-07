/** Base class of every other controls */
export class Control {
    element: HTMLElement
    constructor() {
        this.element = document.createElement("div")
        this.element.className = "control"
    }
}