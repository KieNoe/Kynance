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

  const updateContainer = () => {
    selfChart.resize({
      width: chart.clientWidth,
      height: chart.clientHeight,
    })
  }

  try {
    selfChart = echarts.init(chart)

    window.addEventListener('resize', updateContainer, false)

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
    for (let i = 0; i < charts.length; i++) {
      const chartDom = charts[i].ref.value

      charts[i].ref = await useChart(chartDom, onCleanUp)

      charts[i].ref.setOption({
        ...chartThemeOption.value,
        ...chartColorOption.value,
        ...options[i],
      })
    }

    changeChartsTheme(charts)

    const stopColorWatch = watch(
      () => settingStore.themeColor,
      () => {
        changeChartsTheme(charts)
      },
    )

    const stopThemeWatch = watch(
      () => settingStore.mode,
      () => {
        for (const chart of charts) {
          chart.ref.setOption(chartThemeOption.value)
        }
      },
    )

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
