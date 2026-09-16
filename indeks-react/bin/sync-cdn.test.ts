import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
// @ts-expect-error — Node-script uten type-erklæringer.
import { analyzeFile, findSyncCommand, run } from './sync-cdn.js';

// Hent egen versjon slik at testene alltid holder seg oppdatert mot
// package.json-versjonen som faktisk publiseres.
const ownPkg = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf8'));
const OWN_VERSION: string = ownPkg.version;

let tmp: string;

beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'sync-cdn-test-'));
});

afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
    vi.restoreAllMocks();
});

// Samler alt scriptet skriver ut, slik at testene kan sjekke rapporten i seg
// selv — den er halve poenget med kommandoen — og holder kjøringen stille.
function fangConsole() {
    const linjer: string[] = [];
    const samle = (...args: unknown[]) => {
        linjer.push(args.join(' '));
    };
    vi.spyOn(console, 'log').mockImplementation(samle);
    vi.spyOn(console, 'warn').mockImplementation(samle);
    vi.spyOn(console, 'error').mockImplementation(samle);
    return () => linjer.join('\n');
}

describe('analyzeFile', () => {
    test('finner ulik versjon i CSS-import', () => {
        const input = `@import url('https://cdn.sparebank1.no/indeks/css/0.1.0/index.css');`;
        const { matches, updated } = analyzeFile(input, '0.4.0');
        expect(matches).toEqual([{ type: 'css', from: '0.1.0', to: '0.4.0', full: expect.any(String) }]);
        expect(updated).toContain('indeks/css/0.4.0/index.css');
    });

    test('finner ulik versjon i web script-tag', () => {
        const input = `<script src="https://cdn.sparebank1.no/indeks/web/0.2.3/index.js"></script>`;
        const { matches, updated } = analyzeFile(input, '0.4.0');
        expect(matches.length).toBe(1);
        expect(matches[0].type).toBe('web');
        expect(updated).toContain('indeks/web/0.4.0/index.js');
    });

    test('returnerer tom liste når versjonen allerede matcher', () => {
        const input = `<link href="https://cdn.sparebank1.no/indeks/css/0.4.0/index.css">`;
        const { matches, updated } = analyzeFile(input, '0.4.0');
        expect(matches).toEqual([]);
        expect(updated).toBe(input);
    });

    test('håndterer pre-release-versjoner', () => {
        const input = `<link href="https://cdn.sparebank1.no/indeks/css/0.4.0-rc.1/index.css">`;
        const { matches } = analyzeFile(input, '0.4.0');
        expect(matches.length).toBe(1);
        expect(matches[0].from).toBe('0.4.0-rc.1');
    });

    test('rører ikke URL-er med annen host', () => {
        const input = `<link href="https://example.com/indeks/css/0.1.0/index.css">`;
        const { matches, updated } = analyzeFile(input, '0.4.0');
        expect(matches).toEqual([]);
        expect(updated).toBe(input);
    });

    test('oppdaterer flere URL-er i samme fil', () => {
        const input = [
            `@import url('https://cdn.sparebank1.no/indeks/css/0.1.0/index.css');`,
            `<script src="https://cdn.sparebank1.no/indeks/web/0.1.0/index.js"></script>`,
        ].join('\n');
        const { matches, updated } = analyzeFile(input, '0.4.0');
        expect(matches.length).toBe(2);
        expect(updated).toContain('indeks/css/0.4.0/index.css');
        expect(updated).toContain('indeks/web/0.4.0/index.js');
    });
});

