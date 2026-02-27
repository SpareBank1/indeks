import type { UserConfig } from 'vite';
import { esbuildTargets } from './browserslist.config.js';

/**
 * Delt Vite-konfigurasjon for alle pakker i monorepoet.
 * Importer og bruk med mergeConfig() i pakke-spesifikke vite.config.ts.
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
        target: esbuildTargets
    }
};
