import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

/**
 * Integrasjonstest for det publiserte CLI-et (`dist/cli.js`).
 *
 * Fanger opp om vi brekker oppsettet som gjør at konsumenter kan kjøre
 * `npx @sb1/indeks-tokens build-colors ...` fra en ren install (uten tsx):
 *   - esbuild-bygget (build:cli) må produsere en kjørbar bundle
 *   - verb-parsingen i cli.ts må matche docs-signaturen
 *   - JSON-theme-lasteren må virke uten TS-runtime
 *   - versjonen må injiseres ved bygg (__PKG_VERSION__)
 *
 * Vi bygger CLI-et i beforeAll slik at testen validerer hele kjeden
 * (esbuild -> bundle -> kjøring), ikke bare en tidligere bygget fil.
 */

const pkgRoot = resolve(__dirname, '../../..');
const cliPath = join(pkgRoot, 'dist/cli.js');

/** Kjør det bygde CLI-et som en subprosess, akkurat som en konsument ville. */
function runCli(args: string[], cwd: string): { stdout: string; status: number } {
    try {
        const stdout = execFileSync('node', [cliPath, ...args], {
            cwd,
            encoding: 'utf-8',
        });
        return { stdout, status: 0 };
    } catch (error) {
        const err = error as { stdout?: Buffer | string; stderr?: Buffer | string; status?: number };
        return {
            stdout: `${err.stdout ?? ''}${err.stderr ?? ''}`,
            status: err.status ?? 1,
        };
    }
}

describe('build-colors CLI (dist/cli.js)', () => {
    beforeAll(() => {
        // Bygg CLI-et fra kilde, så testen fanger et ødelagt esbuild-oppsett.
        execFileSync('pnpm', ['run', 'build:cli'], { cwd: pkgRoot, stdio: 'pipe' });
        expect(existsSync(cliPath)).toBe(true);
    }, 60_000);

    it('starter med en node-shebang', () => {
        const firstLine = readFileSync(cliPath, 'utf-8').split('\n')[0];
        expect(firstLine).toBe('#!/usr/bin/env node');
    });

    it('genererer web-CSS med default sb1-theme', () => {
        const dir = mkdtempSync(join(tmpdir(), 'indeks-cli-web-'));
        const { status } = runCli(['build-colors', 'platform=web', 'path=./out'], dir);

        expect(status).toBe(0);
        // Primitiver i eget theme-fil + semantiske farger i colors.css
        const themeCss = readFileSync(join(dir, 'out/themes/sb1.css'), 'utf-8');
        expect(themeCss).toContain('--ii-');
        const colorsCss = readFileSync(join(dir, 'out/colors.css'), 'utf-8');
        expect(colorsCss).toContain('--ix-color-');
    });

    it('genererer android Colors.kt med injisert pakkeversjon', () => {
        const dir = mkdtempSync(join(tmpdir(), 'indeks-cli-android-'));
        const { status } = runCli(['build-colors', 'platform=android', 'path=./out'], dir);

        expect(status).toBe(0);
        const kt = readFileSync(join(dir, 'out/Colors.kt'), 'utf-8');
        expect(kt).toContain('object Colors');
        // Versjonen injiseres ved bygg — skal IKKE være 'dev'-fallbacken.
        const version = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf-8')).version;
        expect(kt).toContain(`Indeks Tokens versjon: ${version}`);
    });

    it('laster et eget JSON-theme (uten TS-runtime)', () => {
        const dir = mkdtempSync(join(tmpdir(), 'indeks-cli-theme-'));
        const theme = {
            name: 'testtema',
            figmaName: 'TestTema',
            identityColor: '#663399',
            colors: {
                brand: '#663399',
                success: '#00885B',
                info: '#467CA4',
                danger: '#C94E4F',
                warning: '#AF6500',
                gray: '#6D7888',
                neutral: '#AF6516',
            },
            themeable: { 'font-family': { normal: 'Arial', heading: 'Arial' } },
        };
        writeFileSync(join(dir, 'my-theme.json'), JSON.stringify(theme));

        const { status } = runCli(
            ['build-colors', 'platform=web', 'path=./out', 'theme=./my-theme.json'],
            dir
        );

        expect(status).toBe(0);
        // Output navngis etter theme-navnet fra JSON-fila.
        const files = readdirSync(join(dir, 'out/themes'));
        expect(files).toContain('testtema.css');
    });

    it('feiler med exit 1 på ukjent verb', () => {
        const dir = mkdtempSync(join(tmpdir(), 'indeks-cli-verb-'));
        const { status, stdout } = runCli(['bogus'], dir);

        expect(status).toBe(1);
        expect(stdout).toContain('Usage: build-colors');
    });
});
