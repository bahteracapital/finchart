export class OHLC {
	// Main properties
	public datetime: Date
	public open: number
	public high: number
	public low: number
	public close: number
	public volume?: number

	// Computed properties
	get range (): number {
		return this.high - this.low
	}
	get barRange () : number {
		return this.close - this.open
	}
	get direction () : string {
		if (this.barRange > 0)	return "up"
		if (this.barRange < 0)	return "down"
		return "flat"
	}

	// Warning! This will assume the date time is in UTC + 2 timezone
	constructor (datetime: string, open: number, high: number, low: number, close: number, volume?: number) {
		const utc = new Date(datetime.replace(" ", "T"))
		const localDate = utc.getTime() - (2 * 3600000) - (utc.getTimezoneOffset() * 60000)
		this.datetime = new Date(localDate)
		this.open = open
		this.high = high
		this.low = low
		this.close = close
		this.volume = volume ? volume : undefined
	}
}