import { createPinia } from 'pinia'

const store = createPinia()

export { store }

export * from './moudles/user'
export * from './moudles/setting'
export * from './moudles/premission'
export * from './moudles/notification'

export default store
