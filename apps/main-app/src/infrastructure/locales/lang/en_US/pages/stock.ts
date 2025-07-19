import Recommend from '@/pages/market/stocks/components/Recommend.vue'

export default {
  countries: {
    China: { title: 'Chinese Mainland', value: 'CN' },
    America: { title: 'America', value: 'US' },
    HongKong: { title: 'HongKong', value: 'HK' },
    Taiwan: { title: 'Taiwan', value: 'TW' },
    Japan: { title: 'Japan', value: 'JP' },
    UK: { title: 'UK', value: 'GB' },
    Germany: { title: 'Germany', value: 'DE' },
    India: { title: 'India', value: 'IN' },
    Australia: { title: 'Australia', value: 'AU' },
  },
  dropdown: {
    up: 'Gainer list',
    down: 'Loser list',
  },
  columns: {
    name: 'stock name',
    price: 'current price',
    change: 'change',
    changeAmount: 'change amount',
    volume: 'trading volume',
    highPrice: 'highest price',
    lowPrice: 'lowest price',
    closePrice: 'previous closing price',
  },
  error: 'Request Failed',
  recommend: {
    title: 'Daily Recommend',
    Tencent: 'Tencent',
    Bank: 'Bank of China',
    TSMC: 'TSMC',
    Google: 'Google',
    Apple: 'Apple',
    Amazon: 'Amazon',
    Oracle: 'Oracle',
    Microsoft: 'Microsoft',
    Facebook: 'FaceBook',
    NVIDIA: 'NVIDIA',
  },
}