describe('run', () => {
    test('oppdaterer filer og skriver ut endringer', () => {
        const file = join(tmp, 'index.html');
        writeFileSync(file, `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`);

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(exit).toBe(0);
        expect(readFileSync(file, 'utf8')).toContain(`/css/${OWN_VERSION}/`);
    });

    test('--check feiler med exit 1 ved ulik versjon', () => {
        const file = join(tmp, 'index.html');
        const before = `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`;
        writeFileSync(file, before);

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(exit).toBe(1);
        expect(readFileSync(file, 'utf8')).toBe(before);
    });

    test('--check returnerer 0 når alt matcher', () => {
        const file = join(tmp, 'index.html');
        writeFileSync(file, `<link href="https://cdn.sparebank1.no/indeks/css/${OWN_VERSION}/index.css">`);

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(exit).toBe(0);
    });

    test('--dry-run rapporterer men endrer ikke fil', () => {
        const file = join(tmp, 'index.html');
        const before = `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`;
        writeFileSync(file, before);

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--dry-run']);

        expect(exit).toBe(0);
        expect(readFileSync(file, 'utf8')).toBe(before);
    });

    test('hopper over node_modules', () => {
        const nested = join(tmp, 'node_modules', 'some-pkg');
        mkdirSync(nested, { recursive: true });
        const inside = join(nested, 'index.html');
        const before = `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`;
        writeFileSync(inside, before);

        run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(readFileSync(inside, 'utf8')).toBe(before);
    });

    test('oppdaterer nøstede filer', () => {
        const nested = join(tmp, 'src', 'styles');
        mkdirSync(nested, { recursive: true });
        const file = join(nested, 'main.css');
        writeFileSync(file, `@import url('https://cdn.sparebank1.no/indeks/css/0.1.0/index.css');`);

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(exit).toBe(0);
        expect(readFileSync(file, 'utf8')).toContain(`/css/${OWN_VERSION}/`);
    });

    test('respekterer --exclude', () => {
        const file = join(tmp, 'CHANGELOG.md');
        const before = `Tidligere: https://cdn.sparebank1.no/indeks/css/0.1.0/index.css`;
        writeFileSync(file, before);

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--exclude', 'CHANGELOG.md']);

        expect(exit).toBe(0);
        expect(readFileSync(file, 'utf8')).toBe(before);
    });

    test('respekterer --include', () => {
        const htmlFile = join(tmp, 'index.html');
        const mdFile = join(tmp, 'README.md');
        writeFileSync(htmlFile, `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/x.css">`);
        writeFileSync(mdFile, `Se: https://cdn.sparebank1.no/indeks/css/0.1.0/x.css`);

        run(['node', 'bin', 'sync-cdn', '--root', tmp, '--include', '*.html']);

        expect(readFileSync(htmlFile, 'utf8')).toContain(`/css/${OWN_VERSION}/`);
        expect(readFileSync(mdFile, 'utf8')).toContain('/css/0.1.0/');
    });
});

// Den flate formen (…/css/0.1.1.css) er dokumentert i eldre READMEer, men
// finnes ikke på CDN-en — den svarer 403. Derfor migreres den uansett versjon.
describe('analyzeFile — gammel URL-form', () => {
    test('migrerer flat CSS-URL til mappeform', () => {
        const input = `<link href="https://cdn.sparebank1.no/indeks/css/0.1.1.css">`;
        const { matches, legacy, updated } = analyzeFile(input, '0.4.0');
        expect(matches).toEqual([]);
        expect(legacy.length).toBe(1);
        expect(legacy[0].from).toBe('0.1.1.css');
        expect(legacy[0].to).toBe('0.4.0/index.css');
        expect(updated).toContain('indeks/css/0.4.0/index.css');
    });

    test('flagger flat form også når versjonen allerede matcher', () => {
        const input = `<link href="https://cdn.sparebank1.no/indeks/css/0.4.0.css">`;
        const { legacy, updated } = analyzeFile(input, '0.4.0');
        expect(legacy.length).toBe(1);
        expect(updated).toContain('indeks/css/0.4.0/index.css');
    });

    test('migrerer flat web-URL til index.js', () => {
        const input = `<script src="https://cdn.sparebank1.no/indeks/web/0.2.3.js"></script>`;
        const { legacy, updated } = analyzeFile(input, '0.4.0');
        expect(legacy[0].to).toBe('0.4.0/index.js');
        expect(updated).toContain('indeks/web/0.4.0/index.js');
    });

    test('teller flat form og ulik versjon som én endring', () => {
        const input = `<link href="https://cdn.sparebank1.no/indeks/css/0.1.1.css">`;
        const { matches, legacy } = analyzeFile(input, '0.4.0');
        expect(matches.length + legacy.length).toBe(1);
    });

    test('håndterer pre-release i flat form', () => {
        const input = `<link href="https://cdn.sparebank1.no/indeks/css/0.4.0-rc.1.css">`;
        const { legacy } = analyzeFile(input, '0.4.0');
        expect(legacy[0].version).toBe('0.4.0-rc.1');
    });

    test('beholder filnavnet etter versjonen i kanonisk form', () => {
        const input = `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/annen.css">`;
        const { updated } = analyzeFile(input, '0.4.0');
        expect(updated).toContain('indeks/css/0.4.0/annen.css');
    });
});

