#!/usr/bin/env node

/* Finner var(--navn) i kilden vår der --navn aldri defineres noe sted.
 *
 * En var() som peker på et navn som ikke finnes, feiler stille. Deklarasjonen
 * blir ugyldig ved beregning av verdien, og egenskapen faller til arv eller
 * initialverdi — uten konsollfeil og uten at stylelint sier noe. Resultatet ser
 * ofte nesten riktig ut, som er grunnen til at slike feil overlever lenge: da
 * denne sjekken ble skrevet lå det fem i indeks-css, og de fleste så
 * tilforlatelige ut fordi arvet farge tilfeldigvis var nær den de skulle hatt.
 *
 * Sjekken leser mer enn CSS. Et navn brukes like gjerne i en style-attributt i
 * .mdx eller i et style-objekt i .tsx, og døde navn har vist seg å skjule seg
 * nettopp der — utenfor det stylelint ser.
 *
 * Kjøres fra `lint` i pakkene som har CSS eller markup, og dermed også i CI via
 * `turbo run lint`. Hver pakke sjekker sine egne filer, slik at turbo-cachen
 * blir riktig, men settet av gyldige navn er alltid hele workspacet.
 *
 * indeks-react er ikke blant dem: den har ingen CSS, og oppstrøms har den bare
 * indeks-web. Siden turbo bygger oppstrøms pakker før lint, ville
 * indeks-tokens/dist/index.css ikke finnes når dens lint kjørte. indeks-web og
 * indeks-tokens har ingen lint-task og eier ingen håndskrevet CSS.
 *
 * Bruk: node ../scripts/check-css-variables.js <mappe...>
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

/* De tre kildegruppene under utgjør til sammen settet av gyldige navn. Et navn
   kan defineres i én pakke og brukes i en annen, så settet er alltid hele
   workspacet — uavhengig av hvilken pakke som lintes. Ellers ville
   --ix-border-default, som bor i utils og brukes i css, blitt falsk feil. */

/* Generert bundle. Må være bygget; se sjekken lenger ned. Her bor --ix-color-*,
   --ix-spacing-* og resten av skalaene.

   Tailwind-temaene (indeks-tokens/dist/tailwind.css og
   indeks-utils/dist/tailwind.css) står med vilje ikke her. Navnene deres
   (--color-*, --spacing-*, --text-*) forbrukes av Tailwind når den genererer
   utility-klasser, og brukes ikke via var() i kilden vår noe sted. De ville
   dessuten ikke vært tilgjengelige: turbo sin lint-task har dependsOn ["^build"],
   som er oppstrøms pakkers build — ikke pakkens egen. Skulle en av dem bli
   nødvendig, må rekkefølgen i turbo.json løses samtidig. */
const GENERATED_SOURCES = [{ path: 'indeks-tokens/dist/index.css', build: '@sb1/indeks-tokens' }];

/* Håndskrevet CSS: sammensatte navn som --ix-border-default og
   --ix-outline-default, pluss komponentinterne --ii-navn. */
const HANDWRITTEN_SOURCES = ['indeks-utils/css', 'indeks-css/css'];

/* Noen navn settes fra JavaScript og står derfor ikke i noen CSS-fil. De er
   like fullt definert av oss, så vi leser dem der de faktisk settes i stedet
   for å føre dem opp som unntak. Gjelder --ii-icon-url, --_arrow-x/y og
   --ii-progress-bar-fill. */
const SET_FROM_JS_SOURCES = ['indeks-web/lib'];

/* Filtyper som kan inneholde var(). .json er utelatt med vilje:
   indeks-tokens/tokens/*.json bruker var() i tokenverdier og hører til
   byggekjeden, ikke til kilden vi linter. */
const SCANNED_EXTENSIONS = ['.css', '.mdx', '.tsx', '.ts', '.html'];

/* Uten denne ville en pakkerot som target gått rett inn i node_modules, der
   vitest og Docusaurus har hundrevis av egne navn. */
const EXCLUDED_DIRS = new Set([
    'node_modules',
    'dist',
    '.build',
    '.theme-build',
    '.docusaurus',
    'build',
    'storybook-static',
    'test-results',
    'playwright-report',
    'coverage',
    '.turbo',
    '.git',
]);

/* Navn vi ikke eier. Infima definerer --ifm-* og --docusaurus-* inne i
   Docusaurus' node_modules, så de kan ikke leses som definisjonskilde uten å
   binde sjekken til en sti som flytter seg mellom versjoner. */
const IGNORED_PREFIXES = ['--ifm-', '--docusaurus-'];

