#!/usr/bin/env node

/* Fjerner `:where()` fra komponentens eget API i indeks-css.
 *
 * Regelen (ADR-DS-009): offentlig API skrives rett fram, altså komponentklassen,
 * BEM-klasser, data-*, aria-* og pseudoklasser. `:where()` brukes bare rundt det
 * som ikke er API: nakne barneelementer og andre komponenter i kontekst.
 *
 *   :where(.ix-button[data-variant='primary']:hover)  →  .ix-button[data-variant='primary']:hover
 *   :where(ix-grid, .ix-grid)                          →  ix-grid, .ix-grid
 *   :where(ix-field, .ix-field) > label                →  :is(ix-field, .ix-field) > :where(label)
 *   :where(.ix-text-field) > input:disabled            →  .ix-text-field > :where(input:disabled)
 *   :where(.ix-message ix-icon[data-badge])            →  .ix-message :where(ix-icon[data-badge])
 *   .ix-chip[data-removable]:where(:hover)             →  .ix-chip[data-removable]:hover
 *
 * Det som ikke kan avgjøres mekanisk, står urørt og listes som MANUELL.
 *
 * Skriptet er idempotent, og finnes for å kunne kjøres på nytt ved merge-konflikt:
 * ta den andres CSS, kjør skriptet, og legg håndrettingene oppå.
 *
 * Bruk:
 *   node scripts/fjern-where.ts indeks-css/css           skriver om filene
 *   node scripts/fjern-where.ts --check indeks-css/css   feiler hvis et anker står i :where()
 *
 * reset.css hoppes over. Den skal tape mot alt og beholder :where().
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import postcss from 'postcss';

type Del = { type: 'sammensatt' | 'kombinator'; tekst: string };

export type Resultat = { selektor: string; manuell: boolean };

/** Splitter på tegn på toppnivå, utenfor parenteser, klammer og strenger. */
export function splittToppniva(tekst: string, skilletegn: string): string[] {
    const deler: string[] = [];
    let dybde = 0;
    let streng: string | null = null;
    let start = 0;
    for (let i = 0; i < tekst.length; i++) {
        const c = tekst[i];
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
        else if (c === skilletegn && dybde === 0) {
            deler.push(tekst.slice(start, i));
            start = i + 1;
        }
    }
    deler.push(tekst.slice(start));
    return deler;
}

/** Deler en kompleks selektor i sammensatte selektorer og kombinatorer. */
export function delOpp(selektor: string): Del[] {
    const deler: Del[] = [];
    let dybde = 0;
    let streng: string | null = null;
    let gjeldende = '';
    let kombinator = '';
    const skyvSammensatt = () => {
        if (gjeldende) deler.push({ type: 'sammensatt', tekst: gjeldende });
        gjeldende = '';
    };
    for (let i = 0; i < selektor.length; i++) {
        const c = selektor[i];
        if (c === '\\') {
            gjeldende += c + (selektor[i + 1] ?? '');
            i++;
            continue;
        }
        if (streng) {
            gjeldende += c;
            if (c === streng) streng = null;
            continue;
        }
        const erKombinator = dybde === 0 && (/\s/.test(c) || c === '>' || c === '+' || c === '~');
        if (erKombinator) {
            skyvSammensatt();
            kombinator += c;
            continue;
        }
        if (kombinator) {
            deler.push({ type: 'kombinator', tekst: kombinator });
            kombinator = '';
        }
        if (c === '"' || c === "'") streng = c;
        else if (c === '(' || c === '[') dybde++;
        else if (c === ')' || c === ']') dybde--;
        gjeldende += c;
    }
    skyvSammensatt();
    if (kombinator) deler.push({ type: 'kombinator', tekst: kombinator });
    return deler;
}

/** Finner `:where(` på posisjon `fra` og returnerer innholdet og indeksen etter `)`. */
function lesWhere(tekst: string, fra: number): { innhold: string; slutt: number } | null {
    return lesParentes(tekst, ':where', fra);
}

/** Som lesWhere, for en vilkårlig pseudoklasse med argument, f.eks. `:is`. */
function lesParentes(tekst: string, navn: string, fra = 0): { innhold: string; slutt: number } | null {
    if (!tekst.startsWith(`${navn}(`, fra)) return null;
    let dybde = 0;
    let streng: string | null = null;
    for (let i = fra + navn.length; i < tekst.length; i++) {
        const c = tekst[i];
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
        else if (c === ')' || c === ']') {
            dybde--;
            if (dybde === 0) return { innhold: tekst.slice(fra + navn.length + 1, i), slutt: i + 1 };
        }
    }
    return null;
}

