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
          <t-radio-group v-model="settingStore.themeColor" @change="settingStore.saveSettings">
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
          <t-form-item :label="t('layout.setting.element.showBreadcrumb')" name="showBreadcrumb">
            <t-switch v-model="settingStore.showBreadcrumb" @change="settingStore.saveSettings" />
          </t-form-item>
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
  bottom: 200px;
  right: 0;
  height: 40px;
  width: 40px;
  border-radius: 20px 0 0 20px;
  transition: all 0.3s;

  .t-icon {
    margin-left: 8px;
  }

  .tdesign-setting-text {
    font-size: 12px;
    display: none;
  }

  &:hover {
    width: 96px;

    .tdesign-setting-text {
      display: inline-block;
    }
  }
}

.setting-layout-color-group {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50% !important;
  padding: 6px !important;
  border: 2px solid transparent !important;

  > .t-radio-button__label {
    display: inline-flex;
  }
}

.tdesign-setting-close {
  position: fixed;
  bottom: 200px;
  right: 300px;
}

.setting-group-title {
  font-size: 14px;
  line-height: 22px;
  margin: 32px 0 24px;
  text-align: left;
  font-family: 'PingFang SC', var(--td-font-family);
  font-style: normal;
  font-weight: 500;
  color: var(--td-text-color-primary);
}

.setting-link {
  cursor: pointer;
  color: var(--td-brand-color);
  margin-bottom: 8px;
}

.setting-info {
  position: absolute;
  padding: 24px;
  bottom: 0;
  left: 0;
  line-height: 20px;
  font-size: 12px;
  text-align: center;
  color: var(--td-text-color-placeholder);
  width: 100%;
  background: var(--td-bg-color-container);
}

.setting-drawer-container {
  .setting-container {
    padding-bottom: 100px;
  }

  .t-radio-group.t-size-m {
    min-height: 32px;
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
    margin-bottom: 16px;

    .t-radio-button {
      display: inline-flex;
      max-height: 78px;
      padding: 8px;
      border-radius: var(--td-radius-default);
      border: 2px solid var(--td-component-border);

      > .t-radio-button__label {
        display: inline-flex;
      }
    }

    .t-is-checked {
      border: 2px solid var(--td-brand-color) !important;
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
    min-width: 310px !important;
    color: var(--td-text-color-secondary);
  }
}

.setting-color-theme {
  .setting-layout-drawer {
    .t-radio-button {
      height: 32px;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
