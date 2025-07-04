<template>
  <t-layout class="out-layout">
    <t-header>
      <t-head-menu value="item1" height="120px">
        <template #logo>
          <img
            width="136"
            class="logo"
            src="https://www.tencent.com/img/index/menu_logo_hover.png"
            alt="logo"
          />
        </template>
        <template #operations>
          <t-tooltip placement="bottom" :content="t('layout.header.code')" class="header-code-icon">
            <t-button theme="default" shape="square" variant="text" @click="navToGitHub">
              <t-icon name="logo-github" size="1.3em" />
            </t-button>
          </t-tooltip>
          <t-tooltip placement="bottom" :content="t('layout.header.help')" class="header-code-icon">
            <t-button theme="default" shape="square" variant="text" @click="navToHelper">
              <t-icon name="help-circle" size="1.3em" />
            </t-button>
          </t-tooltip>
          <t-tooltip
            placement="bottom"
            :content="t('layout.setting.language')"
            class="header-code-icon"
          >
            <t-dropdown trigger="click">
              <t-button theme="default" shape="square" variant="text">
                <t-icon name="translate" size="1.3em" />
              </t-button>
              <t-dropdown-menu>
                <t-dropdown-item
                  v-for="(lang, index) in langList"
                  :key="index"
                  :value="lang.value"
                  @click="(options) => changeLang(options.value as string)"
                  >{{ lang.content }}</t-dropdown-item
                ></t-dropdown-menu
              >
            </t-dropdown>
          </t-tooltip>
          <t-dropdown :min-column-width="120" trigger="click">
            <template #dropdown>
              <t-dropdown-menu>
                <t-dropdown-item class="operations-dropdown-container-item" @click="handleNav">
                  <t-icon name="user-circle" size="1.2em" class="header-avatar-icon" />{{
                    t('layout.header.user')
                  }}
                </t-dropdown-item>
                <t-dropdown-item class="operations-dropdown-container-item" @click="handleLogout">
                  <t-icon name="poweroff" size="1.2em" class="header-signout-icon" />{{
                    t('layout.header.signOut')
                  }}
                </t-dropdown-item>
              </t-dropdown-menu>
            </template>
            <t-button class="header-user-btn" theme="default" variant="text">
              <template #icon>
                <t-icon class="header-user-avatar" name="user-circle" size="1.3em" />
              </template>
              <div class="header-user-account" style="font-size: 1.2em">
                {{ userStore.user.name }}
              </div>
              <template #suffix><t-icon name="chevron-down" size="1.2em" /></template>
            </t-button>
          </t-dropdown>
          <t-tooltip
            placement="bottom"
            :content="t('layout.header.setting')"
            class="header-code-icon"
          >
            <t-button
              theme="default"
              shape="square"
              variant="text"
              @click="settingStore.toggleSettingPanel"
            >
              <t-icon name="setting" size="1.3em" />
            </t-button>
          </t-tooltip>
        </template>
      </t-head-menu>
    </t-header>
    <t-layout>
      <t-aside style="border-top: 1px solid var(--component-border)">
        <LSideNav style="height: 100%" />
      </t-aside>
      <t-layout>
        <t-content>
          <div>
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </t-content>
        <t-footer v-if="settingStore.showFooter"
          >Copyright @ {{ new Date().getFullYear() }} KieNoe. All Rights Reserved</t-footer
        >
      </t-layout>
    </t-layout>
    <setting />
  </t-layout>
</template>
<script lang="ts" setup>
import { langList, t } from '@/infrastructure/locales'
import { useLocale } from '@/infrastructure/locales/useLocale'
import { useSettingStore } from '@/stores'
import { useUserStore } from '@/stores'

import LSideNav from './components/SideNav.vue'
import setting from './setting.vue'

const settingStore = useSettingStore()
const userStore = useUserStore()
const { changeLocale } = useLocale()

const changeLang = (lang) => {
  changeLocale(lang)
}
const navToGitHub = () => {
  window.open('https://github.com/KieNoe/kynance', '_blank')
}
const navToHelper = () => {
  window.open('https://github.com/KieNoe/kynance', '_blank')
}
const handleLogout = () => {}
const handleNav = () => {}
</script>
<style scoped>
.out-layout {
  height: 100vh;
}
.fade-leave-active,
.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.header-avatar-icon,
.header-signout-icon {
  margin-right: 0.4em;
}
.header-code-icon {
  margin-right: 0.4em;
  margin-left: 0.4em;
}
</style>
