<template>
  <t-form
    ref="form"
    :class="['item-container', `register-phone`]"
    :data="formData"
    :rules="{
      phone: [{ required: true, message: '手机号必填', type: 'error' }],
      email: [
        { required: true, message: '邮箱必填', type: 'error' },
        { email: true, message: '请输入正确的邮箱', type: 'warning' },
      ],
      password: [{ required: true, message: '密码必填', type: 'error' }],
      verifyCode: [{ required: true, message: '验证码必填', type: 'error' }],
    }"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="email">
      <t-input v-model="formData.email" type="text" size="large" placeholder="请输入您的邮箱">
        <template #prefix-icon>
          <t-icon name="mail" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="password">
      <t-input
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        placeholder="请输入登录密码"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <template>
      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" placeholder="请输入验证码" />
        <t-button variant="outline" :disabled="countDown > 0" @click="handleCounter">
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <t-form-item class="check-container" name="checked">
      <t-checkbox v-model="formData.checked">我已阅读并同意 </t-checkbox>
      <span @click="serviceVisible = true">Kynance 服务协议</span> 和
      <span @click="privacyVisible = true">Kynance 隐私声明</span>
      <t-dialog
        :visible="serviceVisible"
        header="服务协议"
        :on-close="onClose"
        :on-overlay-click="onClose"
        :on-confirm="onClose"
        :on-esc-keydown="onClose"
        :on-cancel="onClose"
        top="0"
        width="60%"
      >
        <p>服务协议</p>
        <p>欢迎使用本平台！在您使用我们的产品与服务前，请务必认真阅读以下服务协议内容。</p>
        <p>一、服务说明</p>
        <p>
          本平台提供股票数据展示、技术分析、策略回测等功能，供用户进行市场分析与个人投资辅助决策。平台不提供任何形式的投资建议或交易指令，亦不对投资结果承担责任。
        </p>
        <p>二、用户使用规范</p>
        <p>用户应遵守相关法律法规，不得利用平台从事非法行为。</p>
        <p>用户不得通过非正常手段访问或干扰平台系统安全。</p>
        <p>注册账户仅限本人使用，禁止共享、转让或用于牟利用途。</p>
        <p>三、知识产权声明</p>
        <p>
          本平台中展示的图表、策略模型、技术实现等内容，除第三方授权数据外，均为平台所有。未经授权，用户不得复制、传播或用于商业用途。
        </p>
        <p>四、免责声明</p>
        <p>股票数据来自第三方数据提供商，平台对其准确性、及时性不作任何保证。</p>
        <p>因网络中断、系统故障或不可抗力造成的服务中断或数据丢失，平台不承担赔偿责任。</p>
        <p>五、协议变更</p>
        <p>我们有权不定期更新本协议内容，变更后将在平台上公布，继续使用视为接受更新内容。</p>
      </t-dialog>
      <t-dialog
        :visible="privacyVisible"
        header="隐私声明"
        :on-close="onClose"
        :on-overlay-click="onClose"
        :on-confirm="onClose"
        :on-esc-keydown="onClose"
        :on-cancel="onClose"
        top="0"
        width="60%"
      >
        <p>隐私声明</p>
        <p>
          我们重视您的个人信息安全，并致力于保护您的隐私权。以下是我们收集、使用和保护信息的方式：
        </p>
        <p>一、信息收集</p>
        <p>我们可能收集如下信息用于服务功能实现和体验优化：</p>
        <p>账户信息：如邮箱、用户名等用于身份验证。</p>
        <p>行为数据：如页面访问、操作记录用于优化用户体验。</p>
        <p>设备信息：如浏览器、IP、系统信息用于安全审计。</p>
        <p>二、信息使用</p>
        <p>我们仅在以下场景中使用您的数据：</p>
        <p>提供核心功能（如个性化推荐、策略保存）</p>
        <p>数据统计与平台优化</p>
        <p>法律法规允许或要求的场景</p>
        <p>三、信息存储与保护</p>
        <p>所有数据存储在加密服务器中，采用传输加密（如 HTTPS）技术保障安全。</p>
        <p>我们限制员工访问用户数据，仅授权人员可进行运维操作。</p>
        <p>四、第三方服务</p>
        <p>
          我们可能使用第三方服务（如行情数据
          API、图表库）并共享必要信息。我们会确保合作方的数据处理行为符合隐私保护标准。
        </p>
        <p>五、用户权利</p>
        <p>您有权查看、更正或删除自己的账户信息。如需注销账户或咨询隐私问题，请联系我们。</p>
      </t-dialog>
    </t-form-item>

    <t-form-item>
      <t-button block size="large" type="submit"> 注册 </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'

import { useCounter } from '@/infrastructure/hook'

const INITIAL_DATA = {
  phone: '',
  email: '',
  password: '',
  verifyCode: '',
  checked: false,
}

const form = ref()
const formData = ref({ ...INITIAL_DATA })

const serviceVisible = ref(false)
const privacyVisible = ref(false)

const onClose = () => {
  serviceVisible.value = false
  privacyVisible.value = false
}
const showPsw = ref(false)

const [countDown, handleCounter] = useCounter()

const emit = defineEmits(['registerSuccess'])

const onSubmit = (ctx) => {
  if (ctx.validateResult === true) {
    if (!formData.value.checked) {
      MessagePlugin.error('请同意Kynance服务协议和Kynance 隐私声明')
      return
    }
    MessagePlugin.success('注册成功')
    emit('registerSuccess')
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
