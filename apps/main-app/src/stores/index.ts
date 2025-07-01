import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(createPersistedState())

export { store }

export * from './moudles/user'
export * from './moudles/setting'
export * from './moudles/premission'

export default store
