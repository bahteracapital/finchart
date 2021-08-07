import { ChartType } from "./charttype";
import { Timeframe } from "./timeframe";

export interface ChartOptions {
    type: ChartType,
    timeframe: Timeframe
}

export const DefaultChartOptions = {
    type: ChartType.Candlestick,
    timeframe: Timeframe.H1
}