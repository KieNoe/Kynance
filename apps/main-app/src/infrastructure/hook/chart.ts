import {
  changeChartsTheme,
  getChartColorOption,
  getChartListColor,
  getChartThemeOption,
} from '@kynance/chart-core'
import * as echarts from 'echarts'
import { computed, watch } from 'vue'

import { DARK_CHART_COLORS, LIGHT_CHART_COLORS } from '@/constants'
import { useSettingStore } from '@/stores'

const settingStore = useSettingStore()
const chartThemeOption = computed(() => {
  return getChartThemeOption(settingStore.mode === 'dark' ? DARK_CHART_COLORS : LIGHT_CHART_COLORS)
})
const chartColorOption = computed(() => {
  return getChartColorOption(getChartListColor())
})
const useChart = (chart, onCleanUp): echarts.ECharts => {
  let selfChart: echarts.ECharts

  // 窗口大小变化时的响应函数
  const updateContainer = () => {
    selfChart.resize({
      width: chart.clientWidth,
      height: chart.clientHeight,
    })
  }

  try {
    // 初始化ECharts实例
    selfChart = echarts.init(chart)

    // 添加窗口大小监听
    window.addEventListener('resize', updateContainer, false)

    // 清理函数
    onCleanUp(() => {
      window.removeEventListener('resize', updateContainer)
      selfChart.dispose()
    })

    return selfChart
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const initCharts = async (charts, options, onCleanUp) => {
  try {
    // 初始化每个图表
    for (let i = 0; i < charts.length; i++) {
      // 获取DOM元素（Vue3 ref需要.value[0]）
      const chartDom = charts[i].ref.value

      // 使用useChart初始化
      charts[i].ref = await useChart(chartDom, onCleanUp)

      // 设置图表选项
      charts[i].ref.setOption({
        ...chartThemeOption.value,
        ...chartColorOption.value,
        ...options[i],
      })
    }

    // 应用主题
    changeChartsTheme(charts)

    // 设置颜色变化监听
    const stopColorWatch = watch(
      () => settingStore.themeColor,
      () => {
        changeChartsTheme(charts)
      },
    )

    // 设置模式变化监听
    const stopThemeWatch = watch(
      () => settingStore.mode,
      () => {
        for (const chart of charts) {
          chart.ref.setOption(chartThemeOption.value)
        }
      },
    )

    // 清理函数
    onCleanUp(() => {
      stopColorWatch()
      stopThemeWatch()
    })

    return charts
  } catch (error) {
    console.error(error)
    throw error
  }
}
