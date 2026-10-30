#!/usr/bin/env node

/* Sjekker selektorregelen i ADR-DS-009 («Selektorer og spesifisitet») for indeks-css.
 *
 * Feiler på:
 *   where     `:where()` utenfor reset.css
 *   modifier  BEM-modifier (`.ix-x--y`). Tilstand og varianter ligger i data-*, aria-* og pseudoklasser
 *   type      `input[type='checkbox']` eller `input[type='radio']` inni en komponent. `input` er nok
 *
 * Filer som ikke er skrevet om ennå, står i selektor-allowliste.txt. Lista skal bare
 * krympe: en fil som står der uten brudd, gir også feil, så den må fjernes.
 *
 * Bruk: node ../scripts/check-css-selektorer.ts <css-mappe> [allowliste]
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import postcss from 'postcss';

export type Regel = 'where' | 'modifier' | 'type';

export type Brudd = { fil: string; linje: number; regel: Regel; selektor: string };

const MELDING: Record<Regel, string> = {
    where: 'ingen :where() utenfor reset.css',
    modifier: 'ingen BEM-modifier, bruk data-*, aria-* eller en pseudoklasse',
    type: "overflødig [type], skriv input inni komponenten",
};

/** Splitter en selektorliste på komma på toppnivå, utenfor parenteser, klammer og strenger. */
export function splittSelektorer(liste: string): string[] {
    const deler: string[] = [];
    let dybde = 0;
    let streng: string | null = null;
    let start = 0;
    for (let i = 0; i < liste.length; i++) {
        const c = liste[i];
        if (c === '\\') {
            i++;
            continue;
        }
        if (streng) {
            if (c === streng) streng = null;
            continue;
        }
        if (c === '"' || c === "'") streng = c;
        else if (c === '(' || c === '[') dybde++;
        else if (c === ')' || c === ']') dybde--;
        else if (c === ',' && dybde === 0) {
            deler.push(liste.slice(start, i));
            start = i + 1;
        }
    }
    deler.push(liste.slice(start));
    return deler.map((d) => d.trim()).filter(Boolean);
}

/** Fjerner strenger, så `[data-x='a--b']` ikke ser ut som en modifier. */
function utenStrenger(selektor: string): string {
    return selektor.replace(/'[^']*'|"[^"]*"/g, "''");
}

export function sjekkSelektor(selektor: string): Regel[] {
    const s = utenStrenger(selektor);
    const brudd: Regel[] = [];
    if (/:where\(/.test(s)) brudd.push('where');
    if (/\.ix-[\w-]*?--[\w-]/.test(s)) brudd.push('modifier');
    const type = selektor.search(/input\[type=(['"]?)(checkbox|radio)\1\]/);
    if (type > 0 && /(^|[\s>+~(,])\.?ix-/.test(selektor.slice(0, type))) brudd.push('type');
    return brudd;
}

export function sjekkCss(css: string, fil: string): Brudd[] {
    const brudd: Brudd[] = [];
    postcss.parse(css, { from: fil }).walkRules((regel) => {
        const forelder = regel.parent;
        if (forelder?.type === 'atrule' && /keyframes$/.test((forelder as postcss.AtRule).name)) return;
        for (const selektor of splittSelektorer(regel.selector)) {
            for (const r of sjekkSelektor(selektor)) {
                brudd.push({ fil, linje: regel.source?.start?.line ?? 0, regel: r, selektor });
            }
        }
    });
    return brudd;
}

function cssFiler(mappe: string): string[] {
    return readdirSync(mappe).flatMap((navn) => {
        const sti = join(mappe, navn);
        if (statSync(sti).isDirectory()) return cssFiler(sti);
        return navn.endsWith('.css') ? [sti] : [];
    });
}

export function lesAllowliste(tekst: string): string[] {
    return tekst
        .split('\n')
        .map((l) => l.replace(/#.*/, '').trim())
        .filter(Boolean);
}

function main(mappe: string, allowlisteSti: string): number {
    const tillatt = new Set(existsSync(allowlisteSti) ? lesAllowliste(readFileSync(allowlisteSti, 'utf8')) : []);
    const feil: string[] = [];
    const sett = new Set<string>();

    for (const sti of cssFiler(mappe).sort()) {
        const fil = relative(mappe, sti);
        if (fil === 'reset.css') continue;
        sett.add(fil);
        const brudd = sjekkCss(readFileSync(sti, 'utf8'), fil);
        if (tillatt.has(fil)) {
            if (brudd.length === 0) feil.push(`${fil}: står i allowlisten, men har ingen brudd. Fjern den fra lista.`);
            continue;
        }
        for (const b of brudd) feil.push(`${b.fil}:${b.linje}  ${MELDING[b.regel]}\n    ${b.selektor}`);
    }
    for (const fil of tillatt) {
        if (!sett.has(fil)) feil.push(`${fil}: står i allowlisten, men finnes ikke. Fjern den fra lista.`);
    }

    if (feil.length) {
        console.error(feil.join('\n'));
        console.error(`\n${feil.length} feil. Regelen står i ADR-DS-009, «Selektorer og spesifisitet».`);
        return 1;
    }
    return 0;
}

if (import.meta.main) {
    const [mappe, allowliste] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
    if (!mappe) {
        console.error('Bruk: node ../scripts/check-css-selektorer.ts <css-mappe> [allowliste]');
        process.exitCode = 2;
    } else {
        // exitCode, ikke exit(): exit() kutter stderr når utskriften er lang.
        process.exitCode = main(mappe, allowliste ?? join(mappe, '..', 'selektor-allowliste.txt'));
    }
}
