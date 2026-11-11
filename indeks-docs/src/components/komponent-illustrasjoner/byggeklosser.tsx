import React, { type ReactNode } from 'react';
import styles from './byggeklosser.module.css';

/** Fargene står i byggeklosser.module.css, så mørkt tema og høykontrast følger med. */
export type Tone = 'standard' | 'kant' | 'tekst' | 'tekst-svak' | 'aksent' | 'aksent-svak' | 'invers';

const tone = (t: Tone) => styles[t];

/** Rammen alle illustrasjonene deler. Motivet skal holde seg innenfor 20–260 × 20–140. */
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
    t = 'standard',
    r = 8,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    t?: Tone;
    r?: number;
}) {
    return <rect className={tone(t)} x={x} y={y} width={w} height={h} rx={r} />;
}

/** Én linje tekst. Står i stedet for ekte ord, så illustrasjonen ikke må oversettes. */
export function Tekst({ x, y, w, t = 'tekst' }: { x: number; y: number; w: number; t?: Tone }) {
    return <rect className={tone(t)} x={x} y={y} width={w} height={8} rx={4} />;
}

/** Radioknapper, statusikoner og andre runde former. */
export function Prikk({ cx, cy, r = 10, t = 'standard' }: { cx: number; cy: number; r?: number; t?: Tone }) {
    return <circle className={tone(t)} cx={cx} cy={cy} r={r} />;
}
