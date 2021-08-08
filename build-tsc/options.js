"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultChartOptions = void 0;
const charttype_1 = require("./charttype");
const timeframe_1 = require("./timeframe");
exports.DefaultChartOptions = {
    type: charttype_1.ChartType.Candlestick,
    timeframe: timeframe_1.Timeframe.H1,
    displayFlag: true
};
