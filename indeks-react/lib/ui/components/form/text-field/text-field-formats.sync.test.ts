import { describe, expect, it } from 'vitest';
import { BUILTIN_FORMAT_NAMES as FORMATS_REACT } from './text-field-formats';
import type { FieldFormatter as FieldFormatterReact } from './text-field-formats';
import { BUILTIN_FORMAT_NAMES as FORMATS_WEB } from '@sb1/indeks-web';
import type { FieldFormatter as FieldFormatterWeb } from '@sb1/indeks-web';

// BUILTIN_FORMAT_NAMES og FieldFormatter dupliseres bevisst i indeks-react og indeks-web
// (React skal ikke importere web-modulen i library-kode). Denne testen — en av de tillatte
// web-importene — verifiserer at duplikatene holdes i synk, så `format`-autocomplete og
// formatter-kontrakten i React ikke divergerer fra web.

// ── Compile-time synk-sjekk for FieldFormatter-typen ────────────────────────
// `Equal` er strukturelt strikt (fanger valgfrie felt, readonly, ekstra/manglende
// nøkler i begge retninger). Divergerer typene — f.eks. web legger til et felt —
// gir dette en typefeil under `tsc -b` (test-filene ligger i `lib` og typesjekkes),
// ikke bare i runtime-testen under (som kun ser verdier, ikke typer).
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;
type _AssertFieldFormatterInSync = Expect<Equal<FieldFormatterReact, FieldFormatterWeb>>;

describe('text-field-formats sync', () => {
    it('indeks-react og indeks-web har identiske BUILTIN_FORMAT_NAMES', () => {
        expect(FORMATS_REACT).toStrictEqual(FORMATS_WEB);
    });

    it('FieldFormatter-typene er strukturelt like (compile-time)', () => {
        // Runtime no-op: selve sjekken er typenivået `_AssertFieldFormatterInSync` over.
        // Refererer aliaset her så det ikke fremstår ubrukt for lesere (og for å knytte
        // den til en kjørbar test i rapporten).
        const inSync: _AssertFieldFormatterInSync = true;
        expect(inSync).toBe(true);
    });
});
