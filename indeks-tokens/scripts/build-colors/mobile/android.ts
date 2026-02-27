import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSyncEnsureDir } from '../../../../shared/tokens/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const removeHash = (value: string) => (value.startsWith('#') ? value.slice(1) : value);
const cssHexToAndroidHex = (str: string) => str.slice(-2) + str.slice(0, -2);

function transformToAndroidHex(value: string): string {
    value = removeHash(value).toUpperCase();
    if (value.length === 6) {
        return `0xFF${value}`;
    } else if (value.length === 8) {
        return `0x${cssHexToAndroidHex(value)}`;
    } else {
        throw new Error(`Invalid color value: ${value}. Expected 6 or 8 characters (with or without #).`);
    }
}

function transformToAndroidColorName(name: string): string {
    return name
        .split('.')
        .map((part, idx) => (idx === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
        .join('');
}

export type ColorSet = Record<string, string>;

interface Colors {
    light: ColorSet;
    dark: ColorSet;
}

function generateAndroidColorFileContent(colors: Colors): string {
    const packageJsonPath = join(__dirname, '../../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version;

    return `
/* Generated from Figma tokens */
/* Fargene er bygget fra Indeks Tokens versjon: ${version} */

object Colors {

    object LightDefault {
        ${Object.entries(colors.light)
            .map(([name, value]) => `val ${transformToAndroidColorName(name)} = Color(${transformToAndroidHex(value)})`)
            .join('\n')}
    }

    object DarkDefault {
        ${Object.entries(colors.dark)
            .map(([name, value]) => `val ${transformToAndroidColorName(name)} = Color(${transformToAndroidHex(value)})`)
            .join('\n')}
    }
}


`;
}

export function buildAndroidColors(path: string, colors: Colors): void {
    const filePath = `${path}/Colors.kt`;
    writeFileSyncEnsureDir(filePath, generateAndroidColorFileContent(colors));
}

export { transformToAndroidColorName, generateAndroidColorFileContent, transformToAndroidHex };
