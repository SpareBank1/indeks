// TODO: legg til eslint-plugin-react-hooks igjen når den støtter ESLint 10
// import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { baseConfig } from '../eslint.shared.js';

export default [
    { ignores: ['dist', 'storybook-static', 'sb1-indeks-react-*', 'plopfile.cjs'] },
    ...baseConfig,
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-refresh': reactRefresh,
        },
        rules: {
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-unused-vars': ['error', {
                varsIgnorePattern: '^_',
                argsIgnorePattern: '^_',
            }],
        },
    },
];
