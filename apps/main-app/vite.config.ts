/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'

import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: import.meta.env.VITE_ENV === 'development', // 开启生产环境的 sourcemap
    rollupOptions: {
      plugins: [
        visualizer({
          filename: 'stats.html', // 默认在项目根目录下生成stats.html文件，可自定义
          open: true, //生成后自动打开浏览器查看
        }),
      ],
    },
  },
})