describe('analyzeFile — pakker med egne versjoner', () => {
    test('rører ikke tokens-URL, men rapporterer den', () => {
        const input = `@import url('https://cdn.sparebank1.no/indeks/tokens/0.9.0/index.css');`;
        const { matches, legacy, ignored, seen, updated } = analyzeFile(input, '0.4.0');
        expect(matches).toEqual([]);
        expect(legacy).toEqual([]);
        expect(seen).toEqual([]);
        expect(ignored).toEqual([{ type: 'tokens', version: '0.9.0', full: expect.any(String) }]);
        expect(updated).toBe(input);
    });

    test('rører ikke utils-URL, men rapporterer den', () => {
        const input = `@import url('https://cdn.sparebank1.no/indeks/utils/0.9.0/index.css');`;
        const { ignored, updated } = analyzeFile(input, '0.4.0');
        expect(ignored[0].type).toBe('utils');
        expect(updated).toBe(input);
    });

    test('rapporterer ukjent pakkesegment som ignorert', () => {
        const input = `<link href="https://cdn.sparebank1.no/indeks/tulleting/1.0.0/index.css">`;
        const { ignored, updated } = analyzeFile(input, '0.4.0');
        expect(ignored[0].type).toBe('tulleting');
        expect(updated).toBe(input);
    });

    test('lar tokens-URL være i fred selv når css-URL i samme fil skrives om', () => {
        const input = [
            `@import url('https://cdn.sparebank1.no/indeks/tokens/0.9.0/index.css');`,
            `@import url('https://cdn.sparebank1.no/indeks/css/0.1.0/index.css');`,
        ].join('\n');
        const { updated } = analyzeFile(input, '0.4.0');
        expect(updated).toContain('indeks/tokens/0.9.0/index.css');
        expect(updated).toContain('indeks/css/0.4.0/index.css');
    });
});

describe('analyzeFile — seen', () => {
    test('teller URL-er som allerede er i takt', () => {
        const input = `<link href="https://cdn.sparebank1.no/indeks/css/0.4.0/index.css">`;
        const { matches, seen } = analyzeFile(input, '0.4.0');
        expect(matches).toEqual([]);
        expect(seen.length).toBe(1);
    });
});

// Kjernen i saken: kommandoen skal aldri kunne forveksles med «alt er bra» når
// den ikke har sett en eneste CDN-URL.
describe('run — ingen CDN-URL-er funnet', () => {
    test('skriver ut hvordan CDN settes opp', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="/lokal.css">`);
        const output = fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(exit).toBe(0);
        expect(output()).toContain('Fant ingen CDN-URL-er');
        expect(output()).toContain(`indeks/css/${OWN_VERSION}/index.css`);
        expect(output()).toContain(`indeks/web/${OWN_VERSION}/index.js`);
    });

    test('lenker til utvikler-guiden', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="/lokal.css">`);
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(output()).toContain('https://');
        expect(output()).toContain('docs/kom-i-gang/utvikler');
    });

    test('--check gir 0 — et npm-basert prosjekt har legitimt null CDN-URL-er', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="/lokal.css">`);
        fangConsole();

        expect(run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check'])).toBe(0);
    });

    test('--check --require-urls gir 1', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="/lokal.css">`);
        const output = fangConsole();

        expect(run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check', '--require-urls'])).toBe(1);
        expect(output()).toContain('--require-urls');
    });

    test('--require-urls gir 1 også i skrivemodus', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="/lokal.css">`);
        fangConsole();

        expect(run(['node', 'bin', 'sync-cdn', '--root', tmp, '--require-urls'])).toBe(1);
    });

    test('advarer når ingen filer i det hele tatt ble skannet', () => {
        const output = fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(exit).toBe(0);
        expect(output()).toContain('ingen filer ble skannet');
    });

    test('skriver ikke oppsett-snippeten når URL-er finnes', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`);
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(output()).not.toContain('Fant ingen CDN-URL-er');
        expect(output()).not.toContain('legg inn dette');
    });
});

