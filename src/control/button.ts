import { Icon } from "../icon";
import { ClickableControl } from "./clickableControl";

/** Button class for handling simple click interaction */
export class Button extends ClickableControl {
    label?: string
    icon?: string 

    constructor(data: {label?: string, icon?: string}, onClickEvent?: Function) {
        super(onClickEvent)
        this.label = data.label ? data.label : undefined
        this.icon = data.icon ? data.icon : undefined
        // Configure element
        this.element.classList.add("button")
        this.element.innerHTML = ``
        if (this.icon) this.element.innerHTML += `<div class="icon">` + Icon.get(this.icon) + `</div>`
        if (this.label) this.element.innerHTML += `<div class="label">${ this.label }</div>`
    }
}