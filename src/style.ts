export interface ChartStyle {
    // Colors
    bgColor: string,
    labelColor: string,
    gridColor: string,
    borderColor: string,
    bullColor: string,
    bearColor: string,
    flatColor: string,
    // Dimensions
    toolbarHeight: number,
    priceAxisWidth: number,
    timeAxisHeight: number,
    // Font
    font: string
}

export const DefaultChartStyle = {
    bgColor: "#141420",
    labelColor: "#666677",
    gridColor: "#26262f",
    borderColor: "#343440",
    bullColor: "#00A562",
    bearColor: "#BF2121",
    flatColor: "yellow",
    toolbarHeight: 35,
    priceAxisWidth: 75,
    timeAxisHeight: 55,
    font: "14px Helvetica, Arial, sans-serif"
}