describe('run — ugyldig --root', () => {
    test('exit 2 når mappen ikke finnes', () => {
        const output = fangConsole();

        expect(run(['node', 'bin', 'sync-cdn', '--root', join(tmp, 'finnes-ikke')])).toBe(2);
        expect(output()).toContain('sjekk --root');
    });

    test('exit 2 når --root peker på en fil', () => {
        const file = join(tmp, 'index.html');
        writeFileSync(file, '');
        const output = fangConsole();

        expect(run(['node', 'bin', 'sync-cdn', '--root', file])).toBe(2);
        expect(output()).toContain('er ikke en mappe');
    });
});

describe('run — rapport', () => {
    test('sier hvor mange URL-er som bruker samme versjon', () => {
        writeFileSync(
            join(tmp, 'index.html'),
            [
                `<link href="https://cdn.sparebank1.no/indeks/css/${OWN_VERSION}/index.css">`,
                `<script src="https://cdn.sparebank1.no/indeks/web/${OWN_VERSION}/index.js"></script>`,
            ].join('\n')
        );
        const output = fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(exit).toBe(0);
        expect(output()).toContain(`Alle 2 CDN-URL-er i 1 fil(er) bruker samme versjon`);
        expect(output()).toContain(OWN_VERSION);
    });

    test('sier hvilken versjon den synket fra og til', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`);
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(output()).toContain(`Synket fra 0.1.0 til ${OWN_VERSION}`);
    });

    test('viser status per pakke med kilde', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`);
        writeFileSync(
            join(tmp, 'package.json'),
            JSON.stringify({ name: 'demo', devDependencies: { '@sb1/indeks-web': '^0.1.0' } })
        );
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(output()).toContain('Pakkestatus');
        expect(output()).toContain('@sb1/indeks-css');
        expect(output()).toContain(`CDN 0.1.0 → ${OWN_VERSION}`);
        expect(output()).toContain('npm (devDependency)');
    });

    test('navngir filene når URL-ene ligger i noen få filer', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`);
        writeFileSync(join(tmp, 'main.css'), `@import url('https://cdn.sparebank1.no/indeks/css/0.1.0/index.css');`);
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(output()).toContain('index.html');
        expect(output()).toContain('main.css');
    });

    test('teller filene i stedet for å liste dem når det er mange', () => {
        for (const navn of ['a', 'b', 'c', 'd']) {
            writeFileSync(
                join(tmp, `${navn}.html`),
                `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`
            );
        }
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(output()).toContain(`CDN 0.1.0 → ${OWN_VERSION} (4 filer)`);
    });

    test('lister alle versjonene når filene står på ulike versjoner', () => {
        writeFileSync(join(tmp, 'a.html'), `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`);
        writeFileSync(join(tmp, 'b.html'), `<link href="https://cdn.sparebank1.no/indeks/css/0.2.0/index.css">`);
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(output()).toMatch(/CDN 0\.[12]\.0, 0\.[12]\.0 →/);
    });

    test('sier at du er på siste versjon', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="/lokal.css">`);
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp], { latest: OWN_VERSION });

        expect(output()).toContain('du er på siste versjon');
    });

    test('sier hvordan du oppgraderer når du ikke er på siste versjon', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="/lokal.css">`);
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp], { latest: '99.0.0' });

        expect(output()).toContain('du er ikke på siste versjon');
        expect(output()).toContain('@sb1/indeks-react@99.0.0');
    });

    test('advarer når CDN ikke har versjonen ennå', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="/lokal.css">`);
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp], { cdnHas: { css: false, web: true } });

        expect(output()).toContain(`CDN har ikke ${OWN_VERSION} for css`);
    });

    test('sier at nettverkssjekken ikke ble gjort med --offline', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="/lokal.css">`);
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp, '--offline']);

        expect(output()).toContain('ikke sjekket (--offline)');
    });

    test('lister tokens-URL uten å endre filen', () => {
        const file = join(tmp, 'main.css');
        const before = [
            `@import url('https://cdn.sparebank1.no/indeks/tokens/0.9.0/index.css');`,
            `@import url('https://cdn.sparebank1.no/indeks/css/${OWN_VERSION}/index.css');`,
        ].join('\n');
        writeFileSync(file, before);
        const output = fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(exit).toBe(0);
        expect(readFileSync(file, 'utf8')).toBe(before);
        expect(output()).toContain('tokens: 0.9.0');
        expect(output()).toContain('styres ikke av dette scriptet');
    });

    test('--offline og --require-urls er dokumentert i hjelpeteksten', () => {
        const output = fangConsole();

        expect(run(['node', 'bin', '--help'])).toBe(0);
        expect(output()).toContain('--require-urls');
        expect(output()).toContain('--offline');
    });
});

describe('run — gammel URL-form på disk', () => {
    test('migreres til mappeform', () => {
        const file = join(tmp, 'index.html');
        writeFileSync(file, `<link href="https://cdn.sparebank1.no/indeks/css/0.1.1.css">`);
        const output = fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(exit).toBe(0);
        expect(readFileSync(file, 'utf8')).toContain(`indeks/css/${OWN_VERSION}/index.css`);
        expect(output()).toContain('gammel form');
    });

    test('--check feiler selv når versjonen matcher', () => {
        const file = join(tmp, 'index.html');
        const before = `<link href="https://cdn.sparebank1.no/indeks/css/${OWN_VERSION}.css">`;
        writeFileSync(file, before);
        fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(exit).toBe(1);
        expect(readFileSync(file, 'utf8')).toBe(before);
    });
});

// Kjernen i den nye saken: --check leste tidligere aldri node_modules/<pkg>,
// så et prosjekt der CDN-URL-ene allerede pekte riktig, men den npm-installerte
// pakken sto på en annen versjon, fikk et falskt grønt lys.
describe('run — --check ser npm-installert versjon, ikke bare CDN-URL-er', () => {
    function skrivInstallertPakke(navn: string, versjon: string) {
        mkdirSync(join(tmp, 'node_modules', navn), { recursive: true });
        writeFileSync(join(tmp, 'node_modules', navn, 'package.json'), JSON.stringify({ name: navn, version: versjon }));
    }

    test('feiler med exit 1 når npm-installert web-versjon avviker, selv om alle CDN-URL-er matcher', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/${OWN_VERSION}/index.css">`);
        writeFileSync(
            join(tmp, 'package.json'),
            JSON.stringify({ name: 'demo', dependencies: { '@sb1/indeks-web': '^0.1.0' } })
        );
        skrivInstallertPakke('@sb1/indeks-web', '0.1.0');
        const output = fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(exit).toBe(1);
        expect(output()).toContain(`web: npm 0.1.0 installert, forventet ${OWN_VERSION} ✗`);
    });

    test('gir exit 0 når npm-installert versjon matcher og alle CDN-URL-er matcher', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/${OWN_VERSION}/index.css">`);
        writeFileSync(
            join(tmp, 'package.json'),
            JSON.stringify({ name: 'demo', dependencies: { '@sb1/indeks-css': '^0.1.0' } })
        );
        skrivInstallertPakke('@sb1/indeks-css', OWN_VERSION);
        fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(exit).toBe(0);
    });

    test('uendret oppførsel når pakken ikke er npm-installert i det hele tatt', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/${OWN_VERSION}/index.css">`);
        fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(exit).toBe(0);
    });

    test('teller ikke som avvik når pakken bare er deklarert, ikke faktisk installert', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/${OWN_VERSION}/index.css">`);
        writeFileSync(
            join(tmp, 'package.json'),
            JSON.stringify({ name: 'demo', dependencies: { '@sb1/indeks-web': '^0.1.0' } })
        );
        // Ingen node_modules/@sb1/indeks-web/package.json — deklarert, men ikke installert.
        fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(exit).toBe(0);
    });

    test('npm-avvik feiler CI også når det ikke finnes noen CDN-URL-er', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="/lokal.css">`);
        writeFileSync(
            join(tmp, 'package.json'),
            JSON.stringify({ name: 'demo', dependencies: { '@sb1/indeks-web': '^0.1.0' } })
        );
        skrivInstallertPakke('@sb1/indeks-web', '0.1.0');
        const output = fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(exit).toBe(1);
        expect(output()).toContain(`web: npm 0.1.0 installert, forventet ${OWN_VERSION} ✗`);
    });

    test('vanlig (ikke-check) kjøring feiler ikke på npm-versjonsavvik', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`);
        writeFileSync(
            join(tmp, 'package.json'),
            JSON.stringify({ name: 'demo', dependencies: { '@sb1/indeks-web': '^0.1.0' } })
        );
        skrivInstallertPakke('@sb1/indeks-web', '0.1.0');
        fangConsole();

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(exit).toBe(0);
    });
});

