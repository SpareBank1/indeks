import { defineConfig } from 'vite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(() => ({
    plugins: [react()],
    base: '/eksempel/',
    server: {
        fs: {
            // Allow serving files from workspace root
            allow: ['..'],
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            // Use source files in dev for fast HMR, built files for production
            '@sb1/indeks-react': resolve(__dirname, '../indeks-react/lib/main.ts'),
            '@sb1/indeks-css': resolve(__dirname, '../indeks-css/index.css'),
            '@sb1/indeks-utils': resolve(__dirname, '../indeks-utils/index.css'),
            // Ensure React imports resolve from node_modules during build
            react: resolve(__dirname, 'node_modules/react'),
            'react-dom': resolve(__dirname, 'node_modules/react-dom'),
            'react/jsx-runtime': resolve(__dirname, 'node_modules/react/jsx-runtime'),
        },
    },
}));
