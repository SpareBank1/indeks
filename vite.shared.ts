import type { UserConfig } from 'vite';

/**
 * Delt Vite-konfigurasjon for alle pakker i monorepoet.
 * Importer og bruk med mergeConfig() i pakke-spesifikke vite.config.ts.
 *
 * build.target holdes synkronisert manuelt med .browserslistrc.
 * esbuild leser ikke browserslist, så listen må vedlikeholdes to steder.
 *
 * Merk: lightningcss (brukt for CSS-minifisering i indeks-eksempel) støtter
 * bare chrome/edge/firefox/ios/safari/opera — Samsung Internet og Android-
 * varianter er ikke gyldige targets her. Samsung Internet er Chromium-basert,
 * så chrome100 dekker den nedre grensen uansett.
 *
 * @example
 * import { mergeConfig } from 'vite';
 * import { sharedConfig } from '../vite.shared.js';
 *
 * export default mergeConfig(sharedConfig, {
 *   // pakke-spesifikk config
 * });
 */
export const sharedConfig: UserConfig = {
    build: {
        target: ['chrome100', 'edge100', 'firefox100', 'safari15.4', 'ios15.4']
    }
};
