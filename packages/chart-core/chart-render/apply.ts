import trim from 'lodash/trim';
import { Color } from 'tvision-color';
import { ModeType, KColorToken } from '@kynance/types';

import { getChartColorOption, getTrendingChartColorOption, getShockChartColorOption } from './option';

const order = [getChartColorOption, getTrendingChartColorOption, getShockChartColorOption];

/**
 * 依据主题类型获取颜色
 *
 * @export
 * @param {string} theme
 * @returns {}
 */
export function getColorFromTheme(): Array<string> {
  try {
    const theme = trim(getComputedStyle(document.documentElement).getPropertyValue('--td-brand-color'));
    const themeColorList = Color.getRandomPalette({
      color: theme,
      colorGamut: 'bright',
      number: 8,
    });

    return themeColorList;
  } catch {
    return ['#0052d9', '#78bdd5', '#ef84ce', '#57c2b8', '#ef9f79', '#4fc241', '#73a4e1', '#f59e78'];
  }
}

/** 图表颜色 */
export function getChartListColor(): Array<string> {
  const res = getColorFromTheme();

  return res;
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

/**
 * 更改图表主题颜色
 *
 * @export
 * @param {Array<string>} chartsList
 * @param {string} theme
 */
export function changeChartsTheme(chartsList): void {
  if (chartsList && chartsList.length) {
    for (let index = 0; index < chartsList.length; index++) {
      const elementChart = chartsList[index].ref;

      if (elementChart) {
        const optionVal = elementChart.getOption();

        // 更改主题颜色
        deepMerge(optionVal, order[index](getChartListColor()));

        elementChart.setOption(optionVal, true);
      }
    }
  }
}

export function changeCharts(chartsList, options): void {
  if (chartsList && chartsList.length) {
    for (let i = 0; i < chartsList.length; i++) {
      const chart = chartsList[i].ref;
      let optionVal = chart.getOption();
      optionVal = Object.assign(optionVal, options[i]);
      const chartChangeColor = getChartListColor();
      const colorOption = order[i](chartChangeColor);
      deepMerge(optionVal, colorOption);
      chart.setOption(optionVal);
    }
  }
}

/**
 * 根据当前主题色、模式等情景 计算最后生成的色阶
 */
export function generateColorMap(theme: string, colorPalette: Array<string>, mode: ModeType, brandColorIdx: number) {
  const isDarkMode = mode === 'dark';

  if (isDarkMode) {
    // eslint-disable-next-line no-use-before-define
    colorPalette.reverse().map((color) => {
      const [h, s, l] = Color.colorTransform(color, 'hex', 'hsl');
      return Color.colorTransform([h, Number(s) - 4, l], 'hsl', 'hex');
    });
    brandColorIdx = 5;
    colorPalette[0] = `${colorPalette[brandColorIdx]}20`;
  }

  const colorMap: KColorToken = {
    '--td-brand-color': colorPalette[brandColorIdx], // 主题色
    '--td-brand-color-1': colorPalette[0], // light
    '--td-brand-color-2': colorPalette[1], // focus
    '--td-brand-color-3': colorPalette[2], // disabled
    '--td-brand-color-4': colorPalette[3],
    '--td-brand-color-5': colorPalette[4],
    '--td-brand-color-6': colorPalette[5],
    '--td-brand-color-7': brandColorIdx > 0 ? colorPalette[brandColorIdx - 1] : theme, // hover
    '--td-brand-color-8': colorPalette[brandColorIdx], // 主题色
    '--td-brand-color-9': brandColorIdx > 8 ? theme : colorPalette[brandColorIdx + 1], // click
    '--td-brand-color-10': colorPalette[9],
  };
  return colorMap;
}

/**
 * 将生成的样式嵌入头部
 */
export function insertThemeStylesheet(theme: string, colorMap: KColorToken, mode: ModeType) {
  const isDarkMode = mode === 'dark';
  const root = !isDarkMode ? `:root[theme-color='${theme}']` : `:root[theme-color='${theme}'][theme-mode='dark']`;

  const styleSheet = document.createElement('style');
  styleSheet.innerText = `${root}{
    --td-brand-color: ${colorMap['--td-brand-color']};
    --td-brand-color-1: ${colorMap['--td-brand-color-1']};
    --td-brand-color-2: ${colorMap['--td-brand-color-2']};
    --td-brand-color-3: ${colorMap['--td-brand-color-3']};
    --td-brand-color-4: ${colorMap['--td-brand-color-4']};
    --td-brand-color-5: ${colorMap['--td-brand-color-5']};
    --td-brand-color-6: ${colorMap['--td-brand-color-6']};
    --td-brand-color-7: ${colorMap['--td-brand-color-7']};
    --td-brand-color-8: ${colorMap['--td-brand-color-8']};
    --td-brand-color-9: ${colorMap['--td-brand-color-9']};
    --td-brand-color-10: ${colorMap['--td-brand-color-10']};
  }`;

  document.head.appendChild(styleSheet);
}
