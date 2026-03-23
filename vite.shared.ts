import type { UserConfig } from 'vite';

/**
 * Delt Vite-konfigurasjon for alle pakker i monorepoet.
 * Importer og bruk med mergeConfig() i pakke-spesifikke vite.config.ts.
 *
 * build.target holdes synkronisert med .browserslistrc (since 2022-03).
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
        target: ['edge99', 'firefox98', 'chrome99', 'safari15.4']
    }
};
