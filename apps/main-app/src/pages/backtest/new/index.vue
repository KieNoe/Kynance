<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="strategy-page">
    <!-- 页面头部 -->
    <t-card class="header-card">
      <div class="header-content">
        <div class="left">
          <h2 class="title">{{ t('pages.backtest.new.title') }}</h2>
        </div>
        <div class="right">
          <t-space>
            <t-button theme="default" @click="resetForm">{{
              t('pages.backtest.new.reset')
            }}</t-button>
            <t-button theme="primary" @click="saveStrategy">{{
              t('pages.backtest.new.save')
            }}</t-button>
            <t-button theme="success" @click="deployStrategy">{{
              t('pages.backtest.new.deployTest')
            }}</t-button>
          </t-space>
        </div>
      </div>
    </t-card>

    <!-- 策略信息表单 -->
    <t-card class="strategy-info-card" :title="t('pages.backtest.new.strategyInfo')" hover-shadow>
      <t-form ref="form" :data="formData" :rules="rules as any" label-width="7.5rem">
        <t-form-item :label="t('pages.backtest.new.strategyInfo')" name="name">
          <t-input
            v-model="formData.name"
            :placeholder="t('pages.backtest.new.strategyNamePlaceholder')"
          />
        </t-form-item>
        <t-form-item :label="t('pages.backtest.new.strategyInfo')" name="description">
          <t-textarea
            v-model="formData.description"
            :placeholder="t('pages.backtest.new.strategyDescPlaceholder')"
          />
        </t-form-item>
      </t-form>
    </t-card>

    <!-- 代码编辑区 -->
    <CodeEditing v-model:codeContent="codeContent" :update="updateCode" />

    <!-- 代码片段列表 -->
    <SnippetsCard
      :update-form-data="updateFormData"
      :update-code-content="updateCode"
      :post-message-to-worker="postMessageToWorker"
      :form-data="formData"
      :code-content="codeContent"
    />

    <!-- 代码可视化区域 -->
    <t-card
      class="visualization-card"
      :title="t('pages.backtest.new.codeVisualization')"
      hover-shadow
    >
      <t-tabs v-model="activeTab">
        <t-tab-panel value="flowchart" :label="t('pages.backtest.new.flowchart')">
          <div class="visualization-placeholder">
            <t-empty :description="t('pages.backtest.new.flowchartPlaceholder')" />
          </div>
        </t-tab-panel>
        <t-tab-panel value="dependency" :label="t('pages.backtest.new.dependency')">
          <div class="visualization-placeholder">
            <t-empty :description="t('pages.backtest.new.dependencyPlaceholder')" />
          </div>
        </t-tab-panel>
      </t-tabs>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { MessagePlugin, NotifyPlugin } from 'tdesign-vue-next'

import { useCustomCode, useBacktestStore } from '@/stores'
import { t } from '@/infrastructure/locales'
import router from '@/router'

import { defaultCodeContent, CUSTOM_STORAGE_KEY } from '.'
import CodeEditing from './components/CodeEditing.vue'
import SnippetsCard from './components/SnippetsCard.vue'

let worker

// 表单数据
const formData = reactive({
  name: '',
  description: '',
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: t('pages.backtest.new.nameRequired'), type: 'error' }],
}

// 编辑器相关
const codeContent = ref(defaultCodeContent)
const isFullscreen = ref(false)

// 代码片段相关
const customCodeStore = useCustomCode()
const backtestStore = useBacktestStore()
const isValid = ref(true)
const editors = shallowRef([])

// 可视化相关
const activeTab = ref('flowchart')

document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})

const updateCode = (newCode) => {
  codeContent.value = newCode
}

const updateFormData = (name, value) => {
  formData[name] = value
}

const postMessageToWorker = () => {
  worker.postMessage(codeContent.value)
  return isValid
}

// 保存策略
const saveStrategy = () => {
  if (!formData.name.trim()) {
    MessagePlugin.error(t('pages.backtest.new.nameRequired'))
    return
  }

  if (!codeContent.value.trim()) {
    MessagePlugin.error(t('pages.backtest.new.codeRequired'))
    return
  }
  if (postMessageToWorker()) {
    try {
      customCodeStore.addSnippet(formData.name, codeContent.value, formData.description)
    } catch (err) {
      MessagePlugin.error(`${t('pages.backtest.new.saveFailed')}: ${err.message}`)
      return
    }
    MessagePlugin.success(t('pages.backtest.new.saveSuccess'))
  }
}

// 部署测试
const deployStrategy = async () => {
  if (!formData.name.trim()) {
    MessagePlugin.error(t('pages.backtest.new.nameRequired'))
    return
  }

  if (!codeContent.value.trim()) {
    MessagePlugin.error(t('pages.backtest.new.codeRequired'))
    return
  }
  backtestStore.getBacktestResult.isCustomCode = true
  await worker.postMessage(codeContent.value)
  NotifyPlugin.success({
    title: t('pages.backtest.new.pageRedirect'),
    content: t('pages.backtest.new.redirectNotice'),
    duration: 3000,
    closeBtn: true,
    placement: 'top-right',
  })
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.description = ''
  localStorage.removeItem(CUSTOM_STORAGE_KEY)
  codeContent.value = defaultCodeContent
  MessagePlugin.success(t('pages.backtest.new.formReset'))
}

// 页面加载时初始化
onMounted(() => {
  worker = new Worker(new URL('@/workers/worker.js', import.meta.url), {
    type: 'module',
  })
  worker.onmessage = (e) => {
    isValid.value = e.data.isValid
    if (e.data.isValid) {
      NotifyPlugin.success({
        title: t('pages.backtest.new.codeValidationPass'),
        content: t('pages.backtest.new.codeValidationPassMsg'),
        duration: 3000,
        closeBtn: true,
        placement: 'top-right',
      })
      if (backtestStore.getBacktestResult.isCustomCode) {
        const parseCode = new Function(`
      ${codeContent.value}
      return runStrategy;  // 返回目标函数
    `)
        backtestStore.getBacktestResult.func = parseCode()
        setTimeout(async () => {
          router.push('/backtest/template')
        }, 3000)
      }
    } else {
      // 如果有错误，显示错误通知
      if (e.data.errors && e.data.errors.length > 0) {
        NotifyPlugin.error({
          title: t('pages.backtest.new.codeValidationFail'),
          content: `${(t('pages.backtest.new.found'), e.data.errors.length, t('pages.backtest.new.errorCount'))}: ${e.data.errors.join('; ')}`,
          duration: 5000,
          closeBtn: true,
        })
      }
    }
    // 如果有警告，显示警告通知
    if (e.data.warnings && e.data.warnings.length > 0) {
      NotifyPlugin.warning({
        title: t('pages.backtest.new.codeWarnings'),
        content: `${(t('pages.backtest.new.found'), e.data.warnings.length, t('pages.backtest.new.warnCount'))}: ${e.data.warnings.join('; ')}`,
        duration: 4000,
        closeBtn: true,
      })
    }
  }
})
onBeforeUnmount(() => {
  worker.terminate()
  for (const editor of editors.value) {
    editor.dispose()
  }
})
</script>

<style scoped lang="less">
@import url('./index.less');
</style>
