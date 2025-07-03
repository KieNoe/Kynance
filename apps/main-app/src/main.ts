/* eslint-disable @typescript-eslint/no-unused-vars */
import TDesign from 'tdesign-vue-next'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import i18n from './infrastructure/locales'
import store from './stores'
import './permission.ts'

const app = createApp(App)

app.use(TDesign)
app.use(router)
app.use(i18n)
app.use(store)

app.mount('#app')
