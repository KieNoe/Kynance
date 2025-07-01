import * as echarts from 'echarts/core'
import trim from 'lodash/trim'
import { Color } from 'tvision-color'
import { KColorToken } from '@kynance/types'
import { ModeType } from '@kynance/types'

/**
 * 从当前主题中获取颜色列表
 * 通过读取CSS变量'--td-brand-color'的值作为基础色，生成8种衍生色
 *
 * @export
 * @returns {Array<string>} 返回生成的颜色数组
 */
export function getColorFromTheme(): Array<string> {
  // 获取文档根元素的CSS变量'--td-brand-color'的值，并去除两端空格
  const theme = trim(
    getComputedStyle(document.documentElement).getPropertyValue('--td-brand-color'),
  )
  // 使用基础色生成8种明亮色调的随机配色方案
  const themeColorList = Color.getRandomPalette({
    color: theme, // 基础色
    colorGamut: 'bright', // 颜色范围：明亮
    number: 8, // 生成颜色数量
  })

  return themeColorList
}

/**
 * 获取图表颜色列表
 * 实际上是getColorFromTheme的别名，保持命名一致性
 *
 * @returns {Array<string>} 返回颜色数组
 */
export function getChartListColor(): Array<string> {
  const res = getColorFromTheme()
  return res
}

/**
 * 更改多个图表实例的主题颜色
 * 遍历图表实例数组，为每个图表应用新的颜色方案
 *
 * @export
 * @param {Array<echarts.EChartsType>} chartsList 图表实例数组
 */
export function changeChartsTheme(chartsList: echarts.EChartsType[]): void {
  // 检查图表数组是否存在且不为空
  if (chartsList && chartsList.length) {
    // 获取新的图表颜色列表
    const chartChangeColor = getChartListColor()

    // 遍历所有图表实例
    for (let index = 0; index < chartsList.length; index++) {
      const elementChart = chartsList[index]

      // 确保图表实例存在
      if (elementChart) {
        // 获取当前图表配置
        const optionVal = elementChart.getOption()

        // 更新颜色配置
        optionVal.color = chartChangeColor

        // 应用新配置到图表，true表示不合并选项
        elementChart.setOption(optionVal, true)
      }
    }
  }
}

/**
 * 根据主题色、模式和品牌色索引生成颜色映射
 * 处理暗黑模式下的颜色反转和调整
 *
 * @param {string} theme 主题名称
 * @param {Array<string>} colorPalette 颜色调色板
 * @param {ModeType} mode 当前模式（light/dark）
 * @param {number} brandColorIdx 品牌色在调色板中的索引
 * @returns {KColorToken} 返回生成的颜色映射对象
 */
export function generateColorMap(
  theme: string,
  colorPalette: Array<string>,
  mode: ModeType,
  brandColorIdx: number,
) {
  // 判断是否为暗黑模式
  const isDarkMode = mode === 'dark'

  if (isDarkMode) {
    // 暗黑模式下反转调色板并调整饱和度
    colorPalette.reverse().map((color) => {
      // 将颜色从HEX转换为HSL格式
      const [h, s, l] = Color.colorTransform(color, 'hex', 'hsl')
      // 降低饱和度后转回HEX
      return Color.colorTransform([h, Number(s) - 4, l], 'hsl', 'hex')
    })
    // 暗黑模式下调整品牌色索引
    brandColorIdx = 5
    // 设置第一个颜色为品牌色带透明度
    colorPalette[0] = `${colorPalette[brandColorIdx]}20`
  }

  // 构建颜色映射对象
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
  }
  return colorMap
}

/**
 * 将生成的主题样式插入到文档头部
 * 根据是否为暗黑模式创建不同的CSS选择器
 *
 * @param {string} theme 主题名称
 * @param {KColorToken} colorMap 颜色映射对象
 * @param {ModeType} mode 当前模式（light/dark）
 */
export function insertThemeStylesheet(theme: string, colorMap: KColorToken, mode: ModeType) {
  // 判断是否为暗黑模式
  const isDarkMode = mode === 'dark'
  // 构建CSS选择器
  const root = !isDarkMode
    ? `:root[theme-color='${theme}']` // 亮色模式选择器
    : `:root[theme-color='${theme}'][theme-mode='dark']` // 暗黑模式选择器

  // 创建style元素
  const styleSheet = document.createElement('style')
  styleSheet.type = 'text/css'
  // 设置样式内容，将所有颜色变量写入CSS
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
  }`

  // 将样式表插入文档头部
  document.head.appendChild(styleSheet)
}
