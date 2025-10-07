/// <reference types="vitest" />
import path from 'node:path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import viteImagemin from 'vite-plugin-imagemin'
import { viteMockServe } from 'vite-plugin-mock'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDevelopment = mode === 'development'
  return {
    base: isDevelopment ? '/' : '/app/',
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
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    ],
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        connect-src 'self' https://api.kynance.cn;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
      `
        .replace(/\s{2,}/g, ' ')
        .trim(),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: process.env.VITE_ENV === 'development', // 开启生产环境的 sourcemap
      // rollupOptions: {
      //   plugins: [
      //     visualizer({
      //       filename: 'stats.html', // 默认在项目根目录下生成stats.html文件，可自定义
      //       open: true, //生成后自动打开浏览器查看
      //     }),
      //   ],
      // },
    },
    server: {
      port: 3005,
      host: '0.0.0.0',
    },
  }
})
