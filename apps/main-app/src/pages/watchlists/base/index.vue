<template>
  <t-card>
    <div class="watchlist-container">
      <!-- 顶部操作栏 -->
      <div class="operation-bar">
        <div class="left-operations">
          <t-button theme="primary" @click="showAddStockModal">
            <template #icon><t-icon name="add" /></template>
            批量添加
          </t-button>
          <t-button theme="danger" :disabled="!hasSelected" @click="batchDeleteConfirm">
            <template #icon><t-icon name="delete" /></template>
            批量删除
          </t-button>
          <t-button @click="refreshData">
            <template #icon><t-icon name="refresh" /></template>
            刷新
          </t-button>
        </div>
        <div class="right-operations">
          <t-select
            v-model="sortOption"
            style="width: 12.5rem; margin-left: 0.5rem"
            @change="handleSortChange"
          >
            <t-option value="default" label="默认排序" />
            <t-option value="priceAsc" label="价格 (低 → 高)" />
            <t-option value="priceDesc" label="价格 (高 → 低)" />
            <t-option value="changePercentAsc" label="涨跌幅 (低 → 高)" />
            <t-option value="changePercentDesc" label="涨跌幅 (高 → 低)" />
          </t-select>
        </div>
      </div>

      <!-- 股票列表表格 -->
      <t-table
        :data="paginatedStocks"
        :columns="columns as any"
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
            <t-link @click="viewStockDetail(row)">详情</t-link>
            <t-divider layout="vertical" style="margin: 0 var(--td-comp-margin-xs)" />
            <t-popconfirm content="确定要删除这只股票吗?" @confirm="() => removeStock(row.code)">
              <t-link class="delete-link">删除</t-link>
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
        header="批量添加股票"
        width="46.875rem"
        top="2%"
        @confirm="handleAddStocks"
      >
        <div class="search-stock-container">
          <t-input
            v-model="stockSearchText"
            placeholder="输入股票代码或名称搜索"
            style="width: 18.75rem; margin-bottom: 1rem"
            clearable
            v-on:enter="searchStocks"
          >
            <template #suffix-icon>
              <t-icon name="search" @click="searchStocks" />
            </template>
          </t-input>

          <t-table
            :data="searchResults"
            :columns="searchColumns as any"
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
      <t-empty v-if="filteredStocks.length === 0 && !loading" description="暂无自选股，请添加">
        <template #actions>
          <t-button theme="primary" @click="showAddStockModal"> 添加股票 </t-button>
        </template>
      </t-empty>
    </div></t-card
  >
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { getWatchList, getSearchList } from '@/services/client'
import { useWatchListStore } from '@/stores'
import { StockInfo } from '@kynance/types'

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

// 表格列定义
const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    colKey: 'code',
    title: '代码',
    width: 100,
    cell: 'code',
  },
  {
    colKey: 'name',
    title: '名称',
    width: 100,
    cell: 'name',
  },
  {
    colKey: 'price',
    title: '最新价',
    width: 100,
    cell: 'price',
    sorter: true,
  },
  {
    colKey: 'changePercent',
    title: '涨跌幅',
    width: 100,
    cell: 'changePercent',
    sorter: true,
  },
  {
    colKey: 'volume',
    title: '成交量',
    width: 100,
  },
  {
    colKey: 'turnover',
    title: '成交额',
    width: 100,
    ellipsis: true,
  },
  {
    colKey: 'marketCap',
    title: '市值',
    width: 100,
    ellipsis: true,
  },
  {
    colKey: 'operation',
    title: '操作',
    fixed: 'right',
    width: 150,
    cell: 'operation',
  },
]

// 搜索结果表格列定义
const searchColumns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    colKey: 'code',
    title: '代码',
  },
  {
    colKey: 'name',
    title: '名称',
  },
  {
    colKey: 'price',
    title: '最新价',
  },
  {
    colKey: 'changePercent',
    title: '涨跌幅',
    cell: 'changePercent',
  },
]

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
    MessagePlugin.error('获取自选股数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

function refreshData() {
  fetchData()
  MessagePlugin.success('数据已刷新')
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

// function onSearch() {
//   currentPage.value = 1
// }

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
      // 默认排序，可以按添加顺序或其他逻辑
      break
  }
}

function viewStockDetail(stock) {
  watchListStore.setCurrentStock(stock)
  // 这里未来添加导航到股票详情页的逻辑
  MessagePlugin.info(`查看股票: ${stock.name} (${stock.code})`)
}

function removeStock(code) {
  watchListStore.removeStock(code)
  MessagePlugin.success('已从自选股移除')
}

function batchDeleteConfirm() {
  if (selectedRowKeys.value.length === 0) return

  DialogPlugin.confirm({
    header: '批量删除确认',
    body: `确定要删除选中的 ${selectedRowKeys.value.length} 只股票吗？`,
    onConfirm: () => {
      // 找到对应的股票代码并删除
      const stocksToDelete = watchListStore.stocks
        .filter((stock) => selectedRowKeys.value.includes(stock.id))
        .map((stock) => stock.code)

      stocksToDelete.forEach((code) => {
        watchListStore.removeStock(code)
      })

      selectedRowKeys.value = []
      MessagePlugin.success(`已删除 ${stocksToDelete.length} 只股票`)
    },
  })
}

function showAddStockModal() {
  addModalVisible.value = true
  stockSearchText.value = ''
  searchResults.value = []
  selectedSearchKeys.value = []

  // 模拟一些搜索结果
  searchStocks()
}

// 模拟搜索股票
async function searchStocks() {
  const keyword = stockSearchText.value

  const mockSearchResults: any = await getWatchList(await getSearchList())

  if (!keyword) {
    searchResults.value = mockSearchResults
    return
  }

  const lowerKeyword = keyword.toLowerCase()
  searchResults.value = mockSearchResults.filter(
    (stock) =>
      stock.code.toLowerCase().includes(lowerKeyword) ||
      stock.name.toLowerCase().includes(lowerKeyword),
  )
}

function handleAddStocks() {
  if (selectedSearchKeys.value.length === 0) {
    MessagePlugin.warning('请选择要添加的股票')
    return false
  }

  const stocksToAdd = searchResults.value.filter((stock) =>
    selectedSearchKeys.value.includes(stock.id),
  )

  watchListStore.addStocks(stocksToAdd)
  MessagePlugin.success(`成功添加 ${stocksToAdd.length} 只股票到自选列表`)
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
