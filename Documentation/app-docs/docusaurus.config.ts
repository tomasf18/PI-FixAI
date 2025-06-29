import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AI-Powered Platform for Smart City Issue Detection & Resolution',
  favicon: 'img/logo-small-noback.png',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  url: 'https://pi-2024-2025-nap.github.io/',
  baseUrl: '/Documentation/',
  organizationName: 'PI-2024-2025-NAP', // Usually your GitHub org/user name.
  projectName: 'Documentation', // Usually your repo name.
  trailingSlash: false, // Set to true if needed

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/PI-2024-2025-NAP',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'Our Site Logo',
        src: 'img/logo-noback.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: '#',
          label: 'Our Website',
          position: 'right',
        },
        {
          href: 'https://github.com/PI-2024-2025-NAP',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://github.com/orgs/PI-2024-2025-NAP/projects/1/views/13',
          label: 'Backlog',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `FixAI Copyright © ${new Date().getFullYear()}`,   
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
