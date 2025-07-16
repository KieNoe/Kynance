<template>
  <t-form
    ref="form"
    :class="['item-container', `login-password`]"
    :data="formData"
    :rules="{
      phone: [{ required: true, message: t('pages.login.required.phone'), type: 'error' as const }],
      account: [
        { required: true, message: t('pages.login.required.account'), type: 'error' as const },
      ],
      password: [
        { required: true, message: t('pages.login.required.password'), type: 'error' as const },
      ],
      verifyCode: [
        { required: true, message: t('pages.login.required.verification'), type: 'error' as const },
      ],
    }"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="account">
      <t-input
        v-model="formData.account"
        size="large"
        :placeholder="`${t('pages.login.input.account')}：admin`"
      >
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="password">
      <t-input
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        :placeholder="`${t('pages.login.input.password')}：admin`"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <div class="check-container remember-pwd">
      <t-checkbox>{{ t('pages.login.remember') }}</t-checkbox>
      <span class="tip" @click="onClick">{{ t('pages.login.forget') }}</span>
      <t-dialog
        :visible="visible"
        header="(っ °Д °;)っ"
        :on-close="onClose"
        :on-overlay-click="onClose"
        :on-confirm="onClose"
        :on-esc-keydown="onClose"
        :on-cancel="onClose"
      >
        <p>放过KieNoe吧，KieNoe 已经累亖了</p>
      </t-dialog>
    </div>

    <t-form-item class="btn-container">
      <t-button block size="large" type="submit"> {{ t('pages.login.signIn') }} </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'

import { t } from '@/infrastructure/locales'
import { useUserStore } from '@/stores'
import router from '@/router'

const userStore = useUserStore()

const INITIAL_DATA = {
  phone: '',
  account: 'admin',
  password: 'admin',
  verifyCode: '',
  checked: false,
}

const form = ref()
const formData = ref({ ...INITIAL_DATA })
const showPsw = ref(false)
const visible = ref(false)
const onClick = () => {
  visible.value = true
}
const onClose = () => {
  visible.value = false
  formData.value.account = 'admin'
  formData.value.password = 'admin'
}

const onSubmit = async (ctx) => {
  if (ctx.validateResult === true) {
    try {
      await userStore.login({
        token: '123456',
        permission: 1,
        name: 'admin',
        id: '927115',
        avatar: '',
        password: 'admin',
        email: 'Account@qq.com',
        createdData: '2025-01-01',
        description: 'git push origin life --force',
        usingTime: 10,
        activeTime: 10,
        totalMoney: 10,
        heldStocks: ['A', 'B', 'C'],
        telephone: 13923734567,
        yield: 0.0047,
        ...formData.value,
      })

      MessagePlugin.success('登录成功')
      router.push('/dashboard/base')
    } catch (e) {
      console.log(e)
      MessagePlugin.error(e.message)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
