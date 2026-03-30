import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { sharedConfig } from '../vite.shared.js';

// https://vite.dev/config/
export default mergeConfig(sharedConfig, {
    plugins: [
        react(),
        dts({
            include: ['lib'],
            exclude: ['**/*.test.ts', '**/*.test.tsx'],
            compilerOptions: {
                allowImportingTsExtensions: false,
            },
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            formats: ['es'],
            fileName: 'main',
        },
        copyPublicDir: false,
        rollupOptions: {
            // Standard library practice: externalize all React imports
            external: ['react', 'react-dom', 'react/jsx-runtime'],
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'lib'),
            '@sb1/indeks-css': resolve(__dirname, '../indeks-css'),
        },
    },
});
