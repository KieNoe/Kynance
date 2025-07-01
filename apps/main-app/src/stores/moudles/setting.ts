import { keys } from 'lodash'
import { defineStore } from 'pinia'
import { Color } from 'tvision-color'
import { computed, reactive, toRefs } from 'vue'
import { KColorSeries } from '@kynance/types'
import { ModeType } from '@kynance/types'

import { DARK_CHART_COLORS, LIGHT_CHART_COLORS } from '@/constants'
import STYLE_CONFIG from '@/constants'
import { store } from '@/stores'
import { generateColorMap, insertThemeStylesheet } from '@/infrastructure/utils'

interface IState {
  [key: string]: any
  showSettingPanel: boolean
  colorList: KColorSeries
  chartColors: typeof LIGHT_CHART_COLORS
}

const state: IState = {
  ...STYLE_CONFIG,
  showSettingPanel: false,
  colorList: {} as KColorSeries,
  chartColors: LIGHT_CHART_COLORS,
}

export type KState = typeof state
export type KStateKey = keyof typeof state

export const useSettingStore = defineStore(
  'setting',
  () => {
    const localState = reactive<IState>({ ...state })

    const showSidebar = computed(() => localState.layout !== 'top')
    const showSidebarLogo = computed(() => localState.layout === 'side')
    const showHeaderLogo = computed(() => localState.layout !== 'side')
    const displayMode = computed<ModeType>(() => {
      if (localState.mode === 'auto') {
        const media = window.matchMedia('(prefers-color-scheme:dark)')
        if (media.matches) {
          return 'dark'
        }
        return 'light'
      }
      return localState.mode as ModeType
    })
    const displaySideMode = computed<ModeType>(() => localState.sideMode as ModeType)

    const changeMode = async (mode: ModeType | 'auto') => {
      let theme = mode

      if (mode === 'auto') {
        theme = getMediaColor()
      }
      const isDarkMode = theme === 'dark'

      document.documentElement.setAttribute('theme-mode', isDarkMode ? 'dark' : '')

      localState.chartColors = isDarkMode ? DARK_CHART_COLORS : LIGHT_CHART_COLORS
    }

    const changeSideMode = async (mode: ModeType) => {
      const isDarkMode = mode === 'dark'
      document.documentElement.setAttribute('side-mode', isDarkMode ? 'dark' : '')
    }

    const getMediaColor = () => {
      const media = window.matchMedia('(prefers-color-scheme:dark)')
      return media.matches ? 'dark' : 'light'
    }

    const changeBrandTheme = (brandTheme: string) => {
      const mode = displayMode.value
      const colorKey = `${brandTheme}[${mode}]`
      let colorMap = localState.colorList[colorKey]

      if (colorMap === undefined) {
        const [{ colors: newPalette, primary: brandColorIndex }] = Color.getColorGradations({
          colors: [brandTheme],
          step: 10,
          remainInput: false,
        })
        colorMap = generateColorMap(brandTheme, newPalette, mode, brandColorIndex)
        localState.colorList[colorKey] = colorMap
      }

      insertThemeStylesheet(brandTheme, colorMap, mode)
      document.documentElement.setAttribute('theme-color', brandTheme)
    }

    const updateConfig = (payload: Partial<KState>) => {
      for (const key in payload) {
        if (payload[key as KStateKey] !== undefined) {
          localState[key as KStateKey] = payload[key as KStateKey]
        }
        if (key === 'mode') {
          changeMode(payload[key] as ModeType)
        }
        if (key === 'sideMode') {
          changeSideMode(payload[key] as ModeType)
        }
        if (key === 'brandTheme') {
          changeBrandTheme(payload[key] as string)
        }
      }
    }

    return {
      ...toRefs(localState),
      showSidebar,
      showSidebarLogo,
      showHeaderLogo,
      displayMode,
      displaySideMode,
      changeMode,
      changeSideMode,
      getMediaColor,
      changeBrandTheme,
      updateConfig,
    }
  },
  {
    persist: {
      paths: [...keys(STYLE_CONFIG), 'colorList', 'chartColors'],
    } as any,
  },
)

export function getSettingStore() {
  return useSettingStore(store)
}
