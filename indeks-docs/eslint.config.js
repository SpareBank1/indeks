import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { compatConfig } from '../eslint.shared.js';

export default tseslint.config(
    { ignores: ['build', '.docusaurus'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
    compatConfig,
);
