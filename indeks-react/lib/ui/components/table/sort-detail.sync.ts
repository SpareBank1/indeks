import type { IxSortDetail as ReactDetail, SortDirection as ReactDirection } from './Table';
import type { IxSortDetail as WebDetail, SortDirection as WebDirection } from '@sb1/indeks-web';

// IxSortDetail og SortDirection dupliseres bevisst i indeks-react og indeks-web.
// Dette er TYPER (ingen runtime-verdi), så synk kan ikke sjekkes med en
// vitest-assert — den verifiseres på compile-time av `tsc`/build: assertene under
// type-sjekker ikke hvis formene divergerer. Derfor ingen `describe/it` her; det
// ville vært en tom test som «består» uansett. Fila er en av de tillatte
// @sb1/indeks-web-importene (kun `import type` — ingen runtime-avhengighet).
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export type _AssertSortDetailInSync = Expect<Equal<ReactDetail, WebDetail>>;
export type _AssertSortDirectionInSync = Expect<Equal<ReactDirection, WebDirection>>;
