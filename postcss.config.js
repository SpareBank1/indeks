import postcssCdnImports from './postcss-cdn-imports.js';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default ({ env }) => {
    const isCdn = env === 'cdn';

    return {
        plugins: [
            // Replace package imports with CDN URLs (only when --env cdn)
            postcssCdnImports({
                cdnBaseUrl: '/indeks',
                enabled: isCdn,
            }),

            // Resolves @import statements
            postcssImport({
                filter: (path) => {
                    // When building for CDN, skip resolving CDN URLs (they should remain as external imports)
                    if (isCdn && path.startsWith('/indeks/')) {
                        return false; // Skip CDN URLs
                    }
                    // When building for npm, skip package imports (keep them as @import for consumer's bundler)
                    if (!isCdn && path.startsWith('@sb1/')) {
                        return false; // Skip package imports - let consumer resolve them
                    }
                    return true; // Process local file imports only
                },
            }),

            // Converts modern CSS to browser-compatible CSS based on .browserslistrc
            // stage: 2 enables widely supported features like nesting
            postcssPresetEnv({
                stage: 2,
            }),

            // Adds vendor prefixes based on .browserslistrc
            autoprefixer(),

            // Minifies CSS (removes whitespace, comments, optimizes values)
            cssnano({
                preset: [
                    'default',
                    {
                        discardComments: {
                            removeAll: true,
                        },
                    },
                ],
            }),
        ],
    };
};
