import { createPinia } from 'pinia'

const store = createPinia()

export { store }

export * from './moudles/backtest'
export * from './moudles/code'
export * from './moudles/notification'
export * from './moudles/premission'
export * from './moudles/setting'
export * from './moudles/stockData'
export * from './moudles/user'
export * from './moudles/watchlist'

export default store
