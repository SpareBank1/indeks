#!/usr/bin/env node

/* Finner var(--navn) i CSS-kilden vår der --navn aldri defineres noe sted.
 *
 * En var() som peker på et navn som ikke finnes, feiler stille. Deklarasjonen
 * blir ugyldig ved beregning av verdien, og egenskapen faller til arv eller
 * initialverdi — uten konsollfeil og uten at stylelint sier noe. Resultatet ser
 * ofte nesten riktig ut, som er grunnen til at slike feil overlever lenge: da
 * denne sjekken ble skrevet lå det tre i indeks-css, og to av dem så
 * tilforlatelige ut fordi arvet farge tilfeldigvis var nær den dempede.
 *
 * Kjøres fra `lint` i indeks-css og indeks-utils, og dermed også i CI via
 * `turbo run lint`.
 *
 * Bruk: node ../scripts/check-css-variables.js <mappe...>
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

/* Et navn kan defineres i én pakke og brukes i en annen, så settet av gyldige
   navn er alltid hele workspacet — uavhengig av hvilken pakke som lintes. Ellers
   ville --ix-border-default, som bor i utils og brukes i css, blitt falsk feil. */
const DEFINITION_SOURCES = [
    // Generert fra indeks-tokens/tokens/**. Her bor --ix-color-*, --ix-spacing-*
    // og resten av skalaene. Må være bygget; se sjekken lenger ned.
    'indeks-tokens/dist/index.css',
    // Sammensatte navn som --ix-border-default og --ix-outline-default.
    'indeks-utils/css',
    'indeks-css/css',
];

const TOKENS_BUNDLE = 'indeks-tokens/dist/index.css';

function findWorkspaceRoot(from) {
    let dir = resolve(from);
    while (!existsSync(join(dir, 'pnpm-workspace.yaml'))) {
        const parent = dirname(dir);
        if (parent === dir) throw new Error('Fant ikke pnpm-workspace.yaml oppover fra ' + from);
        dir = parent;
    }
    return dir;
}

function cssFilesIn(target) {
    if (!existsSync(target)) return [];
    if (statSync(target).isFile()) return target.endsWith('.css') ? [target] : [];

    return readdirSync(target, { withFileTypes: true }).flatMap((entry) =>
        cssFilesIn(join(target, entry.name)),
    );
}

/* Kommentarer byttes mot mellomrom, ikke fjernes: da holder linje- og
   kolonnenummer seg til det som faktisk står i filen. */
function withoutComments(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '));
}

function definitionsIn(css) {
    return Array.from(withoutComments(css).matchAll(/(--[A-Za-z0-9_-]+)\s*:/g), (m) => m[1]);
}

function usagesIn(css) {
    const source = withoutComments(css);
    const lineStarts = [0];
    for (let i = 0; i < source.length; i++) {
        if (source[i] === '\n') lineStarts.push(i + 1);
    }

    const found = [];
    for (const match of source.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)\s*([,)])/g)) {
        /* var(--x, fallback) er ikke en feil selv om --x ikke finnes: fallbacken
           er nettopp forfatterens håndtering av at navnet kan være usatt. Det er
           mønsteret for knotter konsumenter eller JS setter, som
           --ix-icon-badge-size og --_arrow-x. */
        if (match[2] === ',') continue;

        let line = lineStarts.findIndex((start) => start > match.index);
        line = line === -1 ? lineStarts.length : line;
        found.push({
            name: match[1],
            line,
            column: match.index - lineStarts[line - 1] + 1,
        });
    }
    return found;
}

const root = findWorkspaceRoot(process.cwd());
const targets = process.argv.slice(2);

if (targets.length === 0) {
    console.error('Bruk: node scripts/check-css-variables.js <mappe...>');
    process.exit(2);
}

if (!existsSync(join(root, TOKENS_BUNDLE))) {
    console.error(
        `Fant ikke ${TOKENS_BUNDLE}. Den er generert, og uten den vet ikke sjekken\n` +
            'hvilke --ix-navn som finnes. Kjør `pnpm --filter @sb1/indeks-tokens run build` først.',
    );
    process.exit(2);
}

const defined = new Set(
    DEFINITION_SOURCES.flatMap((source) => cssFilesIn(join(root, source))).flatMap((file) =>
        definitionsIn(readFileSync(file, 'utf8')),
    ),
);

const problems = [];
for (const file of targets.flatMap((target) => cssFilesIn(resolve(target)))) {
    for (const usage of usagesIn(readFileSync(file, 'utf8'))) {
        if (!defined.has(usage.name)) {
            problems.push({ file: relative(root, file), ...usage });
        }
    }
}

if (problems.length === 0) {
    console.log(`check-css-variables: ${defined.size} navn definert, ingen ukjente i bruk.`);
    process.exit(0);
}

console.error('\ncheck-css-variables: var() peker på navn som ikke defineres noe sted.\n');
for (const { file, line, column, name } of problems) {
    console.error(`  ${file}:${line}:${column}  ${name}`);
}
console.error(
    `\n${problems.length} treff. Rett navnet, eller gi var() en fallback hvis navnet` +
        ' med vilje kan være usatt.\n',
);
process.exit(1);