function findWorkspaceRoot(from) {
    let dir = resolve(from);
    while (!existsSync(join(dir, 'pnpm-workspace.yaml'))) {
        const parent = dirname(dir);
        if (parent === dir) throw new Error('Fant ikke pnpm-workspace.yaml oppover fra ' + from);
        dir = parent;
    }
    return dir;
}

function filesIn(target, extensions) {
    if (!existsSync(target)) return [];
    if (statSync(target).isFile()) {
        return extensions.some((ext) => target.endsWith(ext)) ? [target] : [];
    }

    return readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
        if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) return [];
        return filesIn(join(target, entry.name), extensions);
    });
}

/* Kommentarer byttes mot mellomrom, ikke fjernes: da holder linje- og
   kolonnenummer seg til det som faktisk står i filen. */
function withoutComments(source) {
    return source.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '));
}

/* Kravet om {, ; eller linjestart foran navnet holder selektorer utenfor:
   :where(.ix-card--clickable:hover) ser ellers ut som en definisjon av
   --clickable. */
function definitionsIn(css) {
    return Array.from(withoutComments(css).matchAll(/(?:^|[{;])\s*(--[A-Za-z0-9_-]+)\s*:/gm), (m) => m[1]);
}

function jsDefinitionsIn(source) {
    return Array.from(source.matchAll(/setProperty\(\s*['"`](--[A-Za-z0-9_-]+)/g), (m) => m[1]);
}

function usagesIn(source) {
    const text = withoutComments(source);
    const lineStarts = [0];
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '\n') lineStarts.push(i + 1);
    }

    const found = [];
    for (const match of text.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)\s*([,)])/g)) {
        /* var(--x, fallback) er ikke en feil selv om --x ikke finnes: fallbacken
           er nettopp forfatterens håndtering av at navnet kan være usatt. Det er
           mønsteret for knotter konsumenter setter, som --ix-icon-badge-size. */
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

function printHelp() {
    console.log(`check-css-variables <mappe...>

Finner var(--navn) der --navn aldri defineres noe sted i workspacet. En slik
var() feiler stille, så uten denne sjekken merkes den bare som at noe ser litt
feil ut.

  <mappe...>      Mapper eller filer som skannes. En pakkerot som "." er trygt:
                  ${[...EXCLUDED_DIRS].slice(0, 4).join(', ')} og flere hoppes over.
  --help, -h      Vis denne hjelpen.

Filtyper som skannes: ${SCANNED_EXTENSIONS.join(', ')}.
Navn med prefiks ${IGNORED_PREFIXES.join(' eller ')} ignoreres — de eies av Docusaurus.

Exit 0 ingen funn, 1 funn, 2 bruksfeil eller manglende bygg.`);
}

const root = findWorkspaceRoot(process.cwd());
const targets = process.argv.slice(2);

if (targets.includes('--help') || targets.includes('-h')) {
    printHelp();
    process.exit(0);
}

if (targets.length === 0) {
    console.error('Bruk: node scripts/check-css-variables.js <mappe...>');
    console.error('Kjør med --help for detaljer.');
    process.exit(2);
}

const missing = GENERATED_SOURCES.filter((source) => !existsSync(join(root, source.path)));
if (missing.length > 0) {
    const builds = [...new Set(missing.map((source) => source.build))];
    const flere = missing.length > 1;
    console.error(
        `Fant ikke ${missing.map((source) => source.path).join(', ')}.\n` +
            `${flere ? 'Filene er' : 'Den er'} generert, og uten ${flere ? 'dem' : 'den'} vet ikke` +
            ' sjekken hvilke navn som finnes.\n' +
            `Kjør ${builds.map((name) => `\`pnpm --filter ${name} run build\``).join(' og ')} først.`,
    );
    process.exit(2);
}

const defined = new Set();

for (const source of GENERATED_SOURCES) {
    definitionsIn(readFileSync(join(root, source.path), 'utf8')).forEach((name) => defined.add(name));
}

for (const file of HANDWRITTEN_SOURCES.flatMap((source) => filesIn(join(root, source), ['.css']))) {
    definitionsIn(readFileSync(file, 'utf8')).forEach((name) => defined.add(name));
}

for (const file of SET_FROM_JS_SOURCES.flatMap((source) => filesIn(join(root, source), ['.ts']))) {
    jsDefinitionsIn(readFileSync(file, 'utf8')).forEach((name) => defined.add(name));
}

const problems = [];
for (const file of targets.flatMap((target) => filesIn(resolve(target), SCANNED_EXTENSIONS))) {
    for (const usage of usagesIn(readFileSync(file, 'utf8'))) {
        if (defined.has(usage.name)) continue;
        if (IGNORED_PREFIXES.some((prefix) => usage.name.startsWith(prefix))) continue;
        problems.push({ file: relative(root, file), ...usage });
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
