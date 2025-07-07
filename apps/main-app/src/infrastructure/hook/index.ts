import { getChartThemeOption, getChartColorOption } from '@kynance/chart-core'
import * as echarts from 'echarts'
import { computed, watch } from 'vue'

import { useSettingStore } from '@/stores'
import { LIGHT_CHART_COLORS, DARK_CHART_COLORS } from '@/constants'
import { getChartListColor, changeChartsTheme } from '@/infrastructure/utils'

const settingStore = useSettingStore()
const chartTheme = computed(() => {
  return settingStore.mode === 'dark' ? DARK_CHART_COLORS : LIGHT_CHART_COLORS
})
const chartThemeOption = computed(() => {
  return getChartThemeOption(chartTheme.value)
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
export const initChart = async (domId: string, chart: echarts.ECharts, option, onCleanUp) => {
  chart = await useChart(domId, onCleanUp)
  chart.setOption({
    ...chartThemeOption.value,
    ...chartColorOption.value,
    ...option,
  })
  const stopWatch = watch(
    () => settingStore.themeColor,
    () => {
      changeChartsTheme([chart] as any)
    },
  )
  onCleanUp(() => {
    stopWatch()
  })
}
