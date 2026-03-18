import { baseConfig } from '../eslint.shared.js';

export default [
    { ignores: ['build', '.docusaurus'] },
    ...baseConfig,
    {
        // Docusaurus-prosjektet har både TS og JS/JSX-filer (MDX, config, osv.)
        files: ['**/*.{ts,tsx,js,jsx}'],
    },
];
