import TDesign from 'tdesign-vue-next'
import { createApp } from 'vue'

import App from './App.vue'
import i18n from './infrastructure/locales'
import './permission.ts'
import router from './router'
import store from './stores'

const app = createApp(App)

app.use(store)
app.use(TDesign)
app.use(router)
app.use(i18n)

app.config.errorHandler = (err, instance, info) => {
  console.error('Vue全局错误:', err, info, '组件:', instance)
}

app.mount('#app')
