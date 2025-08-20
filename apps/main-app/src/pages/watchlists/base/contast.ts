import { t } from '@/infrastructure/locales'
export const COLUMNS = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    colKey: 'code',
    title: t('pages.watchList.base.column.code'),
    width: 100,
    cell: 'code',
  },
  {
    colKey: 'name',
    title: t('pages.watchList.base.column.name'),
    width: 100,
    cell: 'name',
  },
  {
    colKey: 'price',
    title: t('pages.watchList.base.column.price'),
    width: 100,
    cell: 'price',
    sorter: true,
  },
  {
    colKey: 'changePercent',
    title: t('pages.watchList.base.column.changePercent'),
    width: 100,
    cell: 'changePercent',
    sorter: true,
  },
  {
    colKey: 'volume',
    title: t('pages.watchList.base.column.volume'),
    width: 100,
  },
  {
    colKey: 'turnover',
    title: t('pages.watchList.base.column.turnover'),
    width: 100,
    ellipsis: true,
  },
  {
    colKey: 'marketCap',
    title: t('pages.watchList.base.column.marketCap'),
    width: 100,
    ellipsis: true,
  },
  {
    colKey: 'operation',
    title: t('pages.watchList.base.column.operation'),
    fixed: 'right',
    width: 150,
    cell: 'operation',
  },
]
export const SEARCH_COLUMNS = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    colKey: 'code',
    title: t('pages.watchList.base.searchColumns.code'),
  },
  {
    colKey: 'name',
    title: t('pages.watchList.base.searchColumns.name'),
  },
  {
    colKey: 'price',
    title: t('pages.watchList.base.searchColumns.price'),
  },
  {
    colKey: 'changePercent',
    title: t('pages.watchList.base.searchColumns.changePercent'),
    cell: 'changePercent',
  },
]
