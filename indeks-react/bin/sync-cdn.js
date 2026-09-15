#!/usr/bin/env node

// Holder CDN-URL-er for @sb1/indeks-css og @sb1/indeks-web i takt med
// installert @sb1/indeks-react-versjon. Kjører uten eksterne deps slik at
// den virker fint i konsumentprosjekter som installerer med --ignore-scripts.

import { readFileSync, writeFileSync, readdirSync, statSync, realpathSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Gruppe 1 = pakkesegment, 2 = versjon, 3 = form. Formen er '/' for kanonisk
// mappe-URL (…/css/1.2.3/index.css) og '.css'/'.js' for den gamle flate formen
// (…/css/1.2.3.css). Den flate formen finnes ikke på CDN-en — den svarer 403 —
// så den migreres til mappeform samtidig som versjonen synkes.
const CDN_URL_PATTERN =
    /https:\/\/cdn\.sparebank1\.no\/indeks\/([a-z][a-z0-9-]*)\/(\d+\.\d+\.\d+(?:-[\w.]+)?)(\/|\.css|\.js)/g;

// Pakker som versjonslåses til @sb1/indeks-react og derfor skrives om.
const SYNCED_TYPES = ['css', 'web'];

// Pakker med egne versjoner (tokens/utils ligger på et annet nummer enn
// css/web). De rapporteres, men skal aldri skrives om til react-versjonen.
const OWN_VERSION_TYPES = new Set(['tokens', 'utils']);

// npm-navnet for hvert CDN-segment.
const PACKAGE_NAMES = {
    css: '@sb1/indeks-css',
    web: '@sb1/indeks-web',
};

const REACT_PACKAGE = '@sb1/indeks-react';

// Filnavnet hvert segment publiseres under på CDN-en.
const CDN_ENTRY = {
    css: 'index.css',
    web: 'index.js',
};

// Hvor mange ignorerte URL-er vi lister før vi kapper — ellers drukner
// sluttsammendraget i et prosjekt med mange tokens-URL-er.
const IGNORED_LIST_LIMIT = 10;

// Hvor mange filnavn vi navngir per pakke i Pakkestatus før vi bare teller.
const FILE_LIST_LIMIT = 3;

// Utvikler-guiden. Dette er den midlertidige docs-URL-en — `url` i
// indeks-docs/docusaurus.config.ts peker på design.sparebank1.no, som i dag
// serverer et annet nettsted og gir 404 på denne stien. Når docsene flytter dit,
// er det bare denne konstanten som skal endres. Merk at URL-en fryses inn i hver
// publiserte versjon, så eldre installasjoner vil peke hit også etterpå.
const DOCS_URL = 'https://automatic-meme-yv23n9e.pages.github.io/docs/kom-i-gang/utvikler';

// Nettverksoppslagene er alltid «nice to have»: de skal aldri henge en build.
const NETWORK_TIMEOUT_MS = 2500;

const DEFAULT_EXCLUDE_DIRS = new Set([
    'node_modules',
    'dist',
    'build',
    '.git',
    '.next',
    '.svelte-kit',
    'coverage',
    '.turbo',
    '.cache',
]);

// Filer som kan inneholde CDN-URL-er. Brukes når --include ikke er gitt —
// sparer walk-tid og unngår false positives i bildefiler o.l.
const TEXT_EXTENSIONS = new Set([
    '.html',
    '.htm',
    '.css',
    '.scss',
    '.sass',
    '.less',
    '.js',
    '.mjs',
    '.cjs',
    '.jsx',
    '.ts',
    '.tsx',
    '.mdx',
    '.md',
    '.svelte',
    '.vue',
    '.astro',
]);

function readOwnVersion() {
    const here = dirname(fileURLToPath(import.meta.url));
    const pkgPath = resolve(here, '..', 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    return pkg.version;
}

function parseArgs(argv) {
    // Hvis første arg er --help/-h er det ingen subkommando.
    const first = argv[2];
    const hasSubcommand = first && !first.startsWith('-');
    const args = {
        subcommand: hasSubcommand ? first : undefined,
        check: false,
        dryRun: false,
        requireUrls: false,
        offline: false,
        help: first === '--help' || first === '-h',
        root: process.cwd(),
        include: [],
        exclude: [],
    };
    const startIndex = hasSubcommand ? 3 : 2;
    for (let i = startIndex; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--check') args.check = true;
        else if (arg === '--dry-run') args.dryRun = true;
        else if (arg === '--require-urls') args.requireUrls = true;
        else if (arg === '--offline') args.offline = true;
        else if (arg === '--help' || arg === '-h') args.help = true;
        else if (arg === '--root') args.root = resolve(argv[++i]);
        else if (arg === '--include') args.include.push(argv[++i]);
        else if (arg === '--exclude') args.exclude.push(argv[++i]);
        else {
            console.error(`Ukjent argument: ${arg}`);
            process.exit(2);
        }
    }
    return args;
}

function matchesGlob(path, pattern) {
    // Enkel glob: **, *, ? — godt nok for filstier relativt til root.
    const escaped = pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*/g, '§§')
        .replace(/\*/g, '[^/]*')
        .replace(/§§/g, '.*')
        .replace(/\?/g, '[^/]');
    const regex = new RegExp(`^${escaped}$`);
    return regex.test(path);
}

function shouldSkipDir(name, relDir, extraExclude) {
    if (DEFAULT_EXCLUDE_DIRS.has(name)) return true;
    for (const pattern of extraExclude) {
        if (matchesGlob(relDir, pattern) || matchesGlob(name, pattern)) return true;
    }
    return false;
}

function shouldProcessFile(relPath, ext, include, exclude) {
    for (const pattern of exclude) {
        if (matchesGlob(relPath, pattern)) return false;
    }
    if (include.length > 0) {
        return include.some((p) => matchesGlob(relPath, p));
    }
    return TEXT_EXTENSIONS.has(ext);
}

function* walk(root, include, exclude) {
    const stack = [root];
    while (stack.length > 0) {
        const dir = stack.pop();
        let entries;
        try {
            entries = readdirSync(dir, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            const full = join(dir, entry.name);
            const rel = relative(root, full);
            if (entry.isDirectory()) {
                if (!shouldSkipDir(entry.name, rel, exclude)) stack.push(full);
            } else if (entry.isFile()) {
                const dotIndex = entry.name.lastIndexOf('.');
                const ext = dotIndex >= 0 ? entry.name.slice(dotIndex) : '';
                if (shouldProcessFile(rel, ext, include, exclude)) {
                    // Sanity check mot svært store filer (>2 MB) — de er nesten
                    // garantert ikke kildekode og å lese dem kaster bort tid.
                    try {
                        const stats = statSync(full);
                        if (stats.size > 2 * 1024 * 1024) continue;
                    } catch {
                        continue;
                    }
                    yield full;
                }
            }
        }
    }
}

function canonicalFileName(form) {
    return form === '.js' ? 'index.js' : 'index.css';
}

// Kjerne-API: finn URL-er med feil versjon og returner endringer som objekter i stedet for
// å skrive direkte. Skriving skjer i CLI-laget. Gjør funksjonen enkel å teste.
//
// `matches` er feil versjon i kanonisk form, `legacy` er URL-er på den gamle
// flate formen, `ignored` er URL-er til pakker vi ikke styrer, og `seen` er alle
// css/web-URL-er som fantes i det hele tatt — også de som allerede er i takt.
// Uten `seen` kan ikke CLI-laget skille «alt matcher» fra «det fantes ingenting
// å matche», som er nettopp forvirringen dette scriptet har skapt.
export function analyzeFile(content, targetVersion) {
    const matches = [];
    const legacy = [];
    const ignored = [];
    const seen = [];

    CDN_URL_PATTERN.lastIndex = 0;
    let m;
    while ((m = CDN_URL_PATTERN.exec(content)) !== null) {
        const [full, type, currentVersion, form] = m;
        if (!SYNCED_TYPES.includes(type)) {
            ignored.push({ type, version: currentVersion, full });
            continue;
        }
        seen.push({ type, version: currentVersion, form });
        if (form === '/') {
            if (currentVersion !== targetVersion) {
                matches.push({ type, from: currentVersion, to: targetVersion, full });
            }
        } else {
            // Flat form er feil uansett versjon, så den skal alltid rettes.
            legacy.push({
                type,
                version: currentVersion,
                from: `${currentVersion}${form}`,
                to: `${targetVersion}/${canonicalFileName(form)}`,
                full,
            });
        }
    }

    if (matches.length === 0 && legacy.length === 0) {
        return { matches, updated: content, legacy, ignored, seen };
    }

    const updated = content.replace(CDN_URL_PATTERN, (full, type, _version, form) => {
        if (!SYNCED_TYPES.includes(type)) return full;
        const base = `https://cdn.sparebank1.no/indeks/${type}/${targetVersion}`;
        // Kanonisk form: behold filnavnet som følger etter matchen.
        if (form === '/') return `${base}/`;
        return `${base}/${canonicalFileName(form)}`;
    });
    return { matches, updated, legacy, ignored, seen };
}

function formatChange(change) {
    return `    ${change.type}: ${change.from} → ${change.to}`;
}

function formatCheck(change) {
    return `    ${change.type}: ${change.from} (forventet ${change.to}) ✗`;
}

// --- Nettverksoppslag ------------------------------------------------------
// Begge er «best effort»: returnerer undefined hvis noe går galt, og påvirker
// aldri exit-koden. Uten nett (eller med --offline) hopper vi bare over dem.

export async function fetchLatestVersion(name, { timeoutMs = NETWORK_TIMEOUT_MS } = {}) {
    try {
        // Scope-skilletegnet må kodes for registry-API-et: @sb1/x → @sb1%2fx.
        const url = `https://registry.npmjs.org/${name.replaceAll('/', '%2f')}/latest`;
        const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
        if (!res.ok) return undefined;
        const body = await res.json();
        return typeof body.version === 'string' ? body.version : undefined;
    } catch {
        return undefined;
    }
}

export async function cdnHasVersion(type, version, { timeoutMs = NETWORK_TIMEOUT_MS } = {}) {
    try {
        const url = `https://cdn.sparebank1.no/indeks/${type}/${version}/${CDN_ENTRY[type]}`;
        const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(timeoutMs) });
        // 403 er S3-svaret for «objektet finnes ikke», så alt utenom 2xx er nei.
        return res.ok;
    } catch {
        return undefined;
    }
}

