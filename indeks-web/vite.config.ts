import { resolve } from 'path';
import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { sharedConfig } from '../vite.shared.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const isCdn = mode === 'cdn';

    return mergeConfig(sharedConfig, {
        plugins: isCdn
            ? []
            : [
                  dts({
                      include: ['lib', 'index.ts'],
                      exclude: ['**/*.test.ts'],
                      compilerOptions: {
                          allowImportingTsExtensions: false,
                      },
                  }),
              ],
        build: {
            lib: {
                entry: resolve(__dirname, 'index.ts'),
                formats: ['es'],
                fileName: 'index',
            },
            outDir: isCdn ? 'dist/cdn' : 'dist/npm',
            minify: isCdn,
            copyPublicDir: false,
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, 'lib'),
            },
        },
    });
});
