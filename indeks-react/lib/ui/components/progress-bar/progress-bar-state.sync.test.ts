import { describe, it } from 'vitest';
import type { ProgressBarState as ReactState } from './ProgressBar';
import type { ProgressBarState as WebState } from '@sb1/indeks-web';

// ProgressBarState dupliseres bevisst i indeks-react og indeks-web. Dette er en
// TYPE (ingen runtime-verdi), så synk verifiseres på compile-time: testen feiler
// å type-sjekke hvis unionene divergerer. Denne fila er en av de tillatte
// @sb1/indeks-web-importene (kun `import type` — ingen runtime-avhengighet).
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export type _AssertProgressBarStateInSync = Expect<Equal<ReactState, WebState>>;

describe('ProgressBarState sync', () => {
    it('indeks-react og indeks-web har identisk ProgressBarState (compile-time)', () => {
        // Selve synk-sjekken er type-nivå (_AssertProgressBarStateInSync over).
        // Denne it-blokken finnes så testkjøreren rapporterer synk-status eksplisitt.
    });
});
