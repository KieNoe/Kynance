<template>
  <div class="faq-container">
    <div class="faq-header">
      <t-row justify="space-between" align="middle">
        <t-col>
          <h1 class="faq-title">{{ t('pages.help.title') }}</h1>
        </t-col>
        <t-col>
          <t-input
            v-model="searchKeyword"
            :placeholder="t('pages.help.search')"
            clearable
            :on-clear="handleClear"
            class="search-input"
          >
            <template #prefix-icon>
              <search-icon />
            </template>
          </t-input>
        </t-col>
      </t-row>

      <t-tabs v-model="activeTab" class="category-tabs">
        <t-tab-panel
          v-for="category in CATEGORIES"
          :key="category.value"
          :value="category.value"
          :label="category.label"
        />
      </t-tabs>
    </div>

    <div class="faq-content">
      <t-collapse v-model="expandedIds" expandMutex class="faq-collapse">
        <t-collapse-panel
          v-for="item in filteredFaqList"
          :key="item.id"
          :value="item.id"
          :header="item.question"
          class="faq-item"
        >
          <div class="faq-answer">
            <div>{{ item.answer }}</div>

            <div class="feedback-section">
              <p class="feedback-question">{{ t('pages.help.question') }}</p>
              <t-space>
                <t-button variant="outline" size="small" @click="handleFeedback(item.id, true)">
                  <template #icon><thumb-up-icon /></template>
                  {{ t('pages.help.helpful') }}
                </t-button>
                <t-button variant="outline" size="small" @click="handleFeedback(item.id, false)">
                  <template #icon><thumb-down-icon /></template>
                  {{ t('pages.help.unhelpful') }}
                </t-button>
              </t-space>
            </div>
          </div>
        </t-collapse-panel>
      </t-collapse>

      <div class="pagination-container">
        <t-pagination
          v-model="currentPage"
          :total="totalItems"
          :page-size="pageSize"
          :page-size-options="[5, 10, 20]"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { SearchIcon, ThumbUpIcon, ThumbDownIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'

import { t } from '@/infrastructure/locales'

import { CATEGORIES, FAQ_DATA } from './constants'

const activeTab = ref('all')
const searchKeyword = ref('')
const expandedIds = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const totalItems = ref(0)

// 计算属性：根据分类和搜索关键词过滤FAQ列表
const filteredFaqList = computed(() => {
  let result = [...FAQ_DATA]

  // 按分类筛选
  if (activeTab.value !== 'all') {
    result = result.filter((item) => item.category === activeTab.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      (item) =>
        item.question.toLowerCase().includes(keyword) ||
        item.answer.toLowerCase().includes(keyword),
    )
  }

  updataTotalItems(result.length)

  // 分页处理
  const startIndex = (currentPage.value - 1) * pageSize.value
  return result.slice(startIndex, startIndex + pageSize.value)
})

const updataTotalItems = (length) => {
  totalItems.value = length
}

// 方法
const handleClear = () => {
  searchKeyword.value = ''
}

const handlePageChange = (pageInfo) => {
  currentPage.value = pageInfo.current
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
}

const handleFeedback = (id, isHelpful) => {
  // 实际应用中，这里应该发送请求到后端记录反馈
  MessagePlugin.success(
    t('pages.help.thank.feedback') +
      (isHelpful ? t('pages.help.thank.good') : t('pages.help.thank.bad')),
  )
}

const stopWatch = watch(activeTab, () => {
  currentPage.value = 1 // 切换分类时，重置到第一页
})

// 生命周期钩子
onMounted(() => {
  // 初始化时可以加载数据，这里使用的是静态数据
  totalItems.value = FAQ_DATA.length
})

onBeforeUnmount(() => {
  stopWatch()
})
</script>

<style scoped>
@import url('./index.less');
</style>