// --- Pakkestatus -----------------------------------------------------------

// Leser konsumentens package.json og node_modules for å svare på om pakken
// hentes fra npm i tillegg til (eller i stedet for) CDN.
function readNpmUsage(root, name) {
    let declared;
    try {
        const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
        if (pkg.dependencies && pkg.dependencies[name]) declared = 'dependency';
        else if (pkg.devDependencies && pkg.devDependencies[name]) declared = 'devDependency';
        else if (pkg.peerDependencies && pkg.peerDependencies[name]) declared = 'peerDependency';
    } catch {
        declared = undefined;
    }
    let installed;
    try {
        installed = JSON.parse(readFileSync(join(root, 'node_modules', name, 'package.json'), 'utf8')).version;
    } catch {
        installed = undefined;
    }
    if (!declared && !installed) return undefined;
    return installed ? `npm ${installed}${declared ? ` (${declared})` : ''}` : `npm (${declared})`;
}

// Konsumenten navngir scriptet sitt selv («sync-indeks» er bare det vi anbefaler
// i READMEen). Finn det faktiske navnet, så vi kan si «npm run <ditt navn>» i
// stedet for å gjette. Vi hopper over varianten med --check: den retter ingenting.
export function findSyncCommand(root) {
    try {
        const scripts = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts ?? {};
        const hit = Object.entries(scripts).find(
            ([, cmd]) => typeof cmd === 'string' && cmd.includes('sync-cdn') && !cmd.includes('--check')
        );
        if (hit) return `npm run ${hit[0]}`;
    } catch {
        // Ingen lesbar package.json — fall tilbake på den direkte kommandoen.
    }
    return 'npx indeks-react sync-cdn';
}

