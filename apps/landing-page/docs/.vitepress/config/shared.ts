import { defineConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';

export const shared = defineConfig({
  title: 'Kynance',
  rewrites: {
    'en/:rest*': ':rest*',
  },
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: '文档标题' }],
    ['meta', { property: 'og:site_name', content: '文档标题' }],
    ['meta', { property: 'og:image', content: '/logo.png' }],
  ],
  themeConfig: {
    logo: '/LOGO.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/kieranwv' }],
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
    plugins: [
      llmstxt({
        generateLLMsFullTxt: false, //禁用文件的生成llms-full.txt
        ignoreFiles: ['sponsors/*'],
        customLLMsTxtTemplate: `# {title}\n\n{foo}`,
        title: 'Kynance',
        customTemplateVariables: {
          foo: 'bar',
        }, //使用文件的自定义模板llms.txt
        experimental: {
          depth: 2, // 在根目录和所有第一级子目录中生成llms.txt和文件，每个目录仅包含来自该特定目录及其子目录的文件
        },
      }) as any,
    ],
  },
});
