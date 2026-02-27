import compat from 'eslint-plugin-compat';
import { browserslist } from './browserslist.config.js';

/**
 * Delt ESLint-konfigurasjon for browser-kompatibilitet.
 * Importeres i pakke-spesifikke eslint.config.js.
 *
 * @example
 * import { compatConfig } from '../eslint.shared.js';
 *
 * export default [
 *     compatConfig,
 *     // ... andre configs
 * ];
 */
export const compatConfig = {
    plugins: { compat },
    rules: {
        'compat/compat': 'error'
    },
    settings: {
        browsers: browserslist,
        polyfills: [
            // Legg til polyfills her hvis dere bruker noen
            // 'Promise',
            // 'fetch',
        ]
    }
};