const ANKER = /^(\.ix-[a-z0-9-]+(?:__[a-z0-9-]+)?|ix-[a-z0-9-]+|&)/;
const ELEMENT = /^([a-z][a-z0-9]*)(?![a-z0-9-]*__)/;

/** Blokknavnet til et anker: `.ix-text-field__input` og `.ix-card--clickable` gir `ix-text-field` og `ix-card`. */
function blokk(sammensatt: string): string | null {
    const m = sammensatt.match(/^\.?(ix-[a-z0-9_-]+)/);
    return m ? m[1].split(/__|--/)[0] : null;
}

function erEnkelSammensatt(tekst: string): boolean {
    return delOpp(tekst.trim()).length === 1;
}

/** Innhold som bare er pseudoklasser og attributter, f.eks. `:hover` eller `[open]`. */
function erBareTilstand(tekst: string): boolean {
    return splittToppniva(tekst, ',').every((d) => {
        const t = d.trim();
        return (t.startsWith(':') || t.startsWith('[')) && erEnkelSammensatt(t);
    });
}

/** Pakker ut `:where(:hover)` og liknende inne i en sammensatt selektor. */
function pakkUtTilstander(sammensatt: string): { tekst: string; manuell: boolean } {
    let ut = '';
    let manuell = false;
    for (let i = 0; i < sammensatt.length; ) {
        const w = sammensatt.startsWith(':where(', i) ? lesWhere(sammensatt, i) : null;
        if (!w) {
            ut += sammensatt[i];
            i++;
            continue;
        }
        if (erBareTilstand(w.innhold)) {
            const deler = splittToppniva(w.innhold, ',').map((d) => d.trim());
            ut += deler.length === 1 ? deler[0] : `:is(${deler.join(', ')})`;
        } else {
            ut += sammensatt.slice(i, w.slutt);
            manuell = manuell || i > 0;
        }
        i = w.slutt;
    }
    return { tekst: ut, manuell };
}

/** Skiller ut et avsluttende pseudo-element, som ikke kan stå inne i :where(). */
function delPseudoElement(sammensatt: string): [string, string] {
    const i = sammensatt.indexOf('::');
    return i === -1 ? [sammensatt, ''] : [sammensatt.slice(0, i), sammensatt.slice(i)];
}

/** Regel 2: en sammensatt selektor etter ankeret. */
function behandleEtterAnker(sammensatt: string, ankerBlokk: string | null): { tekst: string; manuell: boolean } {
    const w = sammensatt.startsWith(':where(') ? lesWhere(sammensatt, 0) : null;
    if (w) {
        const innhold = w.innhold.trim();
        const rest = sammensatt.slice(w.slutt);
        const liste = splittToppniva(innhold, ',');
        // En liste av enkle ledd, f.eks. :where(button, a.ix-button), er allerede riktig form.
        if (liste.length > 1) {
            return { tekst: sammensatt, manuell: !liste.every((d) => erEnkelSammensatt(d)) };
        }
        // Kombinatorer inni, f.eks. :where(.ix-checkbox label): behandle hvert ledd for seg.
        // `X :where(A B)` blir `X A B`, som krever at A ligger inne i X. For en
        // komponent inne i en annen er det alltid tilfellet.
        if (!erEnkelSammensatt(innhold)) {
            const indre = delOpp(innhold);
            const siste = indre[indre.length - 1];
            if (rest && siste.type === 'sammensatt') siste.tekst += rest;
            return behandleResten(indre, ankerBlokk);
        }
        if (erBareTilstand(innhold) || (blokk(innhold) && blokk(innhold) === ankerBlokk)) {
            return pakkUtTilstander(innhold + rest);
        }
        // Allerede riktig form: nakent element eller annen blokk i :where().
        const etter = pakkUtTilstander(rest);
        return { tekst: sammensatt.slice(0, w.slutt) + etter.tekst, manuell: etter.manuell };
    }

    const { tekst, manuell } = pakkUtTilstander(sammensatt);
    const egenBlokk = blokk(tekst);
    if (egenBlokk) {
        if (egenBlokk === ankerBlokk) return { tekst, manuell };
        const [kjerne, pseudoElement] = delPseudoElement(tekst);
        return { tekst: `:where(${kjerne})${pseudoElement}`, manuell };
    }
    // Et nakent element er intern struktur, og det er tilstandene på det også. Hele
    // den sammensatte selektoren pakkes, så `input:checked` ikke slår en tilstand på
    // komponenten selv. BEM-klassen (`.ix-text-field__input:disabled`) er API-veien.
    if (ELEMENT.test(tekst)) {
        const [kjerne, pseudoElement] = delPseudoElement(tekst);
        return { tekst: `:where(${kjerne})${pseudoElement}`, manuell };
    }
    return { tekst, manuell };
}

