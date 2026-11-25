#!/usr/bin/env node

/* Oppdaterer hex-verdiene i FFE-migreringstabellen på fargesiden.
 *
 * Mappingen (hvilket FFE-token som svarer til hvilket Indeks-token) redigeres for hånd i
 * ffe-farger.json. Scriptet fyller inn hex for lys og mørk modus og avviket mellom dem.
 * FFE er frosset, så FFE-verdiene endres bare om FFE-tokenene endres. Kjør scriptet på
 * nytt når Indeks-tokenene endres.
 *
 * Feiler hvis et Indeks-token i mappingen ikke finnes, eller hvis FFE har tokens som
 * mangler i mappingen.
 *
 * Bruk: node scripts/ffe-farger.ts <sti til FFE-repoet>
 * Bygg indeks-tokens først, scriptet leser indeks-tokens/dist/index.css.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export type Rad = {
    ffe: string;
    ix: string | null;
    ffeLys?: string;
    ffeMork?: string;
    ixLys?: string;
    ixMork?: string;
    avvikLys?: number;
    avvikMork?: number;
};

const MAPPING = 'indeks-docs/docs/retningslinjer/farger/ffe/ffe-farger.json';
const INDEKS_CSS = 'indeks-tokens/dist/index.css';
const FFE_LESS = 'packages/ffe-core/less/colors-semantic.less';

type Blokk = { selektor: string; vars: Map<string, string> };

export function blokker(css: string): Blokk[] {
    const ut: Blokk[] = [];
    const utenKommentarer = css.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of utenKommentarer.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const vars = new Map<string, string>();
        for (const d of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)) vars.set(d[1], d[2].trim());
        ut.push({ selektor: m[1].trim(), vars });
    }
    return ut;
}

function finnBlokk(alle: Blokk[], test: (selektor: string) => boolean, navn: string): Map<string, string> {
    const b = alle.find((x) => test(x.selektor.split(',').map((s) => s.trim()).join(',')));
    if (!b) throw new Error(`Fant ikke blokken for ${navn}`);
    return b.vars;
}

function los(navn: string, vars: Map<string, string>): string {
    let v = vars.get(navn);
    for (let i = 0; v && i < 10; i++) {
        const ref = v.match(/^var\((--[\w-]+)\)$/);
        if (!ref) return v.toLowerCase();
        v = vars.get(ref[1]);
    }
    throw new Error(`Kunne ikke løse ${navn}`);
}

type Rgba = [number, number, number, number];

export function hexTilRgba(hex: string): Rgba {
    let h = hex.replace('#', '');
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
    return [n(0), n(2), n(4), h.length === 8 ? n(6) : 1];
}

function legg(over: Rgba, under: Rgba): Rgba {
    const a = over[3];
    return [0, 1, 2].map((i) => over[i] * a + under[i] * (1 - a)).concat(1) as Rgba;
}

function oklab([r, g, b]: Rgba): [number, number, number] {
    const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    const [R, G, B] = [lin(r), lin(g), lin(b)];
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
    const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
    const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    return [
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    ];
}

/* Gjennomsiktige FFE-farger legges over sin egen bakgrunn før de sammenlignes,
 * siden det er den fargen brukeren faktisk ser. */
export function avvik(a: string, aBakgrunn: string, b: string, bBakgrunn: string): number {
    const x = oklab(legg(hexTilRgba(a), hexTilRgba(aBakgrunn)));
    const y = oklab(legg(hexTilRgba(b), hexTilRgba(bBakgrunn)));
    return Math.round(Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 1000) / 1000;
}

function main(ffeRepo: string) {
    const ffe = blokker(readFileSync(join(ffeRepo, FFE_LESS), 'utf8'));
    const ffeLys = finnBlokk(ffe, (s) => s.includes('.ffe-light.ffe-default-mode'), 'FFE lys');
    const ffeMork = finnBlokk(ffe, (s) => s === '.ffe-dark,.ffe-dark .ffe-default-mode', 'FFE mørk');

    const ix = blokker(readFileSync(INDEKS_CSS, 'utf8'));
    const base = new Map<string, string>();
    for (const b of ix) if (b.selektor === ':host,:root') for (const [k, v] of b.vars) base.set(k, v);
    const ixLys = new Map([...base, ...finnBlokk(ix, (s) => s === '.ix-light-mode,:host,:root', 'Indeks lys')]);
    const ixMork = new Map([...base, ...finnBlokk(ix, (s) => s === '.ix-dark-mode', 'Indeks mørk')]);

    const rader: Rad[] = JSON.parse(readFileSync(MAPPING, 'utf8'));
    const feil: string[] = [];

    const imapping = new Set(rader.map((r) => r.ffe));
    for (const navn of ffeLys.keys()) {
        if (navn.startsWith('--ffe-color-') && !imapping.has(navn)) feil.push(`${navn} finnes i FFE, men mangler i mappingen`);
    }

    const ffeBg = { lys: los('--ffe-color-background-default', ffeLys), mork: los('--ffe-color-background-default', ffeMork) };
    const ixBg = { lys: los('--ix-color-background-default', ixLys), mork: los('--ix-color-background-default', ixMork) };

    const ut: Rad[] = rader.map(({ ffe: f, ix: i }) => {
        if (!ffeLys.has(f)) {
            feil.push(`${f} finnes ikke i FFE`);
            return { ffe: f, ix: i };
        }
        const rad: Rad = { ffe: f, ix: i, ffeLys: los(f, ffeLys), ffeMork: los(f, ffeMork) };
        if (!i) return rad;
        if (!ixLys.has(i) || !ixMork.has(i)) {
            feil.push(`${i} finnes ikke i Indeks`);
            return rad;
        }
        rad.ixLys = los(i, ixLys);
        rad.ixMork = los(i, ixMork);
        rad.avvikLys = avvik(rad.ffeLys!, ffeBg.lys, rad.ixLys, ixBg.lys);
        rad.avvikMork = avvik(rad.ffeMork!, ffeBg.mork, rad.ixMork, ixBg.mork);
        return rad;
    });

    if (feil.length) {
        console.error(feil.join('\n'));
        process.exit(1);
    }
    writeFileSync(MAPPING, JSON.stringify(ut, null, 4) + '\n');
    console.log(`Oppdaterte ${ut.length} rader i ${MAPPING}`);
}

if (import.meta.main) {
    const repo = process.argv[2];
    if (!repo) {
        console.error('Bruk: node scripts/ffe-farger.ts <sti til FFE-repoet>');
        process.exit(1);
    }
    main(repo);
}
