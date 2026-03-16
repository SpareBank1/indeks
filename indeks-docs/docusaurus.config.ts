import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { readFileSync } from 'fs';
import path from 'path';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Read version from indeks-css package.json
const indeksCssPackageJson = JSON.parse(readFileSync(path.resolve(__dirname, '../indeks-css/package.json'), 'utf-8'));
const cssVersion = indeksCssPackageJson.version;

const config: Config = {
    title: 'Indeks Designsystem',
    tagline:
        'Felles retningslinjer og komponenter som hjelper oss med å lage helhetlige, brukervennlige, inkluderende løsninger for kundene våre',
    favicon: 'img/favicon.ico',
    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: {
            useCssCascadeLayers: false,
        },
    },

    // Set the production url of your site here
    url: 'https://design.sparebank1.no',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'SpareBank1', // Usually your GitHub org/user name.
    projectName: 'indeks', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'no',
        locales: ['no'],
    },

    customFields: {
        cssVersion: cssVersion,
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/SpareBank1/indeks/tree/main/indeks-docs/',
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
            title: 'Indeks',
            logo: {
                alt: 'Indeks Designsystem Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'designSidebar',
                    position: 'left',
                    label: 'Dokumentasjon',
                },
                {
                    href: 'https://github.com/SpareBank1/indeks',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Fellesskap',
                    items: [
                        {
                            label: 'GitHub Issues',
                            href: 'https://github.com/SpareBank1/indeks/issues',
                        },
                        {
                            label: 'Slack (#ext-designsystem)',
                            href: 'https://slack.com/channels/ext-designsystem',
                        },
                        {
                            label: 'E-post',
                            href: 'mailto:designsystem@sparebank1.no',
                        },
                    ],
                },
                {
                    title: 'Mer',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/SpareBank1/indeks',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} SpareBank 1. Bygget med Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,

    plugins: [
        function webpackConfig() {
            return {
                name: 'custom-webpack-config',
                configureWebpack() {
                    return {
                        resolve: {
                            alias: {
                                '@sb1/indeks-css': path.resolve(__dirname, '../indeks-css/index.css'),
                                '@sb1/indeks-utils': path.resolve(__dirname, '../indeks-utils/index.css'),
                                '@sb1/indeks-react': path.resolve(__dirname, '../indeks-react/lib/main.ts'),
                            },
                        },
                    };
                },
            };
        },
    ],
};

export default config;
