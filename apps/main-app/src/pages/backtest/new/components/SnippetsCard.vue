<template>
  <t-card class="snippets-card" :title="t('pages.backtest.new.snippetsCards.title')" hover-shadow>
    <template #actions>
      <t-button theme="primary" variant="text" @click="createNewSnippet">
        <template #icon>
          <add-icon />
        </template>
        {{ t('pages.backtest.new.snippetsCards.dialog.button.create') }}
      </t-button>
    </template>
    <t-table
      :data="snippetsList"
      :columns="columns"
      row-key="id"
      hover
      stripe
      :loading="tableLoading"
      :empty="t('pages.backtest.new.snippetsCards.dialog.table.emptyText')"
    >
      <template #name="{ row }">
        <t-tooltip :content="t('pages.backtest.new.snippetsCards.dialog.tooltip.load')">
          <span class="snippet-name" @click="loadSnippet(row)">{{ row.name }}</span>
        </t-tooltip>
      </template>
      <template #createTime="{ row }">
        {{ formatDate(row.createdAt) }}
      </template>
      <template #updateTime="{ row }">
        {{ formatDate(row.updatedAt) }}
      </template>
      <template #op="slotProps">
        <t-space>
          <t-tooltip :content="t('pages.backtest.new.snippetsCards.dialog.tooltip.edit')">
            <t-button
              theme="primary"
              variant="text"
              size="small"
              @click="editSnippet(slotProps.row)"
            >
              <template #icon>
                <edit-icon />
              </template>
            </t-button>
          </t-tooltip>
          <t-tooltip :content="t('pages.backtest.new.snippetsCards.dialog.tooltip.delete')">
            <t-button
              theme="danger"
              variant="text"
              size="small"
              @click="confirmDelete(slotProps.row)"
            >
              <template #icon>
                <delete-icon />
              </template>
            </t-button>
          </t-tooltip>
        </t-space>
      </template>
    </t-table>
  </t-card>

  <!-- 新建代码片段对话框 -->
  <t-dialog
    v-model:visible="dialogVisible"
    :header="t('pages.backtest.new.snippetsCards.dialog.create.title')"
    width="32rem"
    :confirm-btn="{
      content: t('pages.backtest.new.snippetsCards.dialog.create.confirm'),
      theme: 'primary',
    }"
    :cancel-btn="{
      content: t('pages.backtest.new.snippetsCards.dialog.create.cancel'),
      theme: 'default',
    }"
    @confirm="confirmDialog"
    @cancel="cancelDialog"
  >
    <t-form :data="snippetForm" :rules="snippetRules as any">
      <t-form-item :label="t('pages.backtest.new.snippetsCards.dialog.create.name')" name="name">
        <t-input
          v-model="snippetForm.name"
          :placeholder="t('pages.backtest.new.snippetsCards.dialog.create.namePlaceholder')"
        />
      </t-form-item>
      <t-form-item
        :label="t('pages.backtest.new.snippetsCards.dialog.create.description')"
        name="description"
      >
        <t-textarea
          v-model="snippetForm.description"
          :placeholder="t('pages.backtest.new.snippetsCards.dialog.create.descriptionPlaceholder')"
        />
      </t-form-item>
    </t-form>
  </t-dialog>

  <!-- 删除确认对话框 -->
  <t-dialog
    v-model:visible="deleteDialogVisible"
    :header="t('pages.backtest.new.snippetsCards.dialog.delete.title')"
    width="25rem"
    :confirm-btn="{
      content: t('pages.backtest.new.snippetsCards.dialog.delete.confirm'),
      theme: 'danger',
    }"
    :cancel-btn="{
      content: t('pages.backtest.new.snippetsCards.dialog.delete.cancel'),
      theme: 'default',
    }"
    @confirm="confirmDeleteSnippet"
    @cancel="deleteDialogVisible = false"
  >
    <p>
      {{
        t('pages.backtest.new.snippetsCards.dialog.delete.message', { name: currentSnippet?.name })
      }}
    </p>
  </t-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { AddIcon, EditIcon, DeleteIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'

import { useCustomCode } from '@/stores'
import { t } from '@/infrastructure/locales'

import { columns } from '../'

const props = defineProps({
  updateFormData: Function,
  updateCodeContent: Function,
  postMessageToWorker: Function,
  formData: Object,
  codeContent: String,
})

const customCodeStore = useCustomCode()

// 响应式数据
const snippetsList = computed(() => customCodeStore.snippets)
const tableLoading = ref(false)
const currentSnippet = ref(null)
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)

const snippetForm = reactive({
  name: '',
  code: '',
  description: '',
})

const snippetRules = {
  name: [
    {
      required: true,
      message: t('pages.backtest.new.snippetsCards.dialog.create.namePlaceholder'),
      type: 'error',
    },
  ],
}

// 方法
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

const createNewSnippet = () => {
  snippetForm.name = props.formData.name
  snippetForm.description = props.formData.description
  dialogVisible.value = true
}

const confirmDialog = async () => {
  if (!snippetForm.name.trim()) {
    MessagePlugin.error(t('pages.backtest.new.snippetsCards.dialog.create.namePlaceholder'))
    return
  }

  if (props.postMessageToWorker()) {
    try {
      customCodeStore.addSnippet(snippetForm.name, props.codeContent, snippetForm.description)
    } catch (err) {
      MessagePlugin.error(err.message)
      return
    }
    MessagePlugin.success(t('pages.backtest.new.snippetsCards.messages.createSuccess'))
  }
  dialogVisible.value = false
}

const cancelDialog = () => {
  dialogVisible.value = false
}

const confirmDelete = (snippet) => {
  currentSnippet.value = snippet
  deleteDialogVisible.value = true
}

const confirmDeleteSnippet = () => {
  if (currentSnippet.value) {
    customCodeStore.deleteSnippet(currentSnippet.value.id)
    MessagePlugin.success(t('pages.backtest.new.snippetsCards.messages.deleteSuccess'))
    deleteDialogVisible.value = false
  }
}

const editSnippet = (snippet) => {
  currentSnippet.value = snippet
  props.updateFormData('name', snippet.name)
  props.updateFormData('description', snippet.description)
  props.updateCodeContent(snippet.code)
  MessagePlugin.success(
    t('pages.backtest.new.snippetsCards.messages.loadSuccess', { name: snippet.name }),
  )
}

const loadSnippet = (snippet) => {
  props.updateCodeContent(snippet.code)
  MessagePlugin.success(
    t('pages.backtest.new.snippetsCards.messages.loadSuccess', { name: snippet.name }),
  )
}
</script>

<style scoped lang="less">
@import url('../index.less');
</style>
