// stores/settingsStore.ts
import { generateColorMap, insertThemeStylesheet } from '@kynance/chart-core'
import { defineStore } from 'pinia'
import { Color } from 'tvision-color'
import { ref } from 'vue'

import { KThemeColor } from '@/constants'

export const useSettingStore = defineStore('settings', () => {
  // 状态
  const mode = ref<'dark' | 'light'>('light')
  const themeColor = ref<string>('#0052D9')
  const showSettingPanel = ref<boolean>(false)
  const showFooter = ref<boolean>(true)
  const colorList = ref<Record<string, Record<string, string>>>({})

  // 持久化 key
  const STORAGE_KEY = 'app_settings'

  // 从本地存储加载设置
  const loadSettings = () => {
    const savedSettings = localStorage.getItem(STORAGE_KEY)
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      mode.value = settings.mode || 'light'
      themeColor.value = settings.themeColor || '#0052D9'
      showFooter.value = settings.showFooter === true
      colorList.value = settings.colorList || {}
    }
    loadMode()
    setThemeColor(themeColor.value)
  }

  // 保存设置到本地存储
  const saveSettings = () => {
    const settings = {
      mode: mode.value,
      themeColor: themeColor.value,
      showFooter: showFooter.value,
      colorList: colorList.value,
    }
    loadMode()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }

  // 切换白天/黑夜模式
  const toggleMode = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    loadMode()
    saveSettings()
  }

  const toggleFooter = () => {
    showFooter.value = !showFooter.value
    saveSettings()
  }

  const loadMode = () => {
    if (mode.value === 'dark') {
      document.documentElement.setAttribute('theme-mode', 'dark')
    } else {
      document.documentElement.removeAttribute('theme-mode')
    }
  }

  // 设置主题颜色
  const setThemeColor = (color: KThemeColor) => {
    themeColor.value = color
    changeBrandTheme(color)
    saveSettings()
  }

  const changeBrandTheme = (themeColor: string) => {
    // 以主题色加显示模式作为键
    const colorKey = `${themeColor}[${mode.value}]`
    let colorMap = colorList[colorKey]
    // 如果不存在色阶，就需要计算
    if (colorMap === undefined) {
      const [{ colors: newPalette, primary: brandColorIndex }] = Color.getColorGradations({
        colors: [themeColor],
        step: 10,
        remainInput: false, // 是否保留输入 不保留会矫正不合适的主题色
      })
      colorMap = generateColorMap(themeColor, newPalette, mode.value, brandColorIndex)
      colorList[colorKey] = colorMap
    }
    // TODO 需要解决不停切换时有反复插入 style 的问题
    insertThemeStylesheet(themeColor, colorMap, mode.value)
    document.documentElement.setAttribute('theme-color', themeColor)
  }

  const toggleSettingPanel = () => {
    showSettingPanel.value = !showSettingPanel.value
  }

  // 初始化时加载设置
  loadSettings()

  return {
    mode,
    themeColor,
    showSettingPanel,
    showFooter,
    colorList,
    toggleSettingPanel,
    toggleMode,
    setThemeColor,
    toggleFooter,
    loadMode,
    loadSettings,
    saveSettings,
  }
})
