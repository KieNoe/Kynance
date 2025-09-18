import { defineConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';

export const shared = defineConfig({
  title: 'Kynance',
  rewrites: {
    'zh/:rest*': ':rest*',
  },
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh' }],
    ['meta', { property: 'og:title', content: '文档标题' }],
    ['meta', { property: 'og:site_name', content: '文档标题' }],
    ['meta', { property: 'og:image', content: '/logo.png' }],
  ],
  themeConfig: {
    logo: '/LOGO.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/kienoe' }],
    search: {
      provider: 'local',
    },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  vite: {
    plugins: [llmstxt() as any],
  },
});
