import { flattenObject } from '../utils';
import { BuiltTheme, BuiltThemeColors } from '../../themes/types';

type ColorSet = Record<string, string>;

interface SemanticColors {
    light: any;
    dark: any;
}

interface ResolvedColors {
    light: ColorSet;
    dark: ColorSet;
}

function resolveAndFlatten(semanticColors: any, themeColors: BuiltThemeColors): ColorSet {
    const flattenedSemantic = flattenObject<string>(semanticColors);
    const flattenedTheme = flattenObject<string>(themeColors);

    const resolved: ColorSet = {};
    for (const [key, colorRef] of Object.entries(flattenedSemantic)) {
        if (!flattenedTheme[colorRef]) {
            console.warn(`Color reference ${colorRef} not found in theme colors.`);
        }
        resolved[key] = flattenedTheme[colorRef] || colorRef;
    }

    return resolved;
}

export function resolveSemanticColorsToTheme(semanticColors: SemanticColors, theme: BuiltTheme): ResolvedColors {
    console.log(theme);
    return {
        light: resolveAndFlatten(semanticColors.light, theme.colors),
        dark: resolveAndFlatten(semanticColors.dark, theme.colors),
    };
}
