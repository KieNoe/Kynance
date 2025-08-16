<!-- eslint-disable vue/no-mutating-props -->
<template>
  <t-card
    class="code-editor-card"
    :title="t('pages.backtest.new.codeEditing.strategyCode')"
    hover-shadow
    ref="fullscreenElement"
    :class="{ fullscreen: isFullscreen }"
  >
    <template #actions>
      <t-dropdown :options="snippetOptions" @click="handleSnippetSelect" v-if="!isFullscreen">
        <t-button variant="text">
          <template #icon>
            <template-icon />
          </template>
          {{ t('pages.backtest.new.codeEditing.templateButton') }}
        </t-button>
      </t-dropdown>
      <t-button variant="text" @click="toggleFullscreen">
        <template #icon>
          <fullscreen-icon v-if="!isFullscreen" />
          <fullscreen-exit-icon v-else />
        </template>
        {{
          isFullscreen
            ? t('pages.backtest.new.codeEditing.exitFullscreen')
            : t('pages.backtest.new.codeEditing.fullscreenEdit')
        }}
      </t-button>
    </template>
    <div class="editor-container">
      <editor
        v-model="localCodeContent"
        :language="language"
        :options="editorOptions as any"
        @editor-mounted="editorMounted"
        @change="onChange"
        :is-fullscreen="isFullscreen"
        class="editor"
        :style="isFullscreen ? 'width: 96vw;height:84vh' : 'width:57.875rem'"
        style="display: block"
      />
    </div>
  </t-card>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { FullscreenIcon, FullscreenExitIcon, TemplateIcon } from 'tdesign-icons-vue-next'

import editor from '@/components/editor/index.vue'
import { t } from '@/infrastructure/locales'
import { useSettingStore } from '@/stores'

import {
  snippetOptions,
  defaultEditorOptions,
  CUSTOM_STORAGE_KEY,
  maTemplateCode,
  rsiTemplateCode,
  bollingerTemplateCode,
} from '../index'
const settingStore = useSettingStore()
const isFullscreen = ref(false)
const fullscreenElement = ref(null)
const language = ref('javascript')
let editorOptions = {
  ...defaultEditorOptions,
  theme: settingStore.mode === 'dark' ? 'vs-dark' : 'vs',
}
const editors = shallowRef([])

const props = defineProps(['codeContent', 'update'])

const localCodeContent = computed(() => props.codeContent)

const toggleFullscreen = async () => {
  try {
    if (!fullscreenElement.value) {
      MessagePlugin.error(t('pages.backtest.new.codeEditing.DOMerror'))
      return
    }
    const element = fullscreenElement.value.$el
    if (!document.fullscreenElement) {
      await element.requestFullscreen()
      isFullscreen.value = true
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
        isFullscreen.value = false
      }
    }
  } catch (err) {
    MessagePlugin.error(t('pages.backtest.new.codeEditing.fullscreenError') + err.message)
  }
}

document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})

const onChange = () => {
  localStorage.setItem(CUSTOM_STORAGE_KEY, props.codeContent)
}

const editorMounted = (editorInstance) => {
  editors.value.push(editorInstance)
}

const handleSnippetSelect = (codeTemplate) => {
  let templateCode = ''

  switch (codeTemplate.value) {
    case 'ma_cross':
      templateCode = maTemplateCode
      break
    case 'rsi_reversal':
      templateCode = rsiTemplateCode
      break
    case 'bollinger_bands':
      templateCode = bollingerTemplateCode
      break
  }

  if (templateCode) {
    props.update(templateCode)
    MessagePlugin.success(
      t('pages.backtest.new.codeEditing.loaded') +
        snippetOptions.find((item) => item.value === codeTemplate.value)?.content +
        t('pages.backtest.new.codeEditing.template'),
    )
  }
}

const stopWatch = watch(
  () => settingStore.mode,
  () => {
    editorOptions = {
      ...defaultEditorOptions,
      theme: settingStore.mode === 'dark' ? 'vs-dark' : 'vs',
    }
  },
)

onBeforeUnmount(() => stopWatch())
</script>
<style scoped lang="less">
@import url('../index.less');
</style>
