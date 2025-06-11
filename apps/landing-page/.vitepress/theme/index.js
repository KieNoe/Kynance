import DefaultTheme from 'vitepress/theme'
import './styles/custom.css'
import MyLayout from './Layout.vue'

export default {
  extends: DefaultTheme,
  // 使用注入插槽的包装组件覆盖 Layout
  Layout: MyLayout
}