describe('findSyncCommand', () => {
    function skrivScripts(scripts: Record<string, string>) {
        writeFileSync(join(tmp, 'package.json'), JSON.stringify({ name: 'demo', scripts }));
    }

    test('bruker navnet konsumenten har gitt scriptet', () => {
        skrivScripts({ 'oppdater-indeks': 'indeks-react sync-cdn' });

        expect(findSyncCommand(tmp)).toBe('npm run oppdater-indeks');
    });

    test('hopper over --check-varianten, som ikke retter noe', () => {
        skrivScripts({ prebuild: 'indeks-react sync-cdn --check', 'sync-indeks': 'indeks-react sync-cdn' });

        expect(findSyncCommand(tmp)).toBe('npm run sync-indeks');
    });

    test('faller tilbake på npx når package.json mangler', () => {
        expect(findSyncCommand(tmp)).toBe('npx indeks-react sync-cdn');
    });

    test('faller tilbake på npx når ingen script kaller kommandoen', () => {
        skrivScripts({ build: 'vite build' });

        expect(findSyncCommand(tmp)).toBe('npx indeks-react sync-cdn');
    });
});

describe('run — oppgraderingshint', () => {
    test('viser installer-og-synk i riktig rekkefølge, med konsumentens eget scriptnavn', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`);
        writeFileSync(
            join(tmp, 'package.json'),
            JSON.stringify({ name: 'demo', scripts: { 'oppdater-indeks': 'indeks-react sync-cdn' } })
        );
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check'], { latest: '99.0.0' });

        expect(output()).toContain('du er ikke på siste versjon');
        expect(output()).toContain('npm install @sb1/indeks-react@99.0.0 && npm run oppdater-indeks');
        // Meldingen om å synke skal peke på samme script, ikke gjette på «sync-indeks».
        expect(output()).toContain('Kjør `npm run oppdater-indeks` for å oppdatere.');
    });

    test('nevner ikke oppgradering når du er på siste versjon', () => {
        writeFileSync(join(tmp, 'index.html'), `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`);
        const output = fangConsole();

        run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check'], { latest: OWN_VERSION });

        expect(output()).toContain('du er på siste versjon');
        expect(output()).not.toContain('Oppgrader og synk');
    });
});
