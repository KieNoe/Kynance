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
  // eslint-disable-next-line
  let selfChart: echarts.ECharts
  const updateContainer = () => {
    selfChart.resize({
      width: chart.clientWidth,
      height: chart.clientHeight,
    })
  }
  selfChart = echarts.init(chart)

  window.addEventListener('resize', updateContainer, false)

  onCleanUp(() => {
    window.removeEventListener('resize', updateContainer)
    selfChart.dispose()
  })

  return selfChart
}

export const initCharts = async (charts, options, onCleanUp) => {
  for (let i = 0; i < charts.length; i++) {
    charts[i].ref = await useChart(charts[i].ref.value[0], onCleanUp)
    charts[i].ref.setOption({
      ...chartThemeOption.value,
      ...chartColorOption.value,
      ...options[i],
    })
  }
  changeChartsTheme(charts as any)
  const stopColorWatch = watch(
    () => settingStore.themeColor,
    () => {
      changeChartsTheme(charts as any)
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
}
