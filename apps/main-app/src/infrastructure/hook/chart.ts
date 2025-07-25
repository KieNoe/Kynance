import {
  getChartThemeOption,
  getChartColorOption,
  getChartListColor,
  changeChartsTheme,
} from '@kynance/chart-core'
import * as echarts from 'echarts'
import { computed, watch } from 'vue'

import { useSettingStore } from '@/stores'
import { LIGHT_CHART_COLORS, DARK_CHART_COLORS } from '@/constants'

const settingStore = useSettingStore()
const chartThemeOption = computed(() => {
  return getChartThemeOption(settingStore.mode === 'dark' ? DARK_CHART_COLORS : LIGHT_CHART_COLORS)
})
const chartColorOption = computed(() => {
  return getChartColorOption(getChartListColor())
})
const useChart = (domId: string, onCleanUp): echarts.ECharts => {
  let chartContainer: HTMLCanvasElement
  // eslint-disable-next-line
  let selfChart: echarts.ECharts
  const updateContainer = () => {
    selfChart.resize({
      width: chartContainer.clientWidth,
      height: chartContainer.clientHeight,
    })
  }
  if (!chartContainer) {
    chartContainer = document.getElementById(domId) as HTMLCanvasElement
  }
  selfChart = echarts.init(chartContainer)

  window.addEventListener('resize', updateContainer, false)

  onCleanUp(() => {
    window.removeEventListener('resize', updateContainer)
    selfChart.dispose()
  })

  return selfChart
}

export const initCharts = async (
  domIds: string | string[],
  charts: echarts.ECharts | echarts.ECharts[],
  options: any | any[],
  onCleanUp,
) => {
  for (let i = 0; i < domIds.length; i++) {
    charts[i] = await useChart(domIds[i], onCleanUp)
    charts[i].setOption({
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
      for (const chart of charts as echarts.ECharts[]) {
        chart.setOption(chartThemeOption.value)
      }
    },
  )
  onCleanUp(() => {
    stopColorWatch()
    stopThemeWatch()
  })
  return charts
}
