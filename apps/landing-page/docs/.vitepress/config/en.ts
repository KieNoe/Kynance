import { defineConfig } from 'vitepress';
import pkg from '../../../package.json';

export const en = defineConfig({
  lang: 'en',
  description: 'A professional stock data visualization analysis platform',
  themeConfig: {
    editLink: {
      pattern: '',
      text: 'Edit this page on GitHub',
    },
    nav: [
      { text: 'Home', link: '/en/' },
      { text: 'Examples', link: '/en/markdown-examples' },
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
      '/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/en/markdown-examples' },
            { text: 'Runtime API Examples', link: '/en/api-examples' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/KieNoe/Kynance' }],
    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2025-present KieNoe',
    },
  },
});
