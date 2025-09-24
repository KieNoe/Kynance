import type { IChartService } from '@kynance/types';
import { injectable } from 'inversify';

import 'reflect-metadata';
import { changeCharts, changeChartsTheme, getChartListColor } from './apply';
import { getChartColorOption, getChartThemeOption, getInitialOptions, getOptions } from './option';
@injectable()
export class EChartsService implements IChartService {
  changeChartsTheme = changeChartsTheme;
  getChartListColor = getChartListColor;
  changeCharts = changeCharts;
  getInitialOptions = getInitialOptions;
  getOptions = getOptions;
  getChartColorOption = getChartColorOption;
  getChartThemeOption = getChartThemeOption;
}
