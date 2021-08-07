import { Dimension, OHLC, Point } from "./data"
import { ChartOptions, DefaultChartOptions } from "./options"
import { PriceAxis } from "./priceaxis"
import { ChartStyle, DefaultChartStyle } from "./style"
import { TimeAxis } from "./timeaxis"
import { Toolbar } from "./toolbar"
import { Viewport, ViewportBound } from "./viewport"

/** Finchart is an advanced financial charting library developed at Bahtera Capital */
export class Finchart {
	// Keep track of how many instances in a page
	static count: number = 0

	element: HTMLElement
	data: Array<number> | Array<OHLC>

	viewport: Viewport
	priceAxis: PriceAxis
	timeAxis: TimeAxis
	toolbar: Toolbar

	options: ChartOptions
	style: ChartStyle

	// Computed properties
	get devicePixelRatio(): number {
		return window.devicePixelRatio
	}
	get viewportSize(): Dimension {
		return {
			width: this.viewport.width / this.devicePixelRatio,
			height: this.viewport.height / this.devicePixelRatio
		}
	}
	get bound(): ViewportBound {
		return this.viewport.bound
	}
	get maximumDataHeight(): number {
		return this.viewport.maxDataHeight
	}
	get padding(): number {
		return this.viewport.padding
	}
	get gridSize(): Dimension {
		return {
			width: this.viewport.gridSize.width / this.devicePixelRatio,
			height: this.viewport.gridSize.height / this.devicePixelRatio
		}
	}
	get pointSize(): Point {
		return {
			x: this.viewport.pointSize.x / this.devicePixelRatio,
			y: this.viewport.pointSize.y / this.devicePixelRatio
		}
	}

	/** Create new Finchart instance from an element */
	constructor (selector: string, data?: Array<any>, options?: ChartOptions, style?: ChartStyle) {
		// Chart options & styling
		this.options = (options !== undefined) ? this.options = options : this.options = DefaultChartOptions
		this.style = (style !== undefined) ? this.style = style : this.style = DefaultChartStyle
		// Process data
		this.data = this.prepareData(data)
		// Process chart interface
		this.configureGUI(selector)

		this.registerEvents()
	}

	/** Convert input data to acceptable types */
	prepareData (data: Array<any>): Array<number> | Array<OHLC> {
		let processedData = []
		let type = "number"
		try {
			// Determine the input data type
			if (isNaN(data[0])) {
				type = "ohlc"
			}
			// Process number type
			if (type === "number") {
				for (const item of data) {
					if (!isNaN(item)) {
						processedData.push(item)
					} else {
						throw "Data type must be consistent (Array<number>)"
					}
				}
			}
			// Process ohlc type
			if (type === "ohlc") {
				for (const item of data) {
					if (isNaN(item)) {
						processedData.push(new OHLC(
							item[0], item[1], item[2], item[3], item[4], item[5]
						))
					} else {
						throw "Data type must be consistent (Array<OHLC>)"
					}
				}
			}
		}
		// Returns any errors
		catch (e) {
			console.error(`Prepare Data Error: ${e}`)
		}
		// Return generated data
		finally {
			return processedData.reverse()
		}
	}

	/** Configure chart GUI */
	configureGUI (selector: string): void {
		try {
			// Configure chart element
			this.element = document.querySelector(selector)
			if (this.element === null) throw `Cannot find ${selector}`
			// Set element dimension to fill container
			// this.element.style.width = "100%"
			// this.element.style.height = "100%"
			this.element.className = "finchart"
			this.element.style.position = "relative"
			this.element.style.overflow = "hidden"
			this.element.style.backgroundColor = this.style.bgColor
			this.element.style.font = this.style.font
			// Configure toolbar, viewport, and axes
			this.configureViewport()
			this.configureTimeAxis()
			this.configurePriceAxis()
			this.configureToolbar()
		} catch (e) {
			console.error(`Initializing Error: ${e}`)
		}
	}

	configureToolbar(): void {
		const toolbarElement = document.createElement("div")
		toolbarElement.setAttribute("class", "toolbar")
		toolbarElement.style.width = "100%"
		toolbarElement.style.position = "absolute"
		toolbarElement.style.top = "0"
		toolbarElement.style.left = "0"
		toolbarElement.style.height = this.style.toolbarHeight + "px"
		toolbarElement.style.borderBottom = "2px solid " + this.style.borderColor
		this.toolbar = new Toolbar(toolbarElement, this.viewport)
		this.element.appendChild(this.toolbar.element)
	}

	configureViewport (): void {
		const viewportElement = document.createElement("canvas")
		viewportElement.setAttribute("class", "viewport")
		viewportElement.style.position = "absolute"
		viewportElement.style.top = this.style.toolbarHeight + "px"
		viewportElement.style.left = "0"
		viewportElement.width = this.element.offsetWidth - this.style.priceAxisWidth
		viewportElement.height = this.element.offsetHeight - this.style.toolbarHeight - this.style.timeAxisHeight
		viewportElement.style.width = viewportElement.width + "px"
		viewportElement.style.height = viewportElement.height + "px"
		this.element.appendChild(viewportElement)
		this.viewport = new Viewport(viewportElement, this.data, this.options, this.style)
	}

	configurePriceAxis (): void {
		this.priceAxis = new PriceAxis(this)
	}

