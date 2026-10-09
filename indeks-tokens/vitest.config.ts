import { defineConfig } from 'vitest/config';

/* Alt kjører som standard; det som ikke kan kjøre, må unntas her med en grunn. */
export default defineConfig({
    test: {
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.build/**',
            /* Feiler eller laster ikke i vitest. Se https://github.com/SpareBank1/indeks/issues/259 */
            'scripts/figma-api/token_export.spec.tsx',
            'scripts/figma-api/token_import.spec.tsx',
        ],
    },
});