/** Regel 2 for alle deler etter ankeret. */
function behandleResten(deler: Del[], ankerBlokk: string | null): { tekst: string; manuell: boolean } {
    let manuell = false;
    const tekst = deler
        .map((d) => {
            if (d.type === 'kombinator') return d.tekst;
            const r = behandleEtterAnker(d.tekst, ankerBlokk);
            manuell = manuell || r.manuell;
            return r.tekst;
        })
        .join('');
    return { tekst, manuell };
}

/** Transformerer én kompleks selektor (uten komma på toppnivå). */
export function transformer(selektor: string): Resultat {
    const ledende = selektor.match(/^\s*/)![0];
    const etterfolgende = selektor.match(/\s*$/)![0];
    const kjerne = selektor.trim();
    if (!kjerne.includes(':where(')) return { selektor, manuell: false };

    const deler = delOpp(kjerne);
    const forste = deler[0];
    if (!forste || forste.type !== 'sammensatt') return { selektor, manuell: true };
    const resten = deler.slice(1);

    const w = forste.tekst.startsWith(':where(') ? lesWhere(forste.tekst, 0) : null;

    // Ankeret står ikke i :where(): pakk ut tilstander i ankeret, behandle resten.
    if (!w) {
        const er = forste.tekst.startsWith(':is(') ? lesParentes(forste.tekst, ':is') : null;
        if (er) {
            const ankre = splittToppniva(er.innhold, ',').map((d) => d.trim());
            if (ankre.every((d) => ANKER.test(d) && erEnkelSammensatt(d))) {
                const r = behandleResten(resten, blokk(ankre.find((d) => d.startsWith('.')) ?? ankre[0]));
                const suffiks = pakkUtTilstander(forste.tekst.slice(er.slutt));
                return {
                    selektor: ledende + forste.tekst.slice(0, er.slutt) + suffiks.tekst + r.tekst + etterfolgende,
                    manuell: r.manuell || suffiks.manuell,
                };
            }
        }
        if (!ANKER.test(forste.tekst)) return { selektor, manuell: true };
        const anker = pakkUtTilstander(forste.tekst);
        const r = behandleResten(resten, blokk(forste.tekst));
        return { selektor: ledende + anker.tekst + r.tekst + etterfolgende, manuell: anker.manuell || r.manuell };
    }

    const suffiks = forste.tekst.slice(w.slutt);
    const liste = splittToppniva(w.innhold, ',').map((d) => d.trim());

    // Dual target: :where(ix-grid, .ix-grid).
    if (liste.length > 1) {
        const alleAnkre = liste.every((d) => ANKER.test(d) && erEnkelSammensatt(d));
        if (!alleAnkre) {
            // Ledd med kombinatorer, f.eks. :where(.ix-combobox [role='option'], .ix-combobox__option):
            // fordel suffiks og resten på hvert ledd, og behandle dem hver for seg.
            if (!liste.every((d) => ANKER.test(d))) return { selektor, manuell: true };
            const restTekst = resten.map((d) => d.tekst).join('');
            const deler = liste.map((d) => transformer(`:where(${d})${suffiks}${restTekst}`));
            return {
                selektor: ledende + deler.map((d) => d.selektor).join(', ') + etterfolgende,
                manuell: deler.some((d) => d.manuell),
            };
        }
        const ankerBlokk = blokk(liste.find((d) => d.startsWith('.')) ?? liste[0]);
        const r = behandleResten(resten, ankerBlokk);
        const etterSuffiks = pakkUtTilstander(suffiks);
        if (resten.length === 0) {
            const deler = liste.map((d) => pakkUtTilstander(d + suffiks).tekst);
            return { selektor: ledende + deler.join(', ') + etterfolgende, manuell: etterSuffiks.manuell };
        }
        return {
            selektor: ledende + `:is(${liste.join(', ')})` + etterSuffiks.tekst + r.tekst + etterfolgende,
            manuell: r.manuell || etterSuffiks.manuell,
        };
    }

    // Én selektor i :where(), eventuelt med kombinatorer inni.
    const indre = delOpp(liste[0]);
    if (!indre[0] || !ANKER.test(indre[0].tekst)) return { selektor, manuell: true };
    const ankerBlokk = blokk(indre[0].tekst);
    const anker = pakkUtTilstander(indre[0].tekst);
    const indreResten = indre.slice(1);
    // Suffikset etter :where() hører til den siste sammensatte selektoren inni.
    if (suffiks) {
        if (indreResten.length === 0) anker.tekst += suffiks;
        else indreResten[indreResten.length - 1] = { type: 'sammensatt', tekst: indreResten[indreResten.length - 1].tekst + suffiks };
    }
    const r1 = behandleResten(indreResten, ankerBlokk);
    const r2 = behandleResten(resten, ankerBlokk);
    return {
        selektor: ledende + anker.tekst + r1.tekst + r2.tekst + etterfolgende,
        manuell: anker.manuell || r1.manuell || r2.manuell,
    };
}

