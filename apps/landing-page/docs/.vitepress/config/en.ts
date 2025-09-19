import { defineConfig } from 'vitepress';
import pkg from '../../../package.json';

export const en = defineConfig({
  lang: 'en',
  description: 'A professional-grade stock visualization and analysis platform',
  themeConfig: {
    editLink: {
      pattern: '',
      text: 'Edit this page on GitHub',
    },
    nav: [
      { text: 'Home', link: '/en/' },
      { text: 'Features', link: '/en/feature' },
      { text: 'Code of Conduct', link: '/en/actions' },
      { text: 'Contact & Support', link: '/en/contact' },
      {
        text: `v${pkg.version}`,
        items: [
          {
            text: 'Changelog',
            link: '/en/CHANGELOG.md',
          },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Technical',
        items: [
          { text: 'Technical Showcase', link: '/en/technical' },
          { text: 'Plans', link: '/en/plan' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/KieNoe/Kynance' }],
    footer: {
      message: `Released under the MIT License 苏ICP备2025171457号-2`,
      copyright: 'Copyright © 2025-present KieNoe',
    },
  },
});
