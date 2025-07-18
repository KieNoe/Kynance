import Recommend from '@/pages/market/stocks/components/Recommend.vue'

export default {
  countries: {
    China: 'Chinese Mainland',
    America: 'America',
    HongKong: 'HongKong',
    Taiwan: 'Taiwan',
    Japan: 'Japan',
    UK: 'UK',
    Germany: 'Germany',
    India: 'India',
    Australia: 'Australia',
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
