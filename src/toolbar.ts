import { Viewport } from "./viewport"

export class Toolbar {
    element: HTMLDivElement
    private viewport: Viewport

    constructor (element: HTMLDivElement, viewport: Viewport) {
        this.element = element
        this.viewport = viewport
        this.initStyle()
        this.initSymbol()
        this.initTimeframe()
        this.initChartType()
        this.initFullscreenTrigger()
    }

    initStyle (): void {
        this.element.style.display = "flex"
    }

    initSymbol (): void {
        const symbolElement = document.createElement("div")
        symbolElement.className = "symbol"
        symbolElement.innerHTML = `<strong class="name">USDJPY</strong>`
        
        symbolElement.style.color = this.viewport.style.labelColor
        symbolElement.style.height = this.viewport.style.toolbarHeight + "px"
        symbolElement.style.lineHeight = this.viewport.style.toolbarHeight + "px"
        symbolElement.style.boxSizing = "border-box"
        symbolElement.style.borderRight = "1px solid " + this.viewport.style.borderColor
        symbolElement.style.padding = "0 10px"
        
        this.element.appendChild(symbolElement)
    }

    initTimeframe(): void {
        const timeframeElement = document.createElement("div")
        timeframeElement.className = "timeframe"
        timeframeElement.innerHTML = `H1`

        timeframeElement.style.color = this.viewport.style.labelColor
        timeframeElement.style.height = this.viewport.style.toolbarHeight + "px"
        timeframeElement.style.lineHeight = this.viewport.style.toolbarHeight + "px"
        timeframeElement.style.boxSizing = "border-box"
        timeframeElement.style.borderRight = "1px solid " + this.viewport.style.borderColor
        timeframeElement.style.padding = "0 10px"

        this.element.appendChild(timeframeElement)
    }

    initChartType (): void {
        const timeframeElement = document.createElement("div")
        timeframeElement.className = "chart-type"
        timeframeElement.innerHTML = `Candlestick`

        timeframeElement.style.color = this.viewport.style.labelColor
        timeframeElement.style.height = this.viewport.style.toolbarHeight + "px"
        timeframeElement.style.lineHeight = this.viewport.style.toolbarHeight + "px"
        timeframeElement.style.boxSizing = "border-box"
        timeframeElement.style.borderRight = "1px solid " + this.viewport.style.borderColor
        timeframeElement.style.padding = "0 10px"

        this.element.appendChild(timeframeElement)
    }

    initFullscreenTrigger (): void {
        const timeframeElement = document.createElement("div")
        timeframeElement.className = "fullscreen-trigger"
        timeframeElement.innerHTML = `Fullscreen`

        timeframeElement.style.color = this.viewport.style.labelColor
        timeframeElement.style.height = this.viewport.style.toolbarHeight + "px"
        timeframeElement.style.lineHeight = this.viewport.style.toolbarHeight + "px"
        timeframeElement.style.boxSizing = "border-box"
        timeframeElement.style.borderRight = "1px solid " + this.viewport.style.borderColor
        timeframeElement.style.padding = "0 10px"

        this.element.appendChild(timeframeElement)
    }
}