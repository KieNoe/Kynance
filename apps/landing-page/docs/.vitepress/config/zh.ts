import { defineConfig } from 'vitepress';
import pkg from '../../../package.json';

export const zh = defineConfig({
  lang: 'zh-CN',
  description: '一个专业级股票可视化分析平台',
  themeConfig: {
    editLink: {
      pattern: '',
      text: '在 GitHub 上编辑此页面',
    },
    nav: [
      { text: '主页', link: '/zh/' },
      { text: '例子', link: '/zh/markdown-examples' },
      {
        text: `v${pkg.version}`,
        items: [
          {
            text: 'Changelog',
            link: '',
          },
        ],
      },
    ],
    sidebar: {
      '/zh/': [
        {
          text: '例子',
          items: [
            { text: 'Markdown 例子', link: '/zh/markdown-examples' },
            { text: '运行时 API 例子', link: '/zh/api-examples' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/KieNoe/Kynance' }],
    footer: {
      message: '基于 MIT 许可证发布。',
      copyright: '版权 © 2025-present KieNoe',
    },
  },
});
