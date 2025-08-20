<template>
  <t-card>
    <div class="watchlist-container">
      <!-- 顶部操作栏 -->
      <div class="operation-bar">
        <div class="left-operations">
          <t-button theme="primary" @click="showAddStockModal">
            <template #icon><AddIcon /></template>
            {{ t('pages.watchList.base.addInBatches') }}
          </t-button>
          <t-button theme="danger" :disabled="!hasSelected" @click="batchDeleteConfirm">
            <template #icon><DeleteIcon /></template>
            {{ t('pages.watchList.base.batchDelete') }}
          </t-button>
          <t-button @click="refreshData">
            <template #icon><RefreshIcon /></template>
            {{ t('pages.watchList.base.refresh') }}
          </t-button>
        </div>
        <div class="right-operations">
          <t-select
            v-model="sortOption"
            style="width: 12.5rem; margin-left: 0.5rem"
            @change="handleSortChange"
          >
            <t-option value="default" :label="t('pages.watchList.base.defaultSort')" />
            <t-option value="priceAsc" :label="t('pages.watchList.base.priceAsc')" />
            <t-option value="priceDesc" :label="t('pages.watchList.base.priceDesc')" />
            <t-option value="changePercentAsc" :label="t('pages.watchList.base.changePercentAsc')" />
            <t-option value="changePercentDesc" :label="t('pages.watchList.base.changePercentDesc')" />
          </t-select>
        </div>
      </div>

      <!-- 股票列表表格 -->
      <t-table
        :data="paginatedStocks"
        :columns="(COLUMNS as any)"
        :loading="loading"
        row-key="id"
        :selected-row-keys="selectedRowKeys"
        @select-change="onSelectChange"
        max-height="37.5rem"
        stripe
      >
        <!-- 股票代码列 -->
        <template #code="{ row }">
          <t-link @click="viewStockDetail(row)">{{ row.code }}</t-link>
        </template>

        <!-- 股票名称列 -->
        <template #name="{ row }">
          <t-link @click="viewStockDetail(row)">{{ row.name }}</t-link>
        </template>

        <!-- 价格列 -->
        <template #price="{ row }">
          {{ row.price.toFixed(2) }}
        </template>

        <!-- 涨跌幅列 -->
        <template #changePercent="{ row }">
          <span :class="row.changePercent >= 0 ? 'price-up' : 'price-down'">
            {{ (row.changePercent >= 0 ? '+' : '') + row.changePercent.toFixed(2) }}%
          </span>
        </template>

        <!-- 操作列 -->
        <template #operation="{ row }">
          <t-space>
            <t-link @click="viewStockDetail(row)">{{ t('pages.watchList.base.viewDetails') }}</t-link>
            <t-divider layout="vertical" style="margin: 0 var(--td-comp-margin-xs)" />
            <t-popconfirm :content="t('pages.watchList.base.confirmDelete')" @confirm="() => removeStock(row.code)">
              <t-link class="delete-link">{{ t('pages.watchList.base.delete') }}</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>

      <!-- 分页控件 -->
      <div class="pagination-container">
        <t-pagination
          v-model="currentPage"
          :total="filteredStocks.length"
          :page-size="pageSize"
          :page-size-options="[10, 20, 50, 100]"
          @change="handlePageChange"
          @page-size-change="handleSizeChange"
          show-total
          show-jumper
        />
      </div>

      <!-- 批量添加股票弹窗 -->
      <t-dialog
        v-model:visible="addModalVisible"
        :header="t('pages.watchList.base.addStocksTitle')"
        width="46.875rem"
        top="2%"
        @confirm="handleAddStocks"
      >
        <div class="search-stock-container">
          <t-input
            v-model="stockSearchText"
            :placeholder="t('pages.watchList.base.searchPlaceholder')"
            style="width: 18.75rem; margin-bottom: 1rem"
            clearable
            v-on:enter="searchStocks"
          >
            <template #suffix-icon>
              <SearchIcon @click="searchStocks" />
            </template>
          </t-input>

          <t-table
            :data="searchResults"
            :columns="(SEARCH_COLUMNS as any)"
            :pagination="{
              total: searchResults.length,
              defaultCurrent: 1,
              defaultPageSize: 5,
            }"
            row-key="id"
            :selected-row-keys="selectedSearchKeys"
            @select-change="(keys) => (selectedSearchKeys = keys)"
          >
            <template #changePercent="{ row }">
              <span :class="row.changePercent >= 0 ? 'price-up' : 'price-down'">
                {{ (row.changePercent >= 0 ? '+' : '') + row.changePercent.toFixed(2) }}%
              </span>
            </template>
          </t-table>
        </div>
      </t-dialog>

      <!-- 空状态提示 -->
      <t-empty v-if="filteredStocks.length === 0 && !loading" :description="t('pages.watchList.base.noStocks')">
        <template #actions>
          <t-button theme="primary" @click="showAddStockModal"> {{t('pages.watchList.base.addStock')}} </t-button>
        </template>
      </t-empty>
    </div>
  </t-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { AddIcon, DeleteIcon, RefreshIcon, SearchIcon } from 'tdesign-icons-vue-next'

