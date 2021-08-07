import { ChartType } from "./charttype"
import { OHLC } from "./data"
import { ChartOptions } from "./options"
import { ChartStyle } from "./style"

/** A viewport class that contains all the chart elements and drawings */
export class Viewport {

    style: ChartStyle
    options: ChartOptions

    element: HTMLCanvasElement
    data: Array<number> | Array<OHLC>
    maxDataLength: number
    maxDataHeight: number
    displayData: Array<number> | Array<OHLC>
    dataCursor: { min: number, max: number }
    
    width: number
    height: number
    padding: number

    bound: ViewportBound
    scrollPos: { x: number, y: number }
    scale: { x: number, y: number }
    pointSize: { x: number, y: number }
    gridSize: { width: number, height: number }

    pixelRatio: number

    get innerHeight(): number {
        return this.height - (2 * this.padding * this.height)
    }

    get innerWidth(): number {
        return this.width * (1 - this.padding)
    }

    /** Create a viewport instance */
    constructor (element: HTMLCanvasElement, data: Array<number> | Array<OHLC>, options: ChartOptions, style: ChartStyle) {
        this.element = element
        
        this.padding = 0.05
        this.scrollPos = { x: 0, y: 0 }
        this.scale = { x: 1, y: 1 }
        this.pointSize = { x: 9, y: 9 }
        
        this.data = data
        this.options = options
        this.style = style

        // Adjusting for high density display
        this.pixelRatio = window.devicePixelRatio
        if (this.pixelRatio !== 1) {
            this.pointSize = { x: this.pointSize.x * this.pixelRatio, y: this.pointSize.y * this.pixelRatio }
            this.element.width = this.pixelRatio * this.element.width
            this.element.height = this.pixelRatio * this.element.height
        }

        this.render()
    }

    /** Render viewport */
    render (): void {

        const context = this.element.getContext("2d")
        this.width = this.element.width
        this.height = this.element.height
        context.clearRect(0, 0, this.width, this.height)

        this.maxDataHeight = 10

        this.gridSize = {
            height: this.scale.y * this.innerHeight / this.maxDataHeight,
            width: this.scale.x * this.pointSize.x
        }


        // Calculate data length
        const scrolledPoints = Math.ceil(this.scrollPos.x / this.gridSize.width)
        let startIndex = 0
        if (this.scrollPos.x >= (this.padding * this.width)) {
            startIndex = Math.floor((this.scrollPos.x - (this.padding * this.width)) / this.gridSize.width)
        } else {
            startIndex = 0
        }
        this.maxDataLength = Math.ceil(this.innerWidth / this.gridSize.width)
        
        this.dataCursor = { min: startIndex, max: scrolledPoints + (this.maxDataLength - 1) }
        if (this.dataCursor.max > this.data.length) {
            this.dataCursor.max = this.data.length
        }
        this.displayData = this.data.slice(0, this.dataCursor.max)
        
        // Calculate bounds
        let minPrice: number, maxPrice: number, minDateTime: Date, maxDateTime: Date, timeRange: number
        const cursorDisplayData = this.data.slice(this.dataCursor.min, this.dataCursor.max)

        if (typeof this.displayData[0] === "number") {
            minPrice = Math.min(...cursorDisplayData as Array<number>)
            maxPrice = Math.max(...cursorDisplayData as Array<number>)
            this.bound = { minPrice, maxPrice, range: maxPrice - minPrice, timeRange: this.displayData.length }
        } else {
            minPrice = Math.floor(Math.min(...cursorDisplayData.map((v) => v.low) as Array<number>) * 100 ) / 100
            maxPrice = Math.ceil(Math.max(...cursorDisplayData.map((v) => v.high) as Array<number>) * 100) / 100
            minDateTime = new Date(Math.min(...this.displayData.map((v) => v.datetime.getTime()) as Array<number>))
            maxDateTime = new Date(Math.max(...this.displayData.map((v) => v.datetime.getTime()) as Array<number>))
            this.bound = { minPrice, maxPrice, minDateTime, maxDateTime, range: maxPrice - minPrice, timeRange: maxDateTime.getTime() - minDateTime.getTime() }
        }
        
        this.pointSize.y = this.innerHeight / this.bound.range
        this.drawGrids()
        
        // Plot the chart
        if (this.options.type === ChartType.Candlestick) {
            this.plotCandlesticks()
        }

        this.drawFlag()

    }

