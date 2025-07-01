import * as echarts from 'echarts/core'
import trim from 'lodash/trim'
import { Color } from 'tvision-color'
import { KColorToken } from '@kynance/types'
import { ModeType } from '@kynance/types'

/**
 * 依据主题类型获取颜色
 *
 * @export
 * @param {string} theme
 * @returns {}
 */
export function getColorFromTheme(): Array<string> {
  const theme = trim(
    getComputedStyle(document.documentElement).getPropertyValue('--kn-brand-color'),
  )
  const themeColorList = Color.getRandomPalette({
    color: theme,
    colorGamut: 'bright',
    number: 8,
  })

  return themeColorList
}

/** 图表颜色 */
export function getChartListColor(): Array<string> {
  const res = getColorFromTheme()

  return res
}

/**
 * 更改图表主题颜色
 *
 * @export
 * @param {Array<string>} chartsList
 * @param {string} theme
 */
export function changeChartsTheme(chartsList: echarts.EChartsType[]): void {
  if (chartsList && chartsList.length) {
    const chartChangeColor = getChartListColor()

    for (let index = 0; index < chartsList.length; index++) {
      const elementChart = chartsList[index]

      if (elementChart) {
        const optionVal = elementChart.getOption()

        // 更改主题颜色
        optionVal.color = chartChangeColor

        elementChart.setOption(optionVal, true)
      }
    }
  }
}

/**
 * 根据当前主题色、模式等情景 计算最后生成的色阶
 */
export function generateColorMap(
  theme: string,
  colorPalette: Array<string>,
  mode: ModeType,
  brandColorIdx: number,
) {
  const isDarkMode = mode === 'dark'

  if (isDarkMode) {
    // eslint-disable-next-line no-use-before-define
    colorPalette.reverse().map((color) => {
      const [h, s, l] = Color.colorTransform(color, 'hex', 'hsl')
      return Color.colorTransform([h, Number(s) - 4, l], 'hsl', 'hex')
    })
    brandColorIdx = 5
    colorPalette[0] = `${colorPalette[brandColorIdx]}20`
  }

  const colorMap: KColorToken = {
    '--kn-brand-color': colorPalette[brandColorIdx], // 主题色
    '--kn-brand-color-1': colorPalette[0], // light
    '--kn-brand-color-2': colorPalette[1], // focus
    '--kn-brand-color-3': colorPalette[2], // disabled
    '--kn-brand-color-4': colorPalette[3],
    '--kn-brand-color-5': colorPalette[4],
    '--kn-brand-color-6': colorPalette[5],
    '--kn-brand-color-7': brandColorIdx > 0 ? colorPalette[brandColorIdx - 1] : theme, // hover
    '--kn-brand-color-8': colorPalette[brandColorIdx], // 主题色
    '--kn-brand-color-9': brandColorIdx > 8 ? theme : colorPalette[brandColorIdx + 1], // click
    '--kn-brand-color-10': colorPalette[9],
  }
  return colorMap
}

/**
 * 将生成的样式嵌入头部
 */
export function insertThemeStylesheet(theme: string, colorMap: KColorToken, mode: ModeType) {
  const isDarkMode = mode === 'dark'
  const root = !isDarkMode
    ? `:root[theme-color='${theme}']`
    : `:root[theme-color='${theme}'][theme-mode='dark']`

  const styleSheet = document.createElement('style')
  styleSheet.type = 'text/css'
  styleSheet.innerText = `${root}{
    --kn-brand-color: ${colorMap['--kn-brand-color']};
    --kn-brand-color-1: ${colorMap['--kn-brand-color-1']};
    --kn-brand-color-2: ${colorMap['--kn-brand-color-2']};
    --kn-brand-color-3: ${colorMap['--kn-brand-color-3']};
    --kn-brand-color-4: ${colorMap['--kn-brand-color-4']};
    --kn-brand-color-5: ${colorMap['--kn-brand-color-5']};
    --kn-brand-color-6: ${colorMap['--kn-brand-color-6']};
    --kn-brand-color-7: ${colorMap['--kn-brand-color-7']};
    --kn-brand-color-8: ${colorMap['--kn-brand-color-8']};
    --kn-brand-color-9: ${colorMap['--kn-brand-color-9']};
    --kn-brand-color-10: ${colorMap['--kn-brand-color-10']};
  }`

  document.head.appendChild(styleSheet)
}