function formatCdnUsage(type, hits, targetVersion) {
    if (hits.length === 0) return undefined;
    const versions = [...new Set(hits.map((hit) => hit.version))];
    const files = [...new Set(hits.map((hit) => hit.relPath))];
    const otherVersions = versions.filter((v) => v !== targetVersion);
    const versionText =
        otherVersions.length > 0 ? `${otherVersions.join(', ')} → ${targetVersion}` : `${targetVersion} ✓`;
    // Samme URL ligger ofte i flere filer (index.html + en CSS-fil, eller én per
    // app i et monorepo). Navngi dem så lenge linja holder seg lesbar, ellers
    // bare tell — filene som faktisk endres listes uansett lenger opp.
    const fileText = files.length <= FILE_LIST_LIMIT ? files.join(', ') : `${files.length} filer`;
    return `CDN ${versionText} (${fileText})`;
}

function printPackageStatus({ version, cdnHits, root, latest, cdnHas, offline, syncCommand }) {
    const rows = [[REACT_PACKAGE, `npm ${version} — installert, styrer versjonen under`]];
    for (const type of SYNCED_TYPES) {
        const name = PACKAGE_NAMES[type];
        const sources = [formatCdnUsage(type, cdnHits[type], version), readNpmUsage(root, name)].filter(Boolean);
        rows.push([name, sources.length > 0 ? sources.join(' · ') : 'ikke i bruk']);
    }

    const width = Math.max(...rows.map(([name]) => name.length));
    console.log('Pakkestatus — disse tre versjonslåses til samme nummer:');
    for (const [name, detail] of rows) {
        console.log(`    ${name.padEnd(width)}  ${detail}`);
    }

    if (offline) {
        console.log('    Nyeste på npm: ikke sjekket (--offline).');
    } else if (!latest) {
        console.log('    Nyeste på npm: kunne ikke sjekkes — ingen nettverkstilgang?');
    } else if (latest === version) {
        console.log(`    Nyeste på npm: ${latest} — du er på siste versjon.`);
    } else {
        console.log(`    Nyeste på npm: ${latest} — du er ikke på siste versjon.`);
        // Rekkefølgen er poenget: installer først, synk etterpå. Motsatt vei
        // skriver vi URL-ene til versjonen du er i ferd med å forlate.
        console.log('    Oppgrader og synk i én operasjon:');
        console.log(`        npm install ${REACT_PACKAGE}@${latest} && ${syncCommand}`);
    }

    const missing = SYNCED_TYPES.filter((type) => cdnHas[type] === false);
    if (missing.length > 0) {
        console.log(`    Advarsel: CDN har ikke ${version} for ${missing.join(' og ')} ennå.`);
        console.log('    Artefaktene publiseres et kvarter etter npm — vent og kjør på nytt før deploy.');
    } else if (SYNCED_TYPES.every((type) => cdnHas[type] === true)) {
        console.log(`    CDN har ${version} for css og web.`);
    }
}

