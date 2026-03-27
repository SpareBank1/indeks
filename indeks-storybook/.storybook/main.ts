// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from '@storybook/react-vite';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
    stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [getAbsolutePath("@storybook/addon-docs"), getAbsolutePath("@storybook/addon-a11y")],
    framework: {
        name: getAbsolutePath("@storybook/react-vite"),
        options: {},
    },
    staticDirs: [],
    async viteFinal(config) {
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                '@sb1/indeks-css': resolve(__dirname, '../../indeks-css/css/index.css'),
                '@sb1/indeks-web': resolve(__dirname, '../../indeks-web/index.ts'),
                '@sb1/indeks-react': resolve(__dirname, '../../indeks-react/lib/main.ts'),
            };
        }
        return config;
    },
};
export default config;

function getAbsolutePath(value: string): string {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
