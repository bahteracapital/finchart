"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finchart = void 0;
const data_1 = require("./data");
const options_1 = require("./options");
const priceaxis_1 = require("./priceaxis");
const style_1 = require("./style");
const timeaxis_1 = require("./timeaxis");
const toolbar_1 = require("./toolbar");
const viewport_1 = require("./viewport");
/** Finchart is an advanced financial charting library developed at Bahtera Capital */
class Finchart {
    /** Create new Finchart instance from an element */
    constructor(selector, data, options, style) {
        // Chart options & styling
        this.options = (options !== undefined) ? this.options = options : this.options = options_1.DefaultChartOptions;
        this.style = (style !== undefined) ? this.style = style : this.style = style_1.DefaultChartStyle;
        this.initStyle();
        // Process data
        this.data = this.prepareData(data);
        // Process chart interface
        this.configureGUI(selector);
        this.registerEvents();
    }
    // Computed properties
    get devicePixelRatio() {
        return window.devicePixelRatio;
    }
    get viewportSize() {
        return {
            width: this.viewport.width / this.devicePixelRatio,
            height: this.viewport.height / this.devicePixelRatio
        };
    }
    get bound() {
        return this.viewport.bound;
    }
    get maximumDataHeight() {
        return this.viewport.maxDataHeight;
    }
    get padding() {
        return this.viewport.padding;
    }
    get gridSize() {
        return {
            width: this.viewport.gridSize.width / this.devicePixelRatio,
            height: this.viewport.gridSize.height / this.devicePixelRatio
        };
    }
    get pointSize() {
        return {
            x: this.viewport.pointSize.x / this.devicePixelRatio,
            y: this.viewport.pointSize.y / this.devicePixelRatio
        };
    }
    /** Add StyleSheet */
    initStyle() {
        const styleClass = "finchart";
        // Remove previous style if exists
        const existingStyles = document.querySelectorAll(`head style.${styleClass}`);
        existingStyles.forEach(el => { el.remove(); });
        // Create new style element
        this.styleSheet = document.createElement("style");
        this.styleSheet.className = styleClass;
        this.styleSheet.innerHTML = `
			.finchart {}
			.finchart * {
				box-sizing: border-box
			}
		`;
        document.querySelector("head").appendChild(this.styleSheet);
    }
    /** Append style to StyleSheet */
    addStyle(style) {
        this.styleSheet.innerHTML += style;
    }
    /** Convert input data to acceptable types */
    prepareData(data) {
        let processedData = [];
        let type = "number";
        try {
            // Determine the input data type
            if (isNaN(data[0])) {
                type = "ohlc";
            }
            // Process number type
            if (type === "number") {
                for (const item of data) {
                    if (!isNaN(item)) {
                        processedData.push(item);
                    }
                    else {
                        throw "Data type must be consistent (Array<number>)";
                    }
                }
            }
            // Process ohlc type
            if (type === "ohlc") {
                for (const item of data) {
                    if (isNaN(item)) {
                        processedData.push(new data_1.OHLC(item[0], item[1], item[2], item[3], item[4], item[5]));
                    }
                    else {
                        throw "Data type must be consistent (Array<OHLC>)";
                    }
                }
            }
        }
        // Returns any errors
        catch (e) {
            console.error(`Prepare Data Error: ${e}`);
        }
        // Return generated data
        finally {
            return processedData.reverse();
        }
    }
    /** Configure chart GUI */
    configureGUI(selector) {
        try {
            // Configure chart element
            this.element = document.querySelector(selector);
            if (this.element === null)
                throw `Cannot find ${selector}`;
            // Set element dimension to fill container
            // this.element.style.width = "100%"
            // this.element.style.height = "100%"
            this.element.className = "finchart";
            this.element.style.position = "relative";
            this.element.style.overflow = "hidden";
            this.element.style.backgroundColor = this.style.bgColor;
            this.element.style.font = this.style.font;
            // Configure toolbar, viewport, and axes
            this.configureViewport();
            this.configureTimeAxis();
            this.configurePriceAxis();
            this.configureToolbar();
        }
        catch (e) {
            console.error(`Initializing Error: ${e}`);
        }
    }
    configureToolbar() {
        this.toolbar = new toolbar_1.Toolbar(this);
    }
    configureViewport() {
        const viewportElement = document.createElement("canvas");
        viewportElement.setAttribute("class", "viewport");
        viewportElement.style.position = "absolute";
        viewportElement.style.top = this.style.toolbarHeight + "px";
        viewportElement.style.left = "0";
        viewportElement.width = this.element.offsetWidth - this.style.priceAxisWidth;
        viewportElement.height = this.element.offsetHeight - this.style.toolbarHeight - this.style.timeAxisHeight;
        viewportElement.style.width = viewportElement.width + "px";
        viewportElement.style.height = viewportElement.height + "px";
        this.element.appendChild(viewportElement);
        this.viewport = new viewport_1.Viewport(viewportElement, this.data, this.options, this.style);
    }
    configurePriceAxis() {
        this.priceAxis = new priceaxis_1.PriceAxis(this);
    }
    configureTimeAxis() {
        const timeAxisElement = document.createElement("div");
        timeAxisElement.setAttribute("class", "time-axis");
        timeAxisElement.style.width = "100%";
        timeAxisElement.style.height = this.style.timeAxisHeight + "px";
        timeAxisElement.style.position = "absolute";
        timeAxisElement.style.bottom = "0";
        timeAxisElement.style.left = "0";
        timeAxisElement.style.borderTop = "2px solid " + this.style.borderColor;
        timeAxisElement.style.overflow = "hidden";
        timeAxisElement.style.cursor = "ew-resize";
        timeAxisElement.style.userSelect = "none";
        this.timeAxis = new timeaxis_1.TimeAxis(timeAxisElement, this.viewport);
        this.element.appendChild(this.timeAxis.element);
    }
    renderElements() {
        this.viewport.element.width = this.viewport.pixelRatio * (this.element.offsetWidth - this.style.priceAxisWidth);
        this.viewport.element.height = this.viewport.pixelRatio * (this.element.offsetHeight - this.style.toolbarHeight - this.style.timeAxisHeight);
        this.viewport.element.style.width = (this.element.offsetWidth - this.style.priceAxisWidth) + "px";
        this.viewport.element.style.height = (this.element.offsetHeight - this.style.toolbarHeight - this.style.timeAxisHeight) + "px";
        this.viewport.render();
        this.priceAxis.plotPriceLabels();
        this.priceAxis.drawFlag();
        this.timeAxis.plotDateTimeLabels();
    }
    registerEvents() {
        // Resize
        window.addEventListener("resize", () => {
            this.renderElements();
        });
        // Mouse scroll
        this.viewport.element.addEventListener("wheel", (e) => {
            this.viewport.scrollPos.x -= this.viewport.pixelRatio * e.deltaX;
            this.renderElements();
            if (this.viewport.scrollPos.x < 0) {
                window.requestAnimationFrame(() => {
                    this.viewport.scrollPos.x = 0;
                    this.renderElements();
                });
            }
            if (this.viewport.scrollPos.x > (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100) {
                window.requestAnimationFrame(() => {
                    this.viewport.scrollPos.x = (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100;
                    this.renderElements();
                });
            }
        });
        // Mouse drag
        let clickStartX = 0;
        let mouseMoveListener = (e) => {
            this.viewport.scrollPos.x -= this.viewport.pixelRatio * (clickStartX - e.clientX);
            clickStartX = e.clientX;
            this.renderElements();
            if (this.viewport.scrollPos.x < 0) {
                window.requestAnimationFrame(() => {
                    this.viewport.scrollPos.x = 0;
                    this.renderElements();
                });
            }
            if (this.viewport.scrollPos.x > (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100) {
                window.requestAnimationFrame(() => {
                    this.viewport.scrollPos.x = (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100;
                    this.renderElements();
                });
            }
        };
        this.viewport.element.addEventListener("mousedown", (e) => {
            clickStartX = e.clientX;
            this.viewport.element.addEventListener("mousemove", mouseMoveListener);
            this.viewport.element.addEventListener("mouseup", (e) => {
                this.viewport.element.removeEventListener("mousemove", mouseMoveListener);
            });
        });
        // Touch events
        let touchStart = 0;
        let touchStartTime = 0;
        let touchVelocity = 0;
        let touchMoveListener = (e) => {
            const deltaX = (touchStart - e.touches[0].clientX);
            this.viewport.scrollPos.x -= this.viewport.pixelRatio * deltaX;
            touchVelocity = Math.round(deltaX / (Date.now() - touchStartTime) * 10);
            touchStart = e.touches[0].clientX;
            touchStartTime = Date.now();
            this.renderElements();
            if (this.viewport.scrollPos.x < 0) {
                window.requestAnimationFrame(() => {
                    this.viewport.scrollPos.x = 0;
                    this.renderElements();
                });
            }
            if (this.viewport.scrollPos.x > (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100) {
                window.requestAnimationFrame(() => {
                    this.viewport.scrollPos.x = (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100;
                    this.renderElements();
                });
            }
        };
        this.viewport.element.addEventListener("touchstart", (e) => {
            touchStart = e.touches[0].clientX;
            touchStartTime = Date.now();
            this.viewport.element.addEventListener("touchmove", touchMoveListener);
            this.viewport.element.addEventListener("touchend", (e) => {
                this.viewport.element.removeEventListener("touchmove", touchMoveListener);
                if (this.viewport.scrollPos.x < 0) {
                    window.requestAnimationFrame(() => {
                        this.viewport.scrollPos.x = 0;
                        this.renderElements();
                    });
                }
            });
        });
        // Time-axis scale
        this.timeAxis.element.addEventListener("mousedown", (e) => {
            let startPos = e.clientX;
            const handleDrag = (dragEvent) => {
                const delta = (startPos - dragEvent.clientX) / 1000;
                this.viewport.setScaleX(delta);
                this.renderElements();
                startPos = dragEvent.clientX;
            };
            this.timeAxis.element.addEventListener("mousemove", handleDrag);
            this.timeAxis.element.addEventListener("mouseup", () => {
                this.timeAxis.element.removeEventListener("mousemove", handleDrag);
            });
        });
    }
}
exports.Finchart = Finchart;
// Keep track of how many instances in a page
Finchart.count = 0;
