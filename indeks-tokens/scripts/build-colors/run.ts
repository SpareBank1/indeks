// Kjernelogikk for fargebygging — delt mellom det interne tsx-entrypointet
// (index.ts) og det publiserte CLI-entrypointet (cli.ts).

import { themes } from '../../themes';
import { buildTheme } from './buildThemeColors';
import { buildFigmaColors } from './figma';
import dark from '../../tokens/colors/from-figma/02 Semantic colors.Dark.json';
import light from '../../tokens/colors/from-figma/02 Semantic colors.Light.json';
import { buildSemanticColors } from './buildSemanticColors';
import { buildWebColors } from './web';
import { buildAndroidColors } from './mobile/android';
import { resolveSemanticColorsToTheme } from './resolveSemanticColors';
import { buildIosColors } from './mobile/ios';
import { loadTheme } from './loadTheme';

const USAGE = 'Usage: build-colors platform=<figma|web|android|ios> path=<output-path> [theme=<theme-file-path>]';

/**
 * Bygg fargetokens for én plattform ut fra parsede `key=value`-argumenter.
 * Deles av index.ts (tsx-intern) og cli.ts (publisert bin).
 */
export async function runBuildColors(argMap: Record<string, string>): Promise<void> {
    const platform = argMap['platform'];
    const outPath = argMap['path'];
    const themeArg = argMap['theme'];

    console.log(`Building colors for platform: ${platform}, output path: ${outPath}`);

    if (!platform || !outPath) {
        console.error(USAGE);
        process.exit(1);
    }

    // Med theme= brukes det ene themet for alle plattformer. Uten, brukes alle
    // innebygde themes (relevant for figma/web som kan bygge flere).
    const builtThemes = themeArg ? [buildTheme(await loadTheme(themeArg))] : themes.map(buildTheme);

    if (platform === 'figma') {
        buildFigmaColors(builtThemes, outPath);
    }

    if (platform === 'web') {
        const builtSemanticColors = buildSemanticColors(light, dark);
        buildWebColors(builtThemes, builtSemanticColors, outPath);
    }

    if (platform === 'android') {
        const builtSemanticColors = buildSemanticColors(light, dark);
        const resolvedColors = resolveSemanticColorsToTheme(builtSemanticColors, builtThemes[0]);
        buildAndroidColors(outPath, resolvedColors);
    }

    if (platform === 'ios') {
        const builtSemanticColors = buildSemanticColors(light, dark);
        const resolvedColors = resolveSemanticColorsToTheme(builtSemanticColors, builtThemes[0]);
        buildIosColors(outPath, resolvedColors);
    }
}

export { USAGE };
