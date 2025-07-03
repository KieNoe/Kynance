// stores/settingsStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { KThemeColor } from '@/constants'

export const useSettingStore = defineStore('settings', () => {
  // 状态
  const mode = ref<'dark' | 'light'>('light')
  const themeColor = ref<string>('#0052D9')
  const showSettingPanel = ref<boolean>(false)
  const showBreadcrumb = ref<boolean>(false)
  const showFooter = ref<boolean>(true)

  // 持久化 key
  const STORAGE_KEY = 'app_settings'

  // 从本地存储加载设置
  const loadSettings = () => {
    const savedSettings = localStorage.getItem(STORAGE_KEY)
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      mode.value = settings.mode || 'light'
      themeColor.value = settings.themeColor || '#0052D9'
      showBreadcrumb.value = settings.showBreadcrumb === true
      showFooter.value = settings.showFooter === true
    }
    loadMode()
  }

  // 保存设置到本地存储
  const saveSettings = () => {
    const settings = {
      mode: mode.value,
      themeColor: themeColor.value,
      showBreadcrumb: showBreadcrumb.value,
      showFooter: showFooter.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }

  // 切换白天/黑夜模式
  const toggleMode = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    loadMode()
    saveSettings()
  }

  const toggleBreadcrumb = () => {
    showBreadcrumb.value = !showBreadcrumb.value
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
    saveSettings()
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
    showBreadcrumb,
    showFooter,
    toggleSettingPanel,
    toggleMode,
    setThemeColor,
    toggleBreadcrumb,
    toggleFooter,
    loadMode,
    loadSettings,
    saveSettings,
  }
})
