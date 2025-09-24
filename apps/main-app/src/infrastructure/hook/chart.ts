import * as echarts from 'echarts'
import { computed, watch } from 'vue'
import type { IChartService } from '@kynance/types'
import { TYPES } from '@kynance/types'

import { DARK_CHART_COLORS, LIGHT_CHART_COLORS } from '@/constants'
import { container } from '@/infrastructure/container/container'
import { useSettingStore } from '@/stores'

const settingStore = useSettingStore()

const chartService: IChartService = container.get<IChartService>(TYPES.IChartService)

const chartThemeOption = computed(() => {
  return chartService.getChartThemeOption(
    settingStore.mode === 'dark' ? DARK_CHART_COLORS : LIGHT_CHART_COLORS,
  )
})
const chartColorOption = computed(() => {
  return chartService.getChartColorOption(chartService.getChartListColor())
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

      const chartOptions = {
        ...(chartThemeOption.value as any),
        ...(chartColorOption.value as any),
        ...options[i],
      }

      charts[i].ref.setOption(chartOptions)
    }

    chartService.changeChartsTheme(charts)

    const stopColorWatch = watch(
      () => settingStore.themeColor,
      () => {
        chartService.changeChartsTheme(charts)
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
