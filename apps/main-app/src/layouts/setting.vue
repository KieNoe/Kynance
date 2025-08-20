<template>
  <div>
    <t-drawer
      v-model:visible="settingStore.showSettingPanel"
      class="setting-drawer-container"
      :header="t('layout.setting.title')"
      :footer="false"
      :close-btn="true"
      size="408px"
    >
      <div class="setting-container">
        <t-form ref="form" label-align="left">
          <div class="setting-group-title">{{ t('layout.setting.theme.color') }}</div>
          <t-radio-group v-model="settingStore.themeColor" @change="settingStore.setThemeColor">
            <div
              v-for="(item, index) in DEFAULT_COLOR_OPTIONS"
              :key="index"
              class="setting-layout-drawer"
            >
              <t-radio-button :key="index" :value="item" class="setting-layout-color-group">
                <color-container :value="item" />
              </t-radio-button>
            </div>
            <div class="setting-layout-drawer">
              <t-popup
                destroy-on-close
                expand-animation
                placement="bottom-right"
                trigger="click"
                :overlay-style="{ padding: 0 }"
              >
                <template #content>
                  <t-color-picker-panel
                    :on-change="changeColor"
                    :color-modes="['monochrome']"
                    format="HEX"
                    :swatch-colors="[]"
                  />
                </template>
                <t-radio-button
                  :value="dynamicColor"
                  class="setting-layout-color-group dynamic-color-btn"
                >
                  <color-container :value="dynamicColor" />
                </t-radio-button>
              </t-popup>
            </div>
          </t-radio-group>
          <div class="setting-group-title">{{ t('layout.setting.theme.mode') }}</div>
          <t-radio-group v-model="settingStore.mode" @change="settingStore.saveSettings">
            <div v-for="(item, index) in MODE_OPTIONS" :key="index" class="setting-layout-drawer">
              <t-radio-button :key="index" :value="item.type">
                <component :is="getModeIcon(item.type)" />
              </t-radio-button>
              <p :style="{ textAlign: 'center', marginTop: '8px' }">{{ item.text }}</p>
            </div>
          </t-radio-group>
          <div class="setting-group-title">{{ t('layout.setting.LayoutConfig') }}</div>
          <t-form-item :label="t('layout.setting.element.showFooter')" name="showFooter">
            <t-switch v-model="settingStore.showFooter" @change="settingStore.saveSettings" />
          </t-form-item>
        </t-form>
      </div>
    </t-drawer>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useSettingStore } from '@/stores'
import { t } from '@/infrastructure/locales'
import { DEFAULT_COLOR_OPTIONS } from '@/constants'
import ColorContainer from '@/components/color/index.vue'
import SettingAutoIcon from '@/assets/assets-setting-auto.svg'
import SettingDarkIcon from '@/assets/assets-setting-dark.svg'
import SettingLightIcon from '@/assets/assets-setting-light.svg'

const settingStore = useSettingStore()

const MODE_OPTIONS = [
  { type: 'light', text: t('layout.setting.theme.options.light') },
  { type: 'dark', text: t('layout.setting.theme.options.dark') },
  { type: 'auto', text: t('layout.setting.theme.options.auto') },
]

const dynamicColor = computed(() => {
  const isDynamic = DEFAULT_COLOR_OPTIONS.indexOf(settingStore.themeColor) === -1
  return isDynamic ? settingStore.themeColor : ''
})

const changeColor = (hex) => {
  settingStore.themeColor = hex
}

const getModeIcon = (mode) => {
  if (mode === 'light') {
    return SettingLightIcon
  }
  if (mode === 'dark') {
    return SettingDarkIcon
  }
  return SettingAutoIcon
}
</script>

<style lang="less">
.tdesign-setting {
  z-index: 100;
  position: fixed;
  bottom: 12.5rem; // 使用rem单位
  right: 0;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 1.25rem 0 0 1.25rem;
  transition: all 0.3s;

  .t-icon {
    margin-left: 0.5rem;
  }

  .tdesign-setting-text {
    font-size: 0.75rem;
    display: none;
  }

  &:hover {
    width: 6rem;

    .tdesign-setting-text {
      display: inline-block;
    }
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    height: 2rem;
    width: 2rem;

    &:hover {
      width: 5rem;
    }
  }
}

.setting-layout-color-group {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50% !important;
  padding: 0.375rem !important;
  border: 0.125rem solid transparent !important;

  > .t-radio-button__label {
    display: inline-flex;
  }
}

.tdesign-setting-close {
  position: fixed;
  bottom: 12.5rem;
  right: 18.75rem;

  @media (max-width: 1200px) {
    right: 15rem;
  }

  @media (max-width: 992px) {
    right: 10rem;
  }

  @media (max-width: 768px) {
    right: 1rem;
    bottom: 1rem;
  }
}

.setting-group-title {
  font-size: 0.875rem;
  line-height: 1.375rem;
  margin: 2rem 0 1.5rem;
  text-align: left;
  font-family: 'PingFang SC', var(--td-font-family);
  font-style: normal;
  font-weight: 500;
  color: var(--td-text-color-primary);

  @media (max-width: 768px) {
    margin: 1.5rem 0 1rem;
    font-size: 0.8125rem;
  }
}

.setting-link {
  cursor: pointer;
  color: var(--td-brand-color);
  margin-bottom: 0.5rem;
}

.setting-info {
  position: absolute;
  padding: 1.5rem;
  bottom: 0;
  left: 0;
  line-height: 1.25rem;
  font-size: 0.75rem;
  text-align: center;
  color: var(--td-text-color-placeholder);
  width: 100%;
  background: var(--td-bg-color-container);

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.6875rem;
  }
}

.setting-drawer-container {
  .setting-container {
    padding-bottom: 6.25rem;

    @media (max-width: 768px) {
      padding-bottom: 4rem;
    }
  }

  .t-radio-group.t-size-m {
    min-height: 2rem;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    &.side-mode-radio {
      justify-content: end;
    }
  }

  .t-radio-group.t-size-m .t-radio-button {
    height: auto;
  }

  .setting-layout-drawer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;

    .t-radio-button {
      display: inline-flex;
      max-height: 4.875rem;
      padding: 0.5rem;
      border-radius: var(--td-radius-default);
      border: 0.125rem solid var(--td-component-border);

      > .t-radio-button__label {
        display: inline-flex;
      }

      @media (max-width: 768px) {
        max-height: 3.5rem;
        padding: 0.375rem;
      }
    }

    .t-is-checked {
      border: 0.125rem solid var(--td-brand-color) !important;
    }

    .t-form__controls-content {
      justify-content: end;
    }
  }

  .t-form__controls-content {
    justify-content: end;
  }
}

.setting-route-theme {
  .t-form__label {
    min-width: 19.375rem !important;
    color: var(--td-text-color-secondary);

    @media (max-width: 768px) {
      min-width: 100% !important;
    }
  }
}

.setting-color-theme {
  .setting-layout-drawer {
    .t-radio-button {
      height: 2rem;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

@media (max-width: 480px) {
  .tdesign-setting,
  .tdesign-setting-close {
    display: none; // 在非常小的屏幕上隐藏设置按钮
  }
}
</style>
