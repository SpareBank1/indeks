import { describe, expect, it } from 'vitest';
import { ICON_NAMES as ICON_NAMES_REACT } from './icon-types';
import { ICON_NAMES as ICON_NAMES_WEB } from '@sb1/indeks-web';

describe('ICON_NAMES sync', () => {
    it('indeks-react og indeks-web har identiske ICON_NAMES', () => {
        expect(ICON_NAMES_REACT).toStrictEqual(ICON_NAMES_WEB);
    });
});
