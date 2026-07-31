import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { Theme } from '../../themes/types';
import { sb1 } from '../../themes/sb1';

/**
 * Last theme — enten fra en JSON-fil (konsumentens eget theme) eller default sb1.
 *
 * Konsumentens theme er en ren `.json`-fil som matcher `Theme`-formen (se docs).
 * JSON velges bevisst framfor `.ts` slik at det publiserte CLI-et kan laste det
 * uten en TypeScript-runtime (tsx) hos konsumenten.
 */
export async function loadTheme(themeArg?: string): Promise<Theme> {
    if (!themeArg || themeArg === 'sb1') {
        console.log('Using default sb1 theme');
        return sb1;
    }

    // Ser argumentet ut som en filsti? Prøv å laste JSON-filen.
    if (themeArg.includes('.') || themeArg.includes('/')) {
        const themePath = resolve(process.cwd(), themeArg);
        console.log(`Loading custom theme from: ${themePath}`);

        let customTheme: Theme;
        try {
            customTheme = JSON.parse(readFileSync(themePath, 'utf-8')) as Theme;
        } catch (error) {
            console.error(`Failed to load theme from ${themeArg}:`, error);
            process.exit(1);
        }

        if (!customTheme || !customTheme.colors) {
            console.error(`Invalid theme file: ${themePath}. Must be JSON with a "colors" object.`);
            process.exit(1);
        }

        console.log(`Loaded custom theme: ${customTheme.name || 'unnamed'}`);
        return customTheme;
    }

    // Fallback til sb1 hvis argumentet ikke er gjenkjennelig.
    console.log('Theme not recognized, using default sb1 theme');
    return sb1;
}