function printCdnSetup(version) {
    console.log('');
    console.log('Skal prosjektet bruke CDN, legg inn dette (versjonene følger installert @sb1/indeks-react):');
    console.log('');
    console.log('    <!-- index.html -->');
    console.log('    <link rel="preconnect" href="https://cdn.sparebank1.no" crossorigin />');
    console.log(`    <link rel="stylesheet" href="https://cdn.sparebank1.no/indeks/css/${version}/index.css" />`);
    console.log(`    <script type="module" src="https://cdn.sparebank1.no/indeks/web/${version}/index.js"></script>`);
    console.log('');
    console.log('Importerer du CSS-en fra hoved-CSS-filen i stedet:');
    console.log('');
    console.log(`    @import url('https://cdn.sparebank1.no/indeks/css/${version}/index.css');`);
    console.log('');
    console.log('Kjør kommandoen på nytt etterpå — da skal den finne URL-ene og holde dem i takt.');
    console.log('');
    console.log(`Hele oppsettet steg for steg: ${DOCS_URL}`);
}

function printIgnored(hits) {
    console.log('');
    console.log(`Merk: ${hits.length} CDN-URL(er) styres ikke av dette scriptet og ble ikke endret:`);
    for (const hit of hits.slice(0, IGNORED_LIST_LIMIT)) {
        console.log(`    ${hit.relPath} — ${hit.type}: ${hit.version}`);
    }
    if (hits.length > IGNORED_LIST_LIMIT) {
        console.log(`    … og ${hits.length - IGNORED_LIST_LIMIT} flere.`);
    }
    if (hits.some((hit) => OWN_VERSION_TYPES.has(hit.type))) {
        console.log('@sb1/indeks-tokens og @sb1/indeks-utils har egne versjoner (uavhengig av indeks-react),');
        console.log('og innholdet ligger allerede inne i indeks-css/index.css — URL-ene kan vanligvis fjernes.');
    }
    if (hits.some((hit) => !OWN_VERSION_TYPES.has(hit.type))) {
        console.log('Ukjent pakke under /indeks/ — sjekk om URL-en er riktig.');
    }
}