	configureTimeAxis (): void {
		const timeAxisElement = document.createElement("div")
		timeAxisElement.setAttribute("class", "time-axis")
		timeAxisElement.style.width = "100%"
		timeAxisElement.style.height = this.style.timeAxisHeight + "px"
		timeAxisElement.style.position = "absolute"
		timeAxisElement.style.bottom = "0"
		timeAxisElement.style.left = "0"
		timeAxisElement.style.borderTop = "2px solid " + this.style.borderColor
		timeAxisElement.style.overflow = "hidden"
		timeAxisElement.style.cursor = "ew-resize"
		timeAxisElement.style.userSelect = "none"
		this.timeAxis = new TimeAxis(timeAxisElement, this.viewport)
		this.element.appendChild(this.timeAxis.element)
	}

	renderElements (): void {
		this.viewport.element.width = this.viewport.pixelRatio * (this.element.offsetWidth - this.style.priceAxisWidth)
		this.viewport.element.height = this.viewport.pixelRatio * (this.element.offsetHeight - this.style.toolbarHeight - this.style.timeAxisHeight)
		this.viewport.element.style.width = (this.element.offsetWidth - this.style.priceAxisWidth) + "px"
		this.viewport.element.style.height = (this.element.offsetHeight - this.style.toolbarHeight - this.style.timeAxisHeight) + "px"
		this.viewport.render()
		this.priceAxis.plotPriceLabels()
		this.priceAxis.drawFlag()
		this.timeAxis.plotDateTimeLabels()
	}

	registerEvents (): void {
		// Resize
		window.addEventListener("resize", () => {
			this.renderElements()
		})
		// Mouse scroll
		this.viewport.element.addEventListener("wheel", (e) => {
			this.viewport.scrollPos.x -= this.viewport.pixelRatio * e.deltaX
			this.renderElements()
			if (this.viewport.scrollPos.x < 0) {
				window.requestAnimationFrame(() => {
					this.viewport.scrollPos.x = 0
					this.renderElements()
				})
			}
			if (this.viewport.scrollPos.x > (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100) {
				window.requestAnimationFrame(() => {
					this.viewport.scrollPos.x = (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100
					this.renderElements()
				})
			}
		})
		// Mouse drag
		let clickStartX = 0
		let mouseMoveListener = (e) => {
			this.viewport.scrollPos.x -= this.viewport.pixelRatio * (clickStartX - e.clientX)
			clickStartX = e.clientX
			this.renderElements()
			if (this.viewport.scrollPos.x < 0) {
				window.requestAnimationFrame(() => {
					this.viewport.scrollPos.x = 0
					this.renderElements()
				})
			}
			if (this.viewport.scrollPos.x > (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100) {
				window.requestAnimationFrame(() => {
					this.viewport.scrollPos.x = (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100
					this.renderElements()
				})
			}
		}
		this.viewport.element.addEventListener("mousedown", (e) => {
			clickStartX = e.clientX
			this.viewport.element.addEventListener("mousemove", mouseMoveListener)
			this.viewport.element.addEventListener("mouseup", (e) => {
				this.viewport.element.removeEventListener("mousemove", mouseMoveListener)
			})
		})
		// Touch events
		let touchStart = 0
		let touchStartTime = 0
		let touchVelocity = 0
		let touchMoveListener = (e) => {
			const deltaX = (touchStart - e.touches[0].clientX)
			this.viewport.scrollPos.x -= this.viewport.pixelRatio * deltaX
			touchVelocity = Math.round(deltaX / (Date.now() - touchStartTime) * 10)
			touchStart = e.touches[0].clientX
			touchStartTime = Date.now()
			this.renderElements()
			if (this.viewport.scrollPos.x < 0) {
				window.requestAnimationFrame(() => {
					this.viewport.scrollPos.x = 0
					this.renderElements()
				})
			}
			if (this.viewport.scrollPos.x > (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100) {
				window.requestAnimationFrame(() => {
					this.viewport.scrollPos.x = (this.data.length * this.viewport.gridSize.width) - this.viewport.width + 100
					this.renderElements()
				})
			}
		}
		this.viewport.element.addEventListener("touchstart", (e) => {
			touchStart = e.touches[0].clientX
			touchStartTime = Date.now()
			this.viewport.element.addEventListener("touchmove", touchMoveListener)
			this.viewport.element.addEventListener("touchend", (e) => {
				this.viewport.element.removeEventListener("touchmove", touchMoveListener)

				if (this.viewport.scrollPos.x < 0) {
					window.requestAnimationFrame(() => {
						this.viewport.scrollPos.x = 0
						this.renderElements()
					})
				}
				
			})
		})

		// Time-axis scale
		this.timeAxis.element.addEventListener("mousedown", (e) => {
			let startPos = e.clientX
			const handleDrag = (dragEvent) => {
				const delta = (startPos - dragEvent.clientX) / 1000
				this.viewport.setScaleX(delta)
				this.renderElements()
				startPos = dragEvent.clientX
			}
			this.timeAxis.element.addEventListener("mousemove", handleDrag)
			this.timeAxis.element.addEventListener("mouseup", () => {
				this.timeAxis.element.removeEventListener("mousemove", handleDrag)
			})
		})
	}

}