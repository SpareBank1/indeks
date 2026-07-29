import { cn as cnReact, type ClassValue } from '@/cn';
import { cn as cnWeb } from '@sb1/indeks-web';
import { describeInSync } from '@/test-utils/sync';

// cn dupliseres bevisst i indeks-react og indeks-web. Siden cn er en funksjon (ikke
// en verdi-liste) synkes den ved å kjøre et representativt sett input gjennom begge
// og sammenligne output. Dette er den ene tillatte @sb1/indeks-web-importen.
const full = false;
const wide = true;
const CASES: ClassValue[][] = [
    ['ix-a', 'ix-b'],
    ['ix-a', false, undefined, null, 'ix-b'],
    ['ix-button', full && 'ix-w-full', wide && 'ix-wide'],
    [{ 'ix-a': true, 'ix-b': false, 'ix-c': undefined }],
    [{ 'ix-a': 0, 'ix-b': 1 }],
    [{ [`ix-m-${'md'}`]: 'md', [`ix-px-${undefined}`]: undefined }],
    ['ix-table', [`ix-table--${'md'}`], 'ix-x'],
    ['ix-a', ['ix-b', ['ix-c', false]]],
    ['ix-text', { 'ix-mb-md': true, 'ix-text--long': false }, undefined],
    [],
    [undefined],
    [false, null, { 'ix-a': false }],
];

describeInSync(
    'cn output',
    CASES.map((args) => cnReact(...args)),
    CASES.map((args) => cnWeb(...args)),
);
