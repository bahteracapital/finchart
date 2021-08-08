"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OHLC = void 0;
class OHLC {
    // Warning! This will assume the date time is in UTC + 2 timezone
    constructor(datetime, open, high, low, close, volume) {
        const utc = new Date(datetime.replace(" ", "T"));
        const localDate = utc.getTime() - (2 * 3600000) - (utc.getTimezoneOffset() * 60000);
        this.datetime = new Date(localDate);
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume ? volume : undefined;
    }
    // Computed properties
    get range() {
        return this.high - this.low;
    }
    get barRange() {
        return this.close - this.open;
    }
    get direction() {
        if (this.barRange > 0)
            return "bull";
        if (this.barRange < 0)
            return "bear";
        return "flat";
    }
}
exports.OHLC = OHLC;
