export interface IChartService {
  changeCharts(chartsList, options): void;
  getInitialOptions(stockData): void;
  getOptions(stockData, options): void;
  changeChartsTheme(chartsList): void;
  getChartColorOption(colorList): void;
  getChartListColor(): void;
  getChartThemeOption({ borderColor, containerColor, textColor }): void;
}
