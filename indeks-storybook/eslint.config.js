import storybook from 'eslint-plugin-storybook';
import reactRefresh from 'eslint-plugin-react-refresh';
import { baseConfig } from '../eslint.shared.js';

export default [
    { ignores: ['dist', 'storybook-static'] },
    ...baseConfig,
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-refresh': reactRefresh,
        },
        rules: {
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
    ...storybook.configs['flat/recommended'],
];
