import fs from 'fs';
import path from 'path';
import { buildCssColors } from './css.js';

const tokensPath = '../indeks-tokens/tokens/colors';

const files = {
    primitive: 'from-code/01 Theme.SpareBank1.json',
    semanticLight: 'from-figma/02 Semantic colors.Light.json',
    semanticDark: 'from-figma/02 Semantic colors.Dark.json',
};

function filePath(filename) {
    return path.resolve(tokensPath, filename);
}

function loadColorsFromTokens(fileName, referenceDict) {
    const colorDict = {};
    const jsonContent = JSON.parse(fs.readFileSync(filePath(fileName), 'utf8').replaceAll('-', '.').toLowerCase());
    const processColorTokens = (obj, prefix = '') => {
        for (const [key, value] of Object.entries(obj)) {
            if (value.$type === 'color') {
                const cssVarName = `${prefix}${key}`;
                if (!referenceDict) {
                    colorDict[cssVarName] = value.$value;
                } else {
                    let colorValue = referenceDict[value.$value.slice(1, -1)];
                    if (!colorValue) {
                        colorValue = value.$value; //legg til hvis hex verdi
                    }
                    colorDict[cssVarName] = colorValue;
                }
            } else if (typeof value === 'object') {
                processColorTokens(value, `${prefix}${key}.`);
            }
        }
    };
    processColorTokens(jsonContent);
    return colorDict;
}

function buildColorDict() {
    const primitiveColors = loadColorsFromTokens(files.primitive);
    const semanticLightColors = loadColorsFromTokens(files.semanticLight, primitiveColors);
    const semanticDarkColors = loadColorsFromTokens(files.semanticDark, primitiveColors);

    return {
        light: semanticLightColors,
        dark: semanticDarkColors,
    };
}

function buildSemanticColors() {
    const colorDict = buildColorDict();
    buildCssColors(colorDict);
}

export { buildColorDict, buildSemanticColors, loadColorsFromTokens };
