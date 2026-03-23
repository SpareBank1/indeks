import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import compat from 'eslint-plugin-compat';

/**
 * Delt ESLint-konfigurasjon for browser-kompatibilitet.
 * Del av baseConfig — eksporteres separat for bruk i pakker som ikke
 * bruker baseConfig men trenger compat-sjekk.
 *
 * Leser browsertargets automatisk fra .browserslistrc i roten.
 */
export const compatConfig = {
    plugins: { compat },
    rules: {
        'compat/compat': 'error'
    },
    settings: {
        polyfills: [
            // Legg til polyfills her hvis dere bruker noen
            // 'Promise',
            // 'fetch',
        ]
    }
};

/**
 * Delt ESLint-basiskonfigurasjon for alle TypeScript-pakker i monorepoet.
 * Inkluderer JS/TS recommended-regler, browser-globals og compat-sjekk.
 *
 * Spread inn i pakke-spesifikke eslint.config.js og legg til egne regler:
 *
 * @example
 * import { baseConfig } from '../eslint.shared.js';
 *
 * export default tseslint.config(
 *     { ignores: ['dist'] },
 *     ...baseConfig,
 *     // pakke-spesifikke regler her
 * );
 */
// Plain array — ingen tseslint.config()-wrapper nødvendig.
// extends-nøkkelen i config-objekter er en tseslint.config()-spesifikk
// forkortelse; her sprer vi configs eksplisitt i stedet.
export const baseConfig = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
    compatConfig,
];
