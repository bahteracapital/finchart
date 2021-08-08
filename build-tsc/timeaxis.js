"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeAxis = void 0;
const timeframe_1 = require("./timeframe");
class TimeAxis {
    constructor(element, viewport) {
        this.element = element;
        this.viewport = viewport;
        this.plotDateTimeLabels();
    }
    plotDateTimeLabels() {
        this.element.innerHTML = "";
        let lastPeriodIndex = 0;
        for (let index = 0; index <= this.viewport.dataCursor.max; index++) {
            let item = this.viewport.displayData[index];
            let previousItem = this.viewport.displayData[index - 1];
            let timeLabelText = "";
            const date = item ? this.viewport.displayData[index].datetime : new Date();
            if (this.viewport.options.timeframe === timeframe_1.Timeframe.H1) {
                timeLabelText = date.getHours() + ":00";
            }
            // Time label
            if (index % 6 === 0) {
                const label = document.createElement("div");
                label.className = "time";
                const width = this.viewport.gridSize.width * 3;
                const rightPos = (index * this.viewport.gridSize.width + (this.viewport.style.priceAxisWidth * this.viewport.pixelRatio) + (this.viewport.padding * this.viewport.width) - (width) - this.viewport.scrollPos.x) / this.viewport.pixelRatio;
                label.innerText = timeLabelText;
                label.style.color = this.viewport.style.labelColor;
                label.style.position = "absolute";
                label.style.top = "10px";
                label.style.right = rightPos + "px";
                label.style.textAlign = "center";
                label.style.width = width + "px";
                if (rightPos >= (-1 * this.viewport.style.priceAxisWidth)) {
                    this.element.appendChild(label);
                }
            }
            // Period label
            (() => {
                if (index == 0 && item) {
                    const periodLabel = document.createElement("div");
                    const width = this.viewport.gridSize.width;
                    const rightPos = ((this.viewport.style.priceAxisWidth * this.viewport.pixelRatio) + (this.viewport.padding * this.viewport.width) + (this.viewport.gridSize.width * index) - this.viewport.scrollPos.x) / this.viewport.pixelRatio;
                    periodLabel.className = "period";
                    periodLabel.id = `period-${item.datetime.getDate()}-${item.datetime.getMonth()}`;
                    periodLabel.innerText = (item.datetime.getDate()).toString().padStart(2, "0") + "/" + (item.datetime.getMonth() + 1).toString().padStart(2, "0");
                    periodLabel.style.height = this.viewport.style.timeAxisHeight + "px";
                    periodLabel.style.position = "absolute";
                    periodLabel.style.top = "0";
                    periodLabel.style.right = rightPos + "px";
                    periodLabel.style.paddingTop = "30px";
                    periodLabel.style.boxSizing = "border-box";
                    periodLabel.style.borderLeft = "1px solid " + this.viewport.style.gridColor;
                    periodLabel.style.color = this.viewport.style.labelColor;
                    periodLabel.style.textAlign = "center";
                    if (rightPos <= (this.viewport.width / this.viewport.pixelRatio)) {
                        this.element.appendChild(periodLabel);
                    }
                }
                else if (item && previousItem) {
                    if (previousItem.datetime.getDate() !== item.datetime.getDate()) {
                        const periodLabel = document.createElement("div");
                        const width = this.viewport.gridSize.width * 4;
                        const rightPos = ((this.viewport.style.priceAxisWidth * this.viewport.pixelRatio) + (this.viewport.padding * this.viewport.width) + (this.viewport.gridSize.width * index) - this.viewport.scrollPos.x) / this.viewport.pixelRatio;
                        periodLabel.className = "period";
                        periodLabel.id = `period-${item.datetime.getDate()}-${item.datetime.getMonth()}`;
                        periodLabel.innerText = (item.datetime.getDate()).toString().padStart(2, "0") + "/" + (item.datetime.getMonth() + 1).toString().padStart(2, "0");
                        periodLabel.style.height = this.viewport.style.timeAxisHeight + "px";
                        periodLabel.style.position = "absolute";
                        periodLabel.style.top = "0";
                        periodLabel.style.right = rightPos + "px";
                        periodLabel.style.paddingTop = "30px";
                        periodLabel.style.boxSizing = "border-box";
                        periodLabel.style.borderLeft = "1px solid " + this.viewport.style.gridColor;
                        periodLabel.style.color = this.viewport.style.labelColor;
                        periodLabel.style.textAlign = "center";
                        if (rightPos <= (this.viewport.width / this.viewport.pixelRatio)) {
                            this.element.appendChild(periodLabel);
                        }
                        lastPeriodIndex = index;
                    }
                    else {
                        let prevLabel = this.element.querySelector(`#period-${item.datetime.getDate()}-${item.datetime.getMonth()}`);
                        if (prevLabel) {
                            prevLabel.style.width = (this.viewport.gridSize.width * (index - lastPeriodIndex + 1) / this.viewport.pixelRatio) + "px";
                        }
                    }
                }
            })();
        }
    }
}
exports.TimeAxis = TimeAxis;
