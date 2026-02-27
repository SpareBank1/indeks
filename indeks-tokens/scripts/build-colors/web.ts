import { writeFileSyncEnsureDir } from '../../../shared/tokens/utils.ts';
import { themeableDefaults } from '../../themes/themeables';
import { BuiltTheme, ThemeableProperties } from '../../themes/types';
import { flattenObject } from '../utils';

export function buildWebColors(themes: BuiltTheme[], semanticColors: any, outPath: string) {
    // Build color variables for all themes
    const themeColorsDict = buildThemeColorsDict(themes);

    // Write each theme file
    for (const theme of themes) {
        const themeOutPath = `${outPath}/themes/${theme.name}.css`;
        console.log(`Eksporterer css farger for theme ${theme.name} til ${themeOutPath}`);
        const themeCss = buildCompleteTheme(themeColorsDict[theme.name], theme.themeable);
        writeFileSyncEnsureDir(themeOutPath, themeCss);
    }

    const semanticOutPath = `${outPath}/colors.css`;
    console.log(`Eksporterer semantiske farger til ${semanticOutPath}`);
    writeFileSyncEnsureDir(semanticOutPath, buildSemanticColorsCss(semanticColors));
}

function buildThemeColorsDict(themes: BuiltTheme[]): Record<string, string> {
    const colorsDict: Record<string, string> = {};

    for (const theme of themes) {
        let colorVars = '';
        if (theme.colors) {
            Object.entries(theme.colors).forEach(([colorName, colorScale]) => {
                Object.entries(colorScale).forEach(([step, colorValue]) => {
                    colorVars += `  --ii-primitive-${colorName}-${step}: ${colorValue};\n`;
                });
            });
        }
        colorsDict[theme.name] = colorVars;
    }

    return colorsDict;
}

function buildThemeableVariables(themeable: ThemeableProperties): string {
    let vars = '';

    // Font families
    if (themeable['font-family']) {
        Object.entries(themeable['font-family']).forEach(([key, value]) => {
            if (value) {
                vars += `  --ix-font-family-${key}: ${value};\n`;
            }
        });
    }

    // Font weights
    if (themeable['font-weight']) {
        Object.entries(themeable['font-weight']).forEach(([key, value]) => {
            if (value !== undefined) {
                vars += `  --ix-font-weight-${key}: ${value};\n`;
            }
        });
    }

    // Border radius
    if (themeable.border?.radius) {
        Object.entries(themeable.border.radius).forEach(([key, value]) => {
            if (value !== undefined) {
                vars += `  --ix-border-radius-${key}: ${value};\n`;
            }
        });
    }

    return vars;
}

function buildCompleteTheme(colorVars: string, themeThemeable: ThemeableProperties): string {
    let cssContent = `:root, :host {\n`;

    // Add color variables
    cssContent += colorVars;

    // Merge defaults with theme-specific overrides
    const mergedThemeable = mergeThemeableProperties(themeableDefaults, themeThemeable);

    // Build and add themeable variables from merged result
    cssContent += buildThemeableVariables(mergedThemeable);

    cssContent += `}\n`;
    return cssContent;
}

function mergeThemeableProperties(defaults: ThemeableProperties, overrides?: ThemeableProperties): ThemeableProperties {
    return {
        'font-family': {
            ...defaults['font-family'],
            ...overrides?.['font-family'],
        },
        'font-weight': {
            ...defaults['font-weight'],
            ...overrides?.['font-weight'],
        },
        border: {
            radius: {
                ...defaults.border?.radius,
                ...overrides?.border?.radius,
            },
        },
    };
}

function buildSemanticColorsCss(semanticColors: any) {
    const light = flattenObject<string>(semanticColors.light);
    const dark = flattenObject<string>(semanticColors.dark);

    const lightVars = Object.entries(light)
        .map(([name, value]) => `  ${toCssCustomProperty(name)}: ${toPrimitiveVar(value)};`)
        .join('\n');

    const darkVars = Object.entries(dark)
        .map(([name, value]) => `  ${toCssCustomProperty(name)}: ${toPrimitiveVar(value)};`)
        .join('\n');

    return `
:root, :host, .ix-light-mode {
${lightVars}
}
@media (prefers-color-scheme: dark) {
    .regard-color-scheme-preference {
${darkVars}
    }
}
.ix-dark-mode {
${darkVars}
}`;
}

function toCssCustomProperty(name: string): string {
    return `--ix-color-${name.replace(/\./g, '-')}`;
}

function toPrimitiveVar(value: string): string {
    // If the value is a direct color (hex, rgb, etc.), return it as-is
    if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
        return value;
    }
    // Otherwise, it's a reference to a primitive variable
    return `var(--ii-primitive-${value.replace(/\./g, '-')})`;
}
