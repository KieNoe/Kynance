<template>
  <t-header>
    <t-head-menu value="item1" height="120px">
      <template #logo>
        <img
          width="136"
          class="logo"
          src="@/assets/assets-full-logo.png"
          alt="logo"
          @click="navToHome"
        />
      </template>
      <template #operations>
        <notice />
        <t-tooltip placement="bottom" :content="t('layout.header.code')" class="header-code-icon">
          <t-button theme="default" shape="square" variant="text" @click="navToGitHub">
            <LogoGithubIcon size="1.3em" />
          </t-button>
        </t-tooltip>
        <t-tooltip placement="bottom" :content="t('layout.header.help')" class="header-code-icon">
          <t-button theme="default" shape="square" variant="text" @click="navToHelper">
            <HelpCircleIcon size="1.3em" />
          </t-button>
        </t-tooltip>
        <t-tooltip
          placement="bottom"
          :content="t('layout.setting.language')"
          class="header-code-icon"
        >
          <t-dropdown trigger="click">
            <t-button theme="default" shape="square" variant="text">
              <TranslateIcon size="1.3em" />
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
                <UserCircleIcon size="1.2em" class="header-avatar-icon" />{{
                  t('layout.header.user')
                }}
              </t-dropdown-item>
              <t-dropdown-item class="operations-dropdown-container-item" @click="handleLogout">
                <PoweroffIcon size="1.2em" class="header-signout-icon" />{{
                  t('layout.header.signOut')
                }}
              </t-dropdown-item>
            </t-dropdown-menu>
          </template>
          <t-button class="header-user-btn" theme="default" variant="text">
            <template #icon>
              <UserCircleIcon class="header-user-avatar" size="1.3em" />
            </template>
            <div class="header-user-account" style="font-size: 1.2em">
              {{ userStore.user.name }}
            </div>
            <template #suffix><ChevronDownIcon size="1.2em" /></template>
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
            <SettingIcon size="1.3em" />
          </t-button>
        </t-tooltip>
      </template>
    </t-head-menu>
  </t-header>
</template>
<script lang="ts" setup>
import { MessagePlugin } from 'tdesign-vue-next'
import {
  ChevronDownIcon,
  HelpCircleIcon,
  LogoGithubIcon,
  PoweroffIcon,
  SettingIcon,
  TranslateIcon,
  UserCircleIcon,
} from 'tdesign-icons-vue-next'

import { langList, t } from '@/infrastructure/locales'
import { useLocale } from '@/infrastructure/locales/useLocale'
import { useSettingStore } from '@/stores'
import { useUserStore } from '@/stores'
import router from '@/router'

import Notice from './Notice.vue'

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
const navToHome = () => {
  router.push('/')
}
const handleLogout = async () => {
  await userStore.logout()
  MessagePlugin.success('退出成功')
}
const handleNav = () => {
  router.push('/user')
}
</script>
<style scoped>
.header-avatar-icon,
.header-signout-icon {
  margin-right: 0.4em;
}
.header-code-icon {
  margin-right: 0.4em;
  margin-left: 0.4em;
}
.logo {
  cursor: pointer;
}
</style>
