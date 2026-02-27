#!/usr/bin/env node
import fs from 'fs';

function transformToCSSUtilityClass(name) {
    const value = name.replaceAll('.', '-');
    const utilClassName = value.replaceAll('-passive', '');

    if (name.includes('foreground')) {
        return `.ix-${utilClassName} {
            color: var(--ix-${value});
        }`;
    }

    return `.ix-${utilClassName} {
        background-color: var(--ix-${value});
    }`;
}

function generateCssColorFileContent(colors) {
    return `
/* Generated from Figma tokens */

${Object.entries(colors.light)
    .filter(
        ([name]) =>
            !name.includes('hover') &&
            !name.includes('-active') /* legger til "-" for å unngå å filtrere ut "interactive"*/ &&
            !name.includes('component') &&
            !name.includes('border')
    )
    .map(([name]) => transformToCSSUtilityClass(name))
    .join('\n')}
`;
}

function buildCssColors(colors) {
    const content = generateCssColorFileContent(colors);
    fs.writeFileSync('.build/css/colors.css', content);
}

export { buildCssColors };
