#!/usr/bin/env node

// Holder CDN-URL-er for @sb1/indeks-css og @sb1/indeks-web i takt med
// installert @sb1/indeks-react-versjon. Kjører uten eksterne deps slik at
// den virker fint i konsumentprosjekter som installerer med --ignore-scripts.

import { readFileSync, writeFileSync, readdirSync, statSync, realpathSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CDN_PATTERN = /https:\/\/cdn\.sparebank1\.no\/indeks\/(css|web)\/(\d+\.\d+\.\d+(?:-[\w.]+)?)\//g;

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

// Kjerne-API: finn drift og returner endringer som objekter i stedet for
// å skrive direkte. Skriving skjer i CLI-laget. Gjør funksjonen enkel å teste.
export function analyzeFile(content, targetVersion) {
    const matches = [];
    CDN_PATTERN.lastIndex = 0;
    let m;
    while ((m = CDN_PATTERN.exec(content)) !== null) {
        const [full, type, currentVersion] = m;
        if (currentVersion !== targetVersion) {
            matches.push({ type, from: currentVersion, to: targetVersion, full });
        }
    }
    if (matches.length === 0) return { matches, updated: content };
    const updated = content.replace(
        CDN_PATTERN,
        (_, type) => `https://cdn.sparebank1.no/indeks/${type}/${targetVersion}/`,
    );
    return { matches, updated };
}

function formatChange(change) {
    return `    ${change.type}: ${change.from} → ${change.to}`;
}

function formatCheck(change) {
    return `    ${change.type}: ${change.from} (forventet ${change.to}) ✗`;
}

function printHelp() {
    console.log(`indeks-react sync-cdn [options]

Holder CDN-URL-er for @sb1/indeks-css og @sb1/indeks-web i takt med
installert @sb1/indeks-react-versjon.

  --check         Exit 1 og skriv ut drift uten å endre filer. For CI.
  --dry-run       Vis hva som ville blitt endret uten å skrive.
  --root <path>   Start-mappe (default: cwd).
  --include <glob>
                  Glob-mønster som begrenser hvilke filer som skannes.
                  Kan gjentas. Default: html, css, js, ts, mdx og flere.
  --exclude <glob>
                  Ekstra eksklusjoner utover node_modules/dist/build/.git/
                  .next/.svelte-kit/coverage/.turbo/.cache. Kan gjentas.
  --help, -h      Vis denne hjelpen.`);
}

export function run(argv, { cwd = process.cwd(), write = true } = {}) {
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

    const mode = args.check ? 'sjekker' : args.dryRun ? 'ville oppdatert' : 'oppdaterer';
    console.log(`indeks-react ${version} — ${mode} CDN-URL-er${args.check ? '' : ` til ${version}`}`);
    console.log('');

    let filesChanged = 0;
    let urlsChanged = 0;

    for (const filePath of walk(root, args.include, args.exclude)) {
        let content;
        try {
            content = readFileSync(filePath, 'utf8');
        } catch {
            continue;
        }
        if (!content.includes('cdn.sparebank1.no/indeks/')) continue;

        const { matches, updated } = analyzeFile(content, version);
        if (matches.length === 0) continue;

        const relPath = relative(root, filePath);
        console.log(`  ${relPath}`);
        for (const change of matches) {
            console.log(args.check ? formatCheck(change) : formatChange(change));
        }
        filesChanged++;
        urlsChanged += matches.length;

        if (!args.check && !args.dryRun && write) {
            writeFileSync(filePath, updated);
        }
    }

    console.log('');

    if (filesChanged === 0) {
        console.log(`Ingen drift funnet. Alle CDN-URL-er matcher ${version}.`);
        return 0;
    }

    if (args.check) {
        console.log(`Drift funnet i ${filesChanged} fil(er), ${urlsChanged} URL(er).`);
        console.log('Kjør `npm run sync-indeks` for å oppdatere.');
        return 1;
    }

    const verb = args.dryRun ? 'ville blitt endret' : 'oppdatert';
    console.log(`${filesChanged} fil(er) ${verb}, ${urlsChanged} URL(er) endret.`);
    return 0;
}

// Kjør kun når scriptet kalles direkte, ikke når det importeres av tester.
// Bruker realpath-sammenligning slik at det også virker via symlink
// (npx legger scriptet som symlink i node_modules/.bin).
const thisFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (thisFile === invokedFile) {
    process.exit(run(process.argv));
}
