import { describe, expect, it } from 'vitest';

// Verifiserer at en verdi som er bevisst duplisert i indeks-react og indeks-web
// holdes i synk. React skal ikke runtime-importere web-modulen i library-kode
// (web lastes fra CDN); `*.sync.test.ts` er den ene tillatte @sb1/indeks-web-importen.
//
// Selve dobbel-importen (react- og web-verdien under alias) skrives eksplisitt i
// hver sync-test. Type-synk (via Equal/Expect-hjelpetyper) håndteres også per fil —
// det er ren TypeScript på filnivå og kan ikke pakkes inn i en runtime-hjelper.
export function describeInSync<T>(navn: string, reactVerdi: T, webVerdi: T): void {
    describe(`${navn} sync`, () => {
        it('indeks-react og indeks-web er identiske', () => {
            expect(reactVerdi).toStrictEqual(webVerdi);
        });
    });
}
