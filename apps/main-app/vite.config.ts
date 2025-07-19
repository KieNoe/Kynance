/// <reference types="vitest" />
import path from 'node:path'

import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteMockServe } from 'vite-plugin-mock'
import svgLoader from 'vite-svg-loader'
import { loadEnv } from 'vite'

const CWD = process.cwd()
const { VITE_BASE_URL } = loadEnv('development', CWD)

// https://vite.dev/config/
export default defineConfig({
  base: VITE_BASE_URL,
  define: {
    'process.env': {},
  },
  plugins: [
    vue(),
    svgLoader(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    }),
    vueJsx(),
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
  },
})