import { getWatchList, getSearchList } from '@/services/client'
import { useWatchListStore } from '@/stores'
import { t } from '@/infrastructure/locales'

import { COLUMNS,SEARCH_COLUMNS } from './contast'

// 初始化 store
const watchListStore = useWatchListStore()

// 页面状态
const loading = ref(false)
const searchText = ref('')
const sortOption = ref('default')
const currentPage = ref(1)
const pageSize = ref(5)
const selectedRowKeys = ref([])
const addModalVisible = ref(false)
const stockSearchText = ref('')
const searchResults = ref([])
const selectedSearchKeys = ref([])

// 计算属性
const filteredStocks = computed(() => {
  if (!searchText.value) return watchListStore.stocks

  const keyword = searchText.value.toLowerCase()
  return watchListStore.stocks.filter(
    (stock) =>
      stock.code.toLowerCase().includes(keyword) || stock.name.toLowerCase().includes(keyword),
  )
})

const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredStocks.value.slice(start, end)
})

const hasSelected = computed(() => selectedRowKeys.value.length > 0)

// 生命周期钩子
onMounted(async () => {
  await fetchData()
})

// 监听搜索文本变化，重置页码
watch(searchText, () => {
  currentPage.value = 1
})

// 方法
async function fetchData() {
  loading.value = true
  try {
    await watchListStore.fetchWatchlist(getWatchList)
  } catch (error) {
    MessagePlugin.error(t('pages.watchList.base.fetchError'))
    console.error(error)
  } finally {
    loading.value = false
  }
}

function refreshData() {
  fetchData()
  MessagePlugin.success(t('pages.watchList.base.refreshed'))
}

function handlePageChange(pageInfo) {
  currentPage.value = pageInfo.current
}

function handleSizeChange(size) {
  pageSize.value = size
  currentPage.value = 1
}

function onSelectChange(keys) {
  selectedRowKeys.value = keys
}

function handleSortChange(value) {
  switch (value) {
    case 'priceAsc':
      watchListStore.sortStocks('price', true)
      break
    case 'priceDesc':
      watchListStore.sortStocks('price', false)
      break
    case 'changePercentAsc':
      watchListStore.sortStocks('changePercent', true)
      break
    case 'changePercentDesc':
      watchListStore.sortStocks('changePercent', false)
      break
    default:
      // 默认排序
      break
  }
}

function viewStockDetail(stock) {
  watchListStore.setCurrentStock(stock)
  MessagePlugin.info(
    t('pages.watchList.base.viewStockDetail', {
      name: stock.name,
      code: stock.code
    })
  )
}

function removeStock(code) {
  watchListStore.removeStock(code)
  MessagePlugin.success(t('pages.watchList.base.removeSuccess'))
}

function batchDeleteConfirm() {
  if (selectedRowKeys.value.length === 0) return

  DialogPlugin.confirm({
    header: t('pages.watchList.base.batchDeleteConfirm.header'),
    body: t('pages.watchList.base.batchDeleteConfirm.body', {
      count: selectedRowKeys.value.length
    }),
    onConfirm: () => {
      const stocksToDelete = watchListStore.stocks
        .filter((stock) => selectedRowKeys.value.includes(stock.id))
        .map((stock) => stock.code)

      stocksToDelete.forEach((code) => {
        watchListStore.removeStock(code)
      })

      selectedRowKeys.value = []
      MessagePlugin.success(
        t('pages.watchList.base.batchDeleteSuccess', {
          count: stocksToDelete.length
        })
      )
    },
  })
}

function showAddStockModal() {
  addModalVisible.value = true
  stockSearchText.value = ''
  searchResults.value = []
  selectedSearchKeys.value = []
  searchStocks()
}

async function searchStocks() {
  const keyword = stockSearchText.value

  const mockSearchResults = await getWatchList(await getSearchList())

  if(Array.isArray(mockSearchResults)){

  if (!keyword) {
    searchResults.value = mockSearchResults
    return
  }

  const lowerKeyword = keyword.toLowerCase()
  searchResults.value = mockSearchResults.filter(
    (stock) =>
      stock.code.toLowerCase().includes(lowerKeyword) ||
      stock.name.toLowerCase().includes(lowerKeyword)
  )}
}

function handleAddStocks() {
  if (selectedSearchKeys.value.length === 0) {
    MessagePlugin.warning(t('pages.watchList.base.selectStocksWarning'))
    return false
  }

  const stocksToAdd = searchResults.value.filter((stock) =>
    selectedSearchKeys.value.includes(stock.id)
  )

  watchListStore.addStocks(stocksToAdd)
  MessagePlugin.success(
    t('pages.watchList.base.addStocksSuccess', {
      count: stocksToAdd.length
    })
  )
  addModalVisible.value = false
  return true
}
</script>

<style scoped>
.watchlist-container {
  padding: 0;
  width: 100%;
}

.operation-bar {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-operations > * {
  margin-right: 0.5rem;
}

.pagination-container {
  margin-top: 1rem;
  width: 52%;
  margin-left: 20%;
}

.price-up {
  color: #e34d59;
}

.price-down {
  color: #00a870;
}

.delete-link {
  color: #e34d59;
}

.search-stock-container {
  margin-top: 1rem;
}
</style>