    /** Render the underlying grids */
    drawGrids (): void {
        // Draw horizontal grid
        const context = this.element.getContext("2d")
        context.strokeStyle = this.style.gridColor
        for (let index = 0; index <= this.maxDataHeight; index++) {
            const pos = (this.padding * this.height) + (this.gridSize.height * index)
            context.beginPath()
            context.setLineDash([10,5])
            context.moveTo(0, pos)
            context.lineTo(this.width, pos)
            context.stroke()
        }
        // Draw vertical grid
        context.strokeStyle = this.style.gridColor
        for (let index = 0; index <= this.dataCursor.max; index += 6) {
            const pos = this.width * (1 - this.padding) - (this.gridSize.width * index)
            context.beginPath()
            context.setLineDash([10, 5])
            context.moveTo(pos + this.scrollPos.x, 0)
            context.lineTo(pos + this.scrollPos.x, this.height)
            context.stroke()
        }
    }

    /** Render the line chart */
    plotLine (): void {}

    /** Render the bar chart */
    plotBars (): void { }

    /** Render the area chart */
    plotArea (): void { }

    /** Render the candlesticks chart */
    plotCandlesticks (): void {
        const context = this.element.getContext("2d")
        for (let index = 0; index <= this.dataCursor.max; index++) {
            const candle = this.displayData[index] as OHLC

            if (candle) {
                if (candle.direction === "bull") {
                    context.strokeStyle = this.style.bullColor
                    context.fillStyle = this.style.bullColor
                }
                else if (candle.direction === "bear") {
                    context.strokeStyle = this.style.bearColor
                    context.fillStyle = this.style.bearColor
                } else {
                    context.strokeStyle = this.style.flatColor
                    context.fillStyle = this.style.flatColor
                }
                
                // Draw candle line
                const xpos = this.width * (1 - this.padding) - (this.gridSize.width * index)
                const ypos = (this.height * this.padding) + (this.pointSize.y * (this.bound.maxPrice - candle.high))
                context.beginPath()
                context.setLineDash([])
                context.moveTo(xpos + this.scrollPos.x, ypos)
                context.lineTo(xpos + this.scrollPos.x, ypos + (this.pointSize.y * candle.range))
                context.stroke()

                // Draw candle body
                let candleBody = {
                    x: xpos - (0.5 * this.gridSize.width) + Math.floor(this.gridSize.width / 4) + 1 + this.scrollPos.x,
                    y: 0,
                    width: this.gridSize.width - Math.floor(this.gridSize.width / 2),
                    height: this.pointSize.y * Math.abs(candle.close - candle.open)
                }
                if (candle.direction === "bear") {
                    candleBody.y = ypos + (this.pointSize.y * (candle.high - candle.open))
                }
                else if (candle.direction === "bull") {
                    candleBody.y = ypos + (this.pointSize.y * (candle.high - candle.close))
                }
                else {
                    candleBody.y = ypos + (this.pointSize.y * (candle.high - candle.open))
                    candleBody.height = 1
                }
                context.fillRect(candleBody.x, candleBody.y, candleBody.width, candleBody.height)
            }

        }
    }

    drawFlag (): void {
        const candle = this.data[0] as OHLC
        const context = this.element.getContext("2d")

        const ypos = (this.height * this.padding) + (this.pointSize.y * (this.bound.maxPrice - candle.close))

        if (candle.direction === "bull") {
            context.strokeStyle = this.style.bullColor
            context.fillStyle = this.style.bullColor
        }
        else if (candle.direction === "bear") {
            context.strokeStyle = this.style.bearColor
            context.fillStyle = this.style.bearColor
        } else {
            context.strokeStyle = this.style.flatColor
            context.fillStyle = this.style.flatColor
        }

        // Draw line
        context.beginPath()
        context.setLineDash([10,5])
        context.moveTo(0, ypos)
        context.lineTo(this.width, ypos)
        context.stroke()
        context.setLineDash([])
    }

    // Scaling methods
    setScaleX (delta: number): void {
        const scale = this.scale.x + delta
        if (scale <= 2 && scale >= 0.5) {
            this.scale.x = scale
            const scrolledCandles = this.scrollPos.x / this.gridSize.width
            this.scrollPos.x = scrolledCandles * this.gridSize.width
        }
    }

}

export interface ViewportBound {
    minPrice: number
    maxPrice: number
    range: number
    minDateTime?: Date
    maxDateTime?: Date
    timeRange: number
}