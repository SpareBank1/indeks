import type { ProgressBarState as ReactState } from './ProgressBar';
import type { ProgressBarState as WebState } from '@sb1/indeks-web';

// ProgressBarState dupliseres bevisst i indeks-react og indeks-web. Dette er en
// TYPE (ingen runtime-verdi), så synk kan ikke sjekkes med en vitest-assert — den
// verifiseres på compile-time av `tsc`/build: asserten under type-sjekker ikke hvis
// unionene divergerer. Derfor ingen `describe/it` her; det ville vært en tom test
// som «består» uansett. Fila er en av de tillatte @sb1/indeks-web-importene (kun
// `import type` — ingen runtime-avhengighet).
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export type _AssertProgressBarStateInSync = Expect<Equal<ReactState, WebState>>;
