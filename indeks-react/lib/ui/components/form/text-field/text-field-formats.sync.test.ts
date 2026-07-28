import { describe, expect, it } from 'vitest';
import { BUILTIN_FORMAT_NAMES as FORMATS_REACT } from './text-field-formats';
import { BUILTIN_FORMAT_NAMES as FORMATS_WEB } from '@sb1/indeks-web';

// BUILTIN_FORMAT_NAMES dupliseres bevisst i indeks-react og indeks-web (React skal ikke
// importere web-modulen i library-kode). Denne testen — en av de tillatte web-importene —
// verifiserer at listene holdes i synk, så `format`-autocomplete i React ikke divergerer
// fra hva registryen i web faktisk registrerer.
describe('BUILTIN_FORMAT_NAMES sync', () => {
    it('indeks-react og indeks-web har identiske BUILTIN_FORMAT_NAMES', () => {
        expect(FORMATS_REACT).toStrictEqual(FORMATS_WEB);
    });
});
