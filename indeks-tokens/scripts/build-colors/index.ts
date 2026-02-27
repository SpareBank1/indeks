// ESM module entry point for build-colors-v2
// Accepts CLI arguments: platform and path

import { themes } from '../../themes';
import { buildTheme } from './buildThemeColors';
import { buildFigmaColors as buildFigmaColors } from './figma';
import dark from '../../tokens/colors/from-figma/02 Semantic colors.Dark.json';
import light from '../../tokens/colors/from-figma/02 Semantic colors.Light.json';
import { buildSemanticColors } from './buildSemanticColors';
import { buildWebColors } from './web';
import { buildAndroidColors } from './mobile/android';
import { resolveSemanticColorsToTheme } from './resolveSemanticColors';
import { buildIosColors } from './mobile/ios';
import { loadTheme } from './loadTheme';

// Parse CLI arguments
const args = process.argv.slice(2);
const argMap: Record<string, string> = {};
for (const arg of args) {
    const [key, value] = arg.split('=');
    if (key && value) {
        argMap[key] = value;
    }
}

const platform = argMap['platform'];
const outPath = argMap['path'];
const themeArg = argMap['theme'];

console.log(`Building colors for platform: ${platform}, output path: ${outPath}`);

if (!platform || !outPath) {
    console.error('Usage: node index.js platform=<platform> path=<output-path> [theme=<theme-file-path>]');
    process.exit(1);
}

// Main execution
(async () => {
    // If theme is specified, use it for all platforms. Otherwise use all themes for figma/web.
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
})();
