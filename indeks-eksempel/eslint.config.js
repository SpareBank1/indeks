// TODO: legg til eslint-plugin-react-hooks igjen når den støtter ESLint 10
// import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { baseConfig } from '../eslint.shared.js';

export default [
    { ignores: ['dist'] },
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
];
