<template>
  <div class="login-wrapper">
    <div class="login-container">
      <transition name="fade" mode="out-in">
        <div class="title-container" v-if="type === 'login'">
          <h1 class="title margin-no">{{ t('pages.login.loginTitle') }}</h1>
          <h1 class="title">Kynance Platform</h1>
          <div class="sub-title">
            <p class="tip">
              {{ t('pages.login.noAccount') }}
            </p>
            <p class="tip" @click="switchType('register')">
              {{ t('pages.login.createAccount') }}
            </p>
          </div>
        </div>
        <div class="title-container" v-else>
          <h1 class="title margin-no">{{ t('pages.login.loginTitle') }}</h1>
          <h1 class="title">Kynance Platform</h1>
          <div class="sub-title">
            <p class="tip">
              {{ type == 'register' ? t('pages.login.existAccount') : t('pages.login.noAccount') }}
            </p>
            <p class="tip" @click="switchType(type == 'register' ? 'login' : 'register')">
              {{ type == 'register' ? t('pages.login.signIn') : t('pages.login.createAccount') }}
            </p>
          </div>
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <login v-if="type === 'login'" />
        <register v-else @register-success="switchType('login')" />
      </transition>
    </div>
  </div>
  <img src="@/assets/assets-login-sideImage.png" alt="" class="side-image" />
</template>
<script setup lang="ts">
import { ref } from 'vue'

import { t } from '@/infrastructure/locales'

import Login from './components/Login.vue'
import Register from './components/Register.vue'

const type = ref('login')
const switchType = (val) => {
  type.value = val
}
</script>
<style scoped lang="less">
@import './index.less';
</style>
