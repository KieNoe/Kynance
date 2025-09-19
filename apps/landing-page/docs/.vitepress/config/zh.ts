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
      { text: '主页', link: '/' },
      { text: '功能', link: '/feature' },
      { text: '行为规范', link: '/actions' },
      { text: '联系与支持', link: '/contact' },
      {
        text: `v${pkg.version}`,
        items: [
          {
            text: 'Changelog',
            link: '/CHANGELOG.md',
          },
        ],
      },
    ],
    sidebar: [
      {
        text: '技术相关',
        items: [
          { text: '技术展示页', link: '/technical' },
          { text: '未来计划', link: '/plan' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/KieNoe/Kynance' }],
    footer: {
      message: `基于 MIT 许可证发布 苏ICP备2025171457号-2`,
      copyright: '版权 © 2025-present KieNoe',
    },
  },
});
