import React, { type ReactNode } from 'react';
import styles from './byggeklosser.module.css';

/** Tre farger: mørk og lys blå, og hvit for flater. Verdiene står i byggeklosser.module.css. */
export type Farge = 'mørk' | 'lys' | 'hvit';

const klasser = (fyll?: Farge, kant?: Farge) =>
    [fyll ? styles[`fyll-${fyll}`] : styles['fyll-ingen'], kant && styles[`kant-${kant}`]].filter(Boolean).join(' ');

/** Rammen alle illustrasjonene deler. Motivet skal holde seg innenfor 40–240 × 24–136. */
export function Illustrasjon({ children }: { children: ReactNode }) {
    return (
        <svg className={styles.illustrasjon} viewBox="0 0 280 160" aria-hidden="true" focusable="false">
            {children}
        </svg>
    );
}

/** Felt, knapper, paneler og celler. */
export function Flate({
    x,
    y,
    w,
    h,
    fyll,
    kant,
    r = 8,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    fyll?: Farge;
    kant?: Farge;
    r?: number;
}) {
    return <rect className={klasser(fyll, kant)} x={x} y={y} width={w} height={h} rx={r} />;
}

/** Én linje tekst. Står i stedet for ekte ord, så illustrasjonen ikke må oversettes. */
export function Tekst({ x, y, w, fyll = 'lys' }: { x: number; y: number; w: number; fyll?: Farge }) {
    return <rect className={klasser(fyll)} x={x} y={y} width={w} height={8} rx={4} />;
}

/** Radioknapper, statusikoner og andre runde former. */
export function Prikk({
    cx,
    cy,
    r = 10,
    fyll,
    kant,
}: {
    cx: number;
    cy: number;
    r?: number;
    fyll?: Farge;
    kant?: Farge;
}) {
    return <circle className={klasser(fyll, kant)} cx={cx} cy={cy} r={r} />;
}

const glyfer = {
    'chevron-ned': 'M3 6l5 5 5-5',
    'chevron-opp': 'M3 10l5-5 5 5',
    'chevron-høyre': 'M6 3l5 5-5 5',
    'chevron-venstre': 'M10 3l-5 5 5 5',
    'pil-høyre': 'M2 8h12M9 3l5 5-5 5',
    'pil-venstre': 'M14 8H2M7 3L2 8l5 5',
    'pil-opp': 'M8 14V2M3 7l5-5 5 5',
    kryss: 'M3 3l10 10M13 3L3 13',
    pluss: 'M8 2v12M2 8h12',
    hake: 'M2 8.5l4 4 8-9',
} as const;

export type GlyfNavn = keyof typeof glyfer;

/** Små strektegn som chevron, pil og kryss. Tegnet i en 16 × 16-boks med øvre venstre hjørne i (x, y). */
export function Glyf({ navn, x, y, farge = 'mørk' }: { navn: GlyfNavn; x: number; y: number; farge?: Farge }) {
    return <path className={styles[`glyf-${farge}`]} d={glyfer[navn]} transform={`translate(${x} ${y})`} />;
}
