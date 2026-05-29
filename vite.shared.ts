import type { UserConfig } from 'vite';

/**
 * Delt Vite-konfigurasjon for alle pakker i monorepoet.
 * Importer og bruk med mergeConfig() i pakke-spesifikke vite.config.ts.
 *
 * build.target holdes synkronisert manuelt med .browserslistrc.
 * esbuild leser ikke browserslist, så listen må vedlikeholdes to steder.
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
        target: ['chrome100', 'edge100', 'firefox100', 'safari15.4', 'ios15.4', 'samsung17']
    }
};