/** Transformerer en hel selektorliste og bevarer formateringen mellom delene. */
export function transformerListe(selektor: string): { selektor: string; manuelle: string[] } {
    const manuelle: string[] = [];
    const deler = splittToppniva(selektor, ',').map((del) => {
        const r = transformer(del);
        if (r.manuell) manuelle.push(del.trim());
        return r.selektor;
    });
    return { selektor: deler.join(','), manuelle };
}

/** Et anker som fortsatt står i :where(), på starten av en selektor. */
export function harAnkerIWhere(selektor: string): boolean {
    return splittToppniva(selektor, ',').some((d) => /^:where\(\s*(\.ix-|ix-)/.test(d.trim()));
}

export function transformerCss(css: string, fil: string): { css: string; manuelle: string[] } {
    const rot = postcss.parse(css, { from: fil });
    const manuelle: string[] = [];
    rot.walkRules((regel) => {
        const r = transformerListe(regel.selector);
        if (r.selektor !== regel.selector) regel.selector = r.selektor;
        for (const m of r.manuelle) manuelle.push(`${fil}:${regel.source?.start?.line ?? 0} ${m.replace(/\s+/g, ' ')}`);
    });
    return { css: rot.toString(), manuelle };
}

/** Selektorer der ankeret fortsatt står i :where(). Brukes av --check. */
export function sjekkCss(css: string, fil: string): string[] {
    const funn: string[] = [];
    postcss.parse(css, { from: fil }).walkRules((regel) => {
        if (harAnkerIWhere(regel.selector)) {
            funn.push(`${fil}:${regel.source?.start?.line ?? 0} ${regel.selector.replace(/\s+/g, ' ')}`);
        }
    });
    return funn;
}

function finnCssFiler(sti: string): string[] {
    if (statSync(sti).isFile()) return [sti];
    return readdirSync(sti)
        .sort()
        .flatMap((navn) => finnCssFiler(join(sti, navn)))
        .filter((f) => f.endsWith('.css') && basename(f) !== 'reset.css');
}

function main(argv: string[]) {
    const sjekk = argv.includes('--check');
    const stier = argv.filter((a) => a !== '--check');
    if (stier.length === 0) {
        console.error('Bruk: node scripts/fjern-where.ts [--check] <mappe eller fil...>');
        process.exit(2);
    }
    const filer = stier.flatMap(finnCssFiler);

    if (sjekk) {
        const funn = filer.flatMap((fil) => sjekkCss(readFileSync(fil, 'utf8'), relative(process.cwd(), fil)));
        for (const f of funn) console.log(`ANKER I :where() ${f}`);
        if (funn.length > 0) {
            console.error(`\n${funn.length} selektorer har ankeret i :where(). Se ADR-DS-009.`);
            process.exit(1);
        }
        return;
    }

    const alleManuelle: string[] = [];
    let endret = 0;
    for (const fil of filer) {
        const for_ = readFileSync(fil, 'utf8');
        const { css, manuelle } = transformerCss(for_, relative(process.cwd(), fil));
        alleManuelle.push(...manuelle);
        if (css !== for_) {
            writeFileSync(fil, css);
            endret++;
        }
    }
    for (const m of alleManuelle) console.log(`MANUELL ${m}`);
    console.log(`\n${endret} filer endret, ${alleManuelle.length} selektorer må sees på for hånd.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main(process.argv.slice(2));
