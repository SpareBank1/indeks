import { describe, expect, it } from 'vitest';
import { COMMON_ICON_NAMES as COMMON_REACT } from './icon-types';
import { COMMON_ICON_NAMES as COMMON_WEB } from '@sb1/indeks-web';

// COMMON_ICON_NAMES dupliseres bevisst i indeks-react og indeks-web (React skal ikke importere
// web-modulen i library-kode). Denne testen — som er den ene tillatte web-importen — verifiserer
// at de to listene holdes i synk.
describe('COMMON_ICON_NAMES sync', () => {
    it('indeks-react og indeks-web har identiske COMMON_ICON_NAMES', () => {
        expect(COMMON_REACT).toStrictEqual(COMMON_WEB);
    });
});