function printHelp() {
    console.log(`indeks-react sync-cdn [options]

Holder CDN-URL-er for @sb1/indeks-css og @sb1/indeks-web i takt med
installert @sb1/indeks-react-versjon, og rapporterer status for de tre.

  --check         Exit 1 og list URL-er med ulik versjon, uten å skrive. For CI.
  --dry-run       Vis hva som ville blitt endret uten å skrive.
  --require-urls  Exit 1 hvis ingen CDN-URL-er ble funnet. For prosjekter som
                  vet at de bruker CDN. Default: ingen funn er OK, fordi et
                  npm-basert prosjekt legitimt har null CDN-URL-er.
  --offline       Hopp over nettverksoppslagene (nyeste npm-versjon og om CDN
                  har artefaktene). De er «best effort» og påvirker aldri
                  exit-koden, men koster inntil ${NETWORK_TIMEOUT_MS} ms.
  --root <path>   Start-mappe (default: cwd).
  --include <glob>
                  Glob-mønster som begrenser hvilke filer som skannes.
                  Kan gjentas. Default: html, css, js, ts, mdx og flere.
  --exclude <glob>
                  Ekstra eksklusjoner utover node_modules/dist/build/.git/
                  .next/.svelte-kit/coverage/.turbo/.cache. Kan gjentas.
  --help, -h      Vis denne hjelpen.

URL-er på den gamle formen /indeks/css/<versjon>.css migreres til
/indeks/css/<versjon>/index.css — den flate formen finnes ikke på CDN-en.
URL-er til indeks-tokens og indeks-utils har egne versjoner og røres ikke.

Dokumentasjon: ${DOCS_URL}`);
}

export function run(argv, { cwd = process.cwd(), write = true, latest, cdnHas = {} } = {}) {
    const args = parseArgs(argv);
    if (args.help) {
        printHelp();
        return 0;
    }
    if (args.subcommand !== 'sync-cdn') {
        if (args.subcommand) console.error(`Ukjent subkommando: ${args.subcommand}`);
        printHelp();
        return args.subcommand ? 2 : 0;
    }

    const version = readOwnVersion();
    const root = resolve(cwd, args.root);

    // walk() svelger readdirSync-feil, så en feilskrevet --root ville ellers gi
    // «alt i orden» og exit 0 uten at en enkelt fil var lest. Verst i CI, der
    // prebuild --check da passerer på ingenting.
    let rootStat;
    try {
        rootStat = statSync(root);
    } catch {
        rootStat = undefined;
    }
    if (!rootStat) {
        console.error(`Fant ikke mappen ${root} — sjekk --root.`);
        return 2;
    }
    if (!rootStat.isDirectory()) {
        console.error(`${root} er ikke en mappe — sjekk --root.`);
        return 2;
    }

    const mode = args.check ? 'sjekker' : args.dryRun ? 'ville oppdatert' : 'oppdaterer';
    console.log(`indeks-react ${version} — ${mode} CDN-URL-er${args.check ? '' : ` til ${version}`}`);
    console.log('');

    let filesScanned = 0;
    let filesWithSyncedUrls = 0;
    let urlsFound = 0;
    let filesChanged = 0;
    let urlsChanged = 0;
    let formFixes = 0;
    const ignoredHits = [];
    const cdnHits = { css: [], web: [] };
    const fromVersions = new Set();

    for (const filePath of walk(root, args.include, args.exclude)) {
        let content;
        try {
            content = readFileSync(filePath, 'utf8');
        } catch {
            continue;
        }
        filesScanned++;
        if (!content.includes('cdn.sparebank1.no/indeks/')) continue;

        const { matches, updated, legacy, ignored, seen } = analyzeFile(content, version);
        const relPath = relative(root, filePath);

        urlsFound += seen.length;
        if (seen.length > 0) filesWithSyncedUrls++;
        for (const hit of seen) cdnHits[hit.type].push({ relPath, version: hit.version });
        for (const hit of ignored) ignoredHits.push({ relPath, ...hit });
        for (const change of matches) fromVersions.add(change.from);
        for (const change of legacy) fromVersions.add(change.version);

        const changes = [...matches, ...legacy];
        if (changes.length === 0) continue;

        console.log(`  ${relPath}`);
        for (const change of changes) {
            console.log(args.check ? formatCheck(change) : formatChange(change));
        }
        filesChanged++;
        urlsChanged += changes.length;
        formFixes += legacy.length;

        if (!args.check && !args.dryRun && write) {
            writeFileSync(filePath, updated);
        }
    }

    const syncCommand = findSyncCommand(root);

    if (filesChanged > 0) console.log('');
    printPackageStatus({ version, cdnHits, root, latest, cdnHas, offline: args.offline, syncCommand });
    console.log('');

    // Ingen filer i det hele tatt: nesten alltid feil --root/--include, ikke et
    // prosjekt uten CDN. Si det, i stedet for å melde at alt er i orden.
    if (filesScanned === 0) {
        console.warn(`Advarsel: ingen filer ble skannet under ${root}.`);
        console.warn('Sjekk --root, --include og --exclude — mappen kan også være tom.');
        printCdnSetup(version);
        return finish(args, ignoredHits, 0);
    }

    // Filer ble lest, men ingen av dem nevner css/web på CDN. Da er det ikke
    // et grønt svar — det er ingenting å synce, og brukeren trenger å vite
    // hvordan et CDN-oppsett ser ut.
    if (urlsFound === 0) {
        const filord = filesScanned === 1 ? 'fil' : 'filer';
        console.log(
            `Fant ingen CDN-URL-er for indeks-css eller indeks-web i ${filesScanned} skannede ${filord} under ${root}.`
        );
        console.log('');
        console.log("Bruker prosjektet npm-import (import '@sb1/indeks-css') er dette som forventet — da");
        console.log('trenger du ikke sync-cdn, og «sync-indeks»/«prebuild» kan fjernes fra package.json.');
        printCdnSetup(version);
        return finish(args, ignoredHits, 0);
    }

    if (urlsChanged === 0) {
        console.log(
            `Alle ${urlsFound} CDN-URL-er i ${filesWithSyncedUrls} fil(er) bruker samme versjon som installert @sb1/indeks-react (${version}).`
        );
        if (ignoredHits.length > 0) printIgnored(ignoredHits);
        return 0;
    }

    const fra = [...fromVersions].filter((v) => v !== version).join(', ');

    if (args.check) {
        console.log(
            `Ulik versjon: ${urlsChanged} av ${urlsFound} URL(er) i ${filesChanged} av ${filesWithSyncedUrls} fil(er) peker ikke på ${version}.`
        );
        if (fra) console.log(`Filene står på ${fra}, installert @sb1/indeks-react er ${version}.`);
        if (formFixes > 0) {
            console.log(`${formFixes} URL(er) bruker gammel form (…/css/<versjon>.css). Den finnes ikke på`);
            console.log('CDN-en og migreres til …/css/<versjon>/index.css.');
        }
        console.log(`Kjør \`${syncCommand}\` for å oppdatere.`);
        if (ignoredHits.length > 0) printIgnored(ignoredHits);
        return 1;
    }

    const verb = args.dryRun ? 'ville blitt endret' : 'oppdatert';
    const alleredeITakt = urlsFound > urlsChanged ? ` — ${urlsFound - urlsChanged} brukte allerede ${version}.` : '';
    console.log(`${filesChanged} fil(er) ${verb}, ${urlsChanged} av ${urlsFound} URL(er) endret.${alleredeITakt}`);
    if (fra) {
        console.log(args.dryRun ? `Ville synket fra ${fra} til ${version}.` : `Synket fra ${fra} til ${version}.`);
    }
    if (formFixes > 0) {
        const formVerb = args.dryRun ? 'ville blitt migrert til' : 'peker nå på';
        console.log(`${formFixes} URL(er) hadde gammel form og ${formVerb} …/css/${version}/index.css.`);
    }
    if (ignoredHits.length > 0) printIgnored(ignoredHits);
    return 0;
}

