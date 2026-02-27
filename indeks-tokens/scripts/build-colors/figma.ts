import { writeFileSyncEnsureDir } from '../../../shared/tokens/utils.ts';
import { BuiltTheme } from '../../themes/types';

export function buildFigmaColors(themes: BuiltTheme[], outPath: string) {
    for (const theme of themes) {
        if (!['sb1', 'kredittbanken'].includes(theme.name)) continue;
        const themeOutPath = `${outPath}/01 Theme.${theme.figmaName}.json`;
        console.log(`Eksporterer Figma farger for theme ${theme.name} til ${themeOutPath}`);
        const figmaJson = buildFigmaJson(theme);
        // Skriv figmaJson til themeOutPath
        writeFileSyncEnsureDir(themeOutPath, JSON.stringify(figmaJson, null, 2));
    }
}

function buildFigmaJson(theme: BuiltTheme) {
    const figmaJson: { color: Record<string, any> } = { color: {} };
    theme.colors &&
        Object.entries(theme.colors).forEach(([colorName, colorScale]) => {
            figmaJson.color[colorName] = {};
            Object.entries(colorScale).forEach(([step, colorValue]) => {
                figmaJson.color[colorName][step] = {
                    $type: 'color',
                    $value: colorValue,
                };
            });
        });
    return figmaJson;
}
