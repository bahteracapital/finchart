import { OHLC } from "./data"
import { Finchart } from "./finchart"

/**
 * Class that represent price-axis of the chart
 */
export class PriceAxis {
    
    private parent: Finchart
    element: HTMLDivElement

    /**
     * @constructor
     * @param parent {Finchart} 
     */
    constructor (parent: Finchart) {
        this.parent = parent
        this.initStyle()
        this.drawElement()
        this.plotPriceLabels()
        if (this.parent.options.displayFlag) {
            this.drawFlag()
        }
    }

    /** Add CSS to document */
    initStyle (): void {
        this.parent.addStyle(`
            .finchart .price-axis {
                position: absolute;
                top: ${ this.parent.style.toolbarHeight }px;
                right: 0;
                width: ${ this.parent.style.priceAxisWidth }px;
                height: ${ this.parent.style.timeAxisHeight + this.parent.viewportSize.height }px;
                border-left: 2px solid ${ this.parent.style.borderColor };
                background: ${ this.parent.style.bgColor + "BB" };
                overflow: hidden;
            }
            .finchart .price-axis .price {
                position: absolute;
                left: 10px;
                line-height: 20px;
                margin-top: -10px;
                color: ${ this.parent.style.labelColor };
            }
            .finchart .price-axis .price-flag {
                position: absolute;
                left: 0;
                height: 20px;
                margin-top: -15px;
                padding: 5px 10px;
                line-height: 20px;
                z-index: 1000;
                color: #FFF;
                border-radius: 4px;
            }
        `)
    }

    /** Draws HTML element of price axis */
    drawElement (): void {
        // Create HTML element
        this.element = document.createElement("div")
        this.element.className = "price-axis"
        // Append to parent
        this.parent.element.appendChild(this.element)
    }

    /** Plot price labels */
    plotPriceLabels (): void {
        this.element.innerHTML = ""
        const delta = this.parent.bound.range / this.parent.maximumDataHeight
        for (let index = 0; index <= this.parent.maximumDataHeight; index++) {
            const label = document.createElement("div")
            label.className = "price"
            label.innerText = (this.parent.bound.maxPrice - (delta * index)).toString().padEnd(7, "0").slice(0, 7)
            label.style.top = this.parent.viewportSize.height * (this.parent.padding) + (index * this.parent.gridSize.height) + "px"
            this.element.appendChild(label)
        }
    }

    /** Draw current price flag */
    drawFlag (): void {
        const candle = this.parent.data[0] as OHLC
        const ypos = (this.parent.viewportSize.height * this.parent.padding) + (this.parent.pointSize.y * (this.parent.bound.maxPrice - candle.close))
        const color = this.parent.style[candle.direction + "Color"]

        let element = document.createElement("div")
        element.className = "price-flag"
        element.innerText = candle.close.toString().padEnd(7, "0").substr(0, 7)
        element.style.background = `linear-gradient(270deg, ${color + "AA"}, ${color + "EE"})`
        element.style.top = ypos + "px"

        if (ypos < this.parent.viewportSize.height) {
            this.element.appendChild(element)
        }
    }

}