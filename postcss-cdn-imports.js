import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * PostCSS plugin to replace package imports with CDN URLs
 * Replaces @import '@sb1/package' with @import 'https://cdn.example.com/@sb1/package@version/index.css'
 */
export default function postcssCdnImports(opts = {}) {
    const { cdnBaseUrl = '/', enabled = false } = opts;

    return {
        postcssPlugin: 'postcss-cdn-imports',
        Once(root, { result }) {
            if (!enabled) {
                return; // Skip if not enabled (for local dev)
            }

            root.walkAtRules('import', (rule) => {
                const importValue = rule.params.replace(/['"]/g, '');

                // Check if it's a package import (not relative path)
                if (importValue.startsWith('@sb1/')) {
                    try {
                        // Try multiple possible locations for the package
                        const possiblePaths = [
                            // pnpm structure
                            resolve(__dirname, 'node_modules', '.pnpm', 'node_modules', importValue, 'package.json'),
                            // standard structure
                            resolve(__dirname, 'node_modules', importValue, 'package.json'),
                            // workspace package (follow symlink and read package.json)
                            resolve(__dirname, importValue.replace('@sb1/indeks-', 'indeks-'), 'package.json'),
                        ];

                        let packageJson;
                        let packageJsonPath;
                        for (const path of possiblePaths) {
                            try {
                                packageJson = JSON.parse(readFileSync(path, 'utf-8'));
                                packageJsonPath = path;
                                break;
                            } catch (e) {
                                // Try next path
                            }
                        }

                        if (!packageJson) {
                            throw new Error('Could not find package.json');
                        }

                        const version = packageJson.version;

                        // Extract package name: @sb1/indeks-tokens -> tokens
                        const packageShortName = importValue.replace('@sb1/indeks-', '');

                        // Replace with CDN URL: https://cdn.sparebank1.no/indeks/tokens/0.0.2/index.css
                        const cdnUrl = `${cdnBaseUrl}/${packageShortName}/${version}/index.css`;
                        rule.params = `'${cdnUrl}'`;

                        result.messages.push({
                            type: 'cdn-import',
                            plugin: 'postcss-cdn-imports',
                            text: `Replaced ${importValue} with ${cdnUrl}`,
                        });
                    } catch (error) {
                        console.warn(`Could not resolve version for ${importValue}:`, error.message);
                    }
                }
            });
        },
    };
}

postcssCdnImports.postcss = true;
