import { ChartType } from "./charttype";
import { Timeframe } from "./timeframe";

export interface ChartOptions {
    type: ChartType,
    timeframe: Timeframe,
    // Price axis settings
    displayFlag: boolean
}

export const DefaultChartOptions = {
    type: ChartType.Candlestick,
    timeframe: Timeframe.H1,
    displayFlag: true
}