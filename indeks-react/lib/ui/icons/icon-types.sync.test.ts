import { COMMON_ICON_NAMES as COMMON_REACT } from './icon-types';
import { COMMON_ICON_NAMES as COMMON_WEB } from '@sb1/indeks-web';
import { describeInSync } from '@/test-utils/sync';

// COMMON_ICON_NAMES dupliseres bevisst i indeks-react og indeks-web (React skal ikke importere
// web-modulen i library-kode). Denne testen — som er en av de tillatte web-importene — verifiserer
// at de to listene holdes i synk.
describeInSync('COMMON_ICON_NAMES', COMMON_REACT, COMMON_WEB);
