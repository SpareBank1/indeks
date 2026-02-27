import { pathToFileURL } from 'url';
import { resolve } from 'path';
import type { Theme } from '../../themes/types';
import { sb1 } from '../../themes/sb1';

/**
 * Load theme - either from file path or use default sb1
 */
export async function loadTheme(themeArg?: string): Promise<Theme> {
    if (!themeArg || themeArg === 'sb1') {
        console.log('Using default sb1 theme');
        return sb1;
    }

    // If theme arg looks like a file path (contains . or /), try to load it
    if (themeArg.includes('.') || themeArg.includes('/')) {
        try {
            const themePath = resolve(process.cwd(), themeArg);
            console.log(`Loading custom theme from: ${themePath}`);
            const themeModule = await import(pathToFileURL(themePath).href);

            // Try to find the theme export (could be default export or named export)
            const customTheme = themeModule.default || themeModule[Object.keys(themeModule)[0]];

            if (!customTheme || !customTheme.colors) {
                console.error(`Invalid theme file: ${themePath}. Must export a Theme object with colors.`);
                process.exit(1);
            }

            console.log(`Loaded custom theme: ${customTheme.name || 'unnamed'}`);
            return customTheme;
        } catch (error) {
            console.error(`Failed to load theme from ${themeArg}:`, error);
            process.exit(1);
        }
    }

    // Fallback to sb1 if no valid theme specified
    console.log('Theme not recognized, using default sb1 theme');
    return sb1;
}
