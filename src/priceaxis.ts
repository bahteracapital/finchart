import { OHLC } from "./data"
import { Viewport } from "./viewport"

export class PriceAxis {
    element: HTMLDivElement
    viewport: Viewport

    constructor (element: HTMLDivElement, viewport: Viewport) {
        this.element = element
        this.viewport = viewport
        this.plotPriceLabels()
        this.drawFlag()
    }

    plotPriceLabels (): void {
        this.element.innerHTML = ""
        const delta = this.viewport.bound.range / this.viewport.maxDataHeight
        for (let index = 0; index <= this.viewport.maxDataHeight; index++) {
            const label = document.createElement("div")
            label.className = "price"
            label.innerText = (this.viewport.bound.maxPrice - (delta * index)).toString().padEnd(7, "0").slice(0, 7)
            label.style.color = this.viewport.style.labelColor
            label.style.position = "absolute"
            label.style.left = "10px"
            label.style.top = (this.viewport.height * (this.viewport.padding) + (index * this.viewport.gridSize.height)) / this.viewport.pixelRatio + "px"
            label.style.lineHeight = "20px"
            label.style.marginTop = "-10px"
            this.element.appendChild(label)
        }
    }

    drawFlag (): void {
        const candle = this.viewport.data[0] as OHLC
        const ypos = (this.viewport.height * this.viewport.padding) + (this.viewport.pointSize.y * (this.viewport.bound.maxPrice - candle.close))
        let color = ""

        if (candle.direction === "up") {
            color = this.viewport.style.bullColor
        }
        else if (candle.direction === "down") {
            color = this.viewport.style.bearColor
        } else {
            color = this.viewport.style.flatColor
        }

        let element = document.createElement("div")
        element.className = "price-flag"
        element.innerText = candle.close.toString().padEnd(7, "0").substr(0, 7)
        element.style.background = `linear-gradient(270deg, ${color + "AA"}, ${color + "EE"})`
        element.style.color = "#FFFFFF"
        element.style.position = "absolute"
        element.style.zIndex = "9999"
        element.style.top = ((ypos / this.viewport.pixelRatio) - 15) + "px"
        element.style.left = "0"
        element.style.height = "20px"
        element.style.lineHeight = "20px"
        element.style.padding = "5px 10px"
        element.style.borderRadius = "4px"

        if (ypos < this.viewport.height) {
            this.element.appendChild(element)
        }
    }

}