// Felles hale for de to «fant ingenting»-utfallene: rapporter ignorerte
// URL-er, og la --require-urls avgjøre exit-koden.
function finish(args, ignoredHits, exitCode) {
    if (ignoredHits.length > 0) printIgnored(ignoredHits);
    if (args.requireUrls) {
        console.error('');
        console.error('--require-urls er satt, men ingen CDN-URL-er ble funnet.');
        return 1;
    }
    return exitCode;
}

// Nettverksoppslagene gjøres her, utenfor run(), slik at run() forblir synkron
// og enkel å teste med innsatte verdier.
export async function main(argv) {
    const args = parseArgs(argv);
    if (args.help || args.subcommand !== 'sync-cdn' || args.offline) {
        return run(argv);
    }
    const version = readOwnVersion();
    const [latest, cssOnCdn, webOnCdn] = await Promise.all([
        fetchLatestVersion(REACT_PACKAGE),
        cdnHasVersion('css', version),
        cdnHasVersion('web', version),
    ]);
    return run(argv, { latest, cdnHas: { css: cssOnCdn, web: webOnCdn } });
}

// Kjør kun når scriptet kalles direkte, ikke når det importeres av tester.
// Bruker realpath-sammenligning slik at det også virker via symlink
// (npx legger scriptet som symlink i node_modules/.bin).
const thisFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (thisFile === invokedFile) {
    process.exit(await main(process.argv));
}
