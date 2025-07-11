/// <reference types="vitest" />
import path from 'node:path'

import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteMockServe } from 'vite-plugin-mock'
import svgLoader from 'vite-svg-loader'
import { loadEnv } from 'vite'

const CWD = process.cwd()
const { VITE_API_URL_PREFIX, VITE_BASE_URL } = loadEnv('development', CWD)

// https://vite.dev/config/
export default defineConfig({
  base: VITE_BASE_URL,
  plugins: [
    vue(),
    svgLoader(),
    // vueDevTools(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: process.env.VITE_ENV === 'development', // 开启生产环境的 sourcemap
    rollupOptions: {
      plugins: [
        visualizer({
          filename: 'stats.html', // 默认在项目根目录下生成stats.html文件，可自定义
          open: true, //生成后自动打开浏览器查看
        }),
      ],
    },
  },
  server: {
    port: 3005,
    host: '0.0.0.0',
    proxy: {
      [VITE_API_URL_PREFIX]: 'http://127.0.0.1:3000/',
    },
  },
})
