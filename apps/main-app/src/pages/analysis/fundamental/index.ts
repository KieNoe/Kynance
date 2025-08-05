import { reactive } from 'vue'

import { t } from '@/infrastructure/locales'
export const info = reactive({
  companyInfo: {
    name: t('pages.analysis.fundamental.company.name'),
    code: '00700.HK',
    industry: t('pages.analysis.fundamental.company.industry'),
    logo: '',
    currentPrice: 368.5,
    priceChange: 12.3,
    priceChangePercent: 3.45,
    marketCap: 35280,
    floatMarketCap: 32150,
    pe: 18.5,
    pb: 3.2,
  },
  financialIndicators: [
    {
      key: 'revenue',
      name: t('pages.analysis.fundamental.financialIndicators.revenue'),
      value: '5601.18亿',
      change: 8.2,
      rating: t('pages.analysis.fundamental.ratings.excellent'),
      score: 85,
    },
    {
      key: 'netProfit',
      name: t('pages.analysis.fundamental.financialIndicators.netProfit'),
      value: '1227.42亿',
      change: 12.5,
      rating: t('pages.analysis.fundamental.ratings.excellent'),
      score: 90,
    },
    {
      key: 'roe',
      name: 'ROE',
      value: '16.8%',
      change: 2.1,
      rating: t('pages.analysis.fundamental.ratings.good'),
      score: 75,
    },
    {
      key: 'roa',
      name: 'ROA',
      value: '8.9%',
      change: 1.8,
      rating: t('pages.analysis.fundamental.ratings.good'),
      score: 70,
    },
    {
      key: 'debtRatio',
      name: t('pages.analysis.fundamental.financialIndicators.AssetLiabilityRatio'),
      value: '32.5%',
      change: -1.2,
      rating: t('pages.analysis.fundamental.ratings.excellent'),
      score: 80,
    },
    {
      key: 'grossMargin',
      name: t('pages.analysis.fundamental.financialIndicators.grossMargin'),
      value: '45.2%',
      change: 0.8,
      rating: t('pages.analysis.fundamental.ratings.good'),
      score: 78,
    },
  ],
  riskAssessment: [
    {
      type: t('pages.analysis.fundamental.risk.types.liquidity'),
      level: t('pages.analysis.fundamental.risk.levels.low'),
      description: '公司现金流充足，短期偿债能力强，流动性风险较低。',
    },
    {
      type: t('pages.analysis.fundamental.risk.types.operation'),
      level: t('pages.analysis.fundamental.risk.levels.medium'),
      description: '受行业监管政策影响，部分业务增长面临不确定性。',
    },
    {
      type: t('pages.analysis.fundamental.risk.types.financial'),
      level: t('pages.analysis.fundamental.risk.levels.low'),
      description: '财务结构稳健，负债率合理，财务风险可控。',
    },
  ],
})
