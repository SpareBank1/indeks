import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
// @ts-expect-error — Node-script uten type-erklæringer.
import { analyzeFile, run } from './sync-cdn.js';

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
});

describe('analyzeFile', () => {
    test('finner drift i CSS-import', () => {
        const input = `@import url('https://cdn.sparebank1.no/indeks/css/0.1.0/index.css');`;
        const { matches, updated } = analyzeFile(input, '0.4.0');
        expect(matches).toEqual([
            { type: 'css', from: '0.1.0', to: '0.4.0', full: expect.any(String) },
        ]);
        expect(updated).toContain('indeks/css/0.4.0/index.css');
    });

    test('finner drift i web script-tag', () => {
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
        writeFileSync(
            file,
            `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`,
        );

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp]);

        expect(exit).toBe(0);
        expect(readFileSync(file, 'utf8')).toContain(`/css/${OWN_VERSION}/`);
    });

    test('--check feiler med exit 1 ved drift', () => {
        const file = join(tmp, 'index.html');
        const before = `<link href="https://cdn.sparebank1.no/indeks/css/0.1.0/index.css">`;
        writeFileSync(file, before);

        const exit = run(['node', 'bin', 'sync-cdn', '--root', tmp, '--check']);

        expect(exit).toBe(1);
        expect(readFileSync(file, 'utf8')).toBe(before);
    });

    test('--check returnerer 0 når alt matcher', () => {
        const file = join(tmp, 'index.html');
        writeFileSync(
            file,
            `<link href="https://cdn.sparebank1.no/indeks/css/${OWN_VERSION}/index.css">`,
        );

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
