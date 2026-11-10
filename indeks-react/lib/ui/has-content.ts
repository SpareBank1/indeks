import type { ReactNode } from 'react';

/** Sann for alt React rendrer synlig, også tallet 0. `&&` ville rendret 0 som løs tekst uten wrapper. */
export function hasContent(node: ReactNode): boolean {
    return node !== undefined && node !== null && node !== false && node !== '';
}
