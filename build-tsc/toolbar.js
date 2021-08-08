"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
const button_1 = require("./control/button");
const icon_1 = require("./icon");
/** Class that represents Toolbar element of the chart */
class Toolbar {
    constructor(parent) {
        this.parent = parent;
        this.initStyle();
        this.createElement();
        this.addLabel("symbol-name", "USD/JPY");
        this.addDropdown("timeframe", "Timeframe", [
            { text: "M1" },
            { text: "M5" },
            { text: "M15" },
            { text: "M30" },
            { text: "H1" },
            { text: "H4" },
            { text: "D1" },
            { text: "W1" },
            { text: "MN" },
        ], "H1");
        this.addDropdown("chart-type", "Candlestick", [
            { text: "Line" },
            { text: "Area" },
            { text: "Bar" },
            { text: "Candlestick" }
        ]);
        this.addButton("fullscreen", "Fullscreen", (button) => {
            // Toggle full screen
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            else {
                this.parent.element.requestFullscreen();
            }
        }, "right");
    }
    initStyle() {
        this.parent.addStyle(`
            .finchart .toolbar {
                display: flex;
                justify-content: space-between;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: ${this.parent.style.toolbarHeight}px;
                border-bottom: 2px solid ${this.parent.style.borderColor};
                color: ${this.parent.style.labelColor}
            }
            .finchart .toolbar > * {
                display: flex;
            }
            .finchart .toolbar > .right {
                flex-direction: row-reverse;
            }
            .finchart .toolbar > .left > * {
                border-right: 1px solid ${this.parent.style.borderColor};
            }
            .finchart .toolbar > .right > * {
                border-left: 1px solid ${this.parent.style.borderColor};
            }
            .finchart .toolbar > * > .label {
                line-height: ${this.parent.style.toolbarHeight}px;
                padding: 0 10px;
            }

            .finchart .toolbar .dropdown {
                position: relative;
                display: flex;
                align-items: center;
                user-select: none;
            }
                .finchart .toolbar .dropdown:hover {
                    background: ${this.parent.style.labelColor}22;
                }
                .finchart .toolbar .dropdown:active {
                    background: ${this.parent.style.labelColor}11;
                }
                .finchart .toolbar .dropdown .dropdown-label {
                    padding-left: 10px;
                    line-height: ${this.parent.style.toolbarHeight}px;
                }
                .finchart .toolbar .dropdown .icon {
                    display: flex;
                    align-items: center;
                    padding: 0 5px 0 5px;
                    width: auto;
                    height: 100%;
                }
                .finchart .toolbar .dropdown .options {
                    position: absolute;
                    top: 100%;
                    left: -1px;
                    margin-top: 1px;
                    padding: 10px 0;
                    min-width: 140px;
                    background: ${this.parent.style.bgColor}EE;
                    border: 1px solid ${this.parent.style.borderColor};
                    box-shadow: 0 4px 12px rgba(0,0,0,.17);
                }
                    .finchart .toolbar .dropdown .options.hidden {
                        display: none;
                    }
                    .finchart .toolbar .dropdown .options .option {
                        padding: 0 10px;
                        line-height: 30px;
                    }
                    .finchart .toolbar .dropdown .options .option:hover {
                        background: ${this.parent.style.labelColor}22;
                    }
                    .finchart .toolbar .dropdown .options .option:active {
                        background: ${this.parent.style.labelColor}11;
                    }
                    .finchart .toolbar .dropdown .options .option.selected {
                        font-weight: 600;
                        background: ${this.parent.style.labelColor}33;
                    }
            
            .finchart .toolbar .button {
                padding: 0 10px;
                height: 100%;
                display: flex;
                align-items: center;
                user-select: none;
            }
                .finchart .toolbar .button:hover {
                    background: ${this.parent.style.labelColor}22;
                }
                .finchart .toolbar .button:active {
                    background: ${this.parent.style.labelColor}11;
                }
                .finchart .toolbar .button .icon {
                    width: auto;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    padding-right: 5px;
                }
        `);
    }
    /** Create Toolbar HTML element */
    createElement() {
        this.element = document.createElement("div");
        this.element.className = "toolbar";
        this.element.innerHTML = `<div class="left"></div>`;
        this.element.innerHTML += `<div class="right"></div>`;
        this.parent.element.appendChild(this.element);
    }
    /** Create Toolbar Label element */
    addLabel(id, text, position) {
        let label = document.createElement("div");
        label.className = "label";
        label.id = id;
        label.innerText = text;
        this.element
            .querySelector(`.${position ? position : "left"}`)
            .appendChild(label);
    }
    /** Create Toolbar Dropdown element */
    addDropdown(id, text, options, selected, onChange, position) {
        // Selected option
        let selectedOption = undefined;
        if (selected) {
            selectedOption = options.find(option => option.text === selected || option.value === selected);
        }
        // Create dropdown element
        let dropdown = document.createElement("div");
        dropdown.className = "dropdown";
        dropdown.id = id;
        dropdown.innerHTML = `
            <div class="dropdown-label">${selectedOption ? selectedOption.text : text}</div>`;
        dropdown.innerHTML += `<div class="icon">` + icon_1.Icon.get("dropdown") + `</div>`;
        // Create options element
        dropdown.innerHTML += `<div class="options hidden"></div>`;
        for (const option of options) {
            let element = document.createElement("div");
            element.className = "option";
            element.innerHTML = `<div>${option.text}</div>`;
            if ((selectedOption && (selectedOption.value && (selectedOption.value === option.value))) ||
                (selectedOption && (selectedOption.text === option.text))) {
                element.classList.add("selected");
            }
            // Add select event listener
            element.addEventListener("click", () => {
                alert(`Dropdown menu "${option.text}" is clicked.`);
            });
            // Add to options list
            dropdown.querySelector(".options").appendChild(element);
        }
        // Add to toolbar
        this.element
            .querySelector(`.${position ? position : "left"}`)
            .appendChild(dropdown);
        // Add click event listener
        dropdown.addEventListener("click", () => {
            // Show or hide options
            let options = dropdown.querySelector(".options");
            if (options.classList.contains("hidden")) {
                options.classList.remove("hidden");
            }
            else {
                options.classList.add("hidden");
            }
        });
    }
    /** Create Toolbar Button element */
    addButton(icon, label, callback, position) {
        let button = new button_1.Button({ icon, label }, callback);
        this.element
            .querySelector(`.${position ? position : "left"}`)
            .appendChild(button.element);
    }
}
exports.Toolbar = Toolbar;
