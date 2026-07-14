import { describe, expect, it } from 'vitest';
import {
    amountFormatterForLocale,
    createAmountFormatter,
    createPatternFormatter,
    registerFormat,
    resolveFormat,
    type FieldFormatter,
} from './formats';

describe('createPatternFormatter', () => {
    describe('telefon "000 00 000"', () => {
        const fmt = createPatternFormatter('000 00 000');

        it('formaterer fullt nummer med separatorer', () => {
            expect(fmt.format('12345678')).toBe('123 45 678');
        });

        it('formaterer delvis nummer uten dinglende separator', () => {
            expect(fmt.format('123')).toBe('123');
            expect(fmt.format('1234')).toBe('123 4');
        });

        it('parse fjerner separatorer og gir rå verdi', () => {
            expect(fmt.parse('123 45 678')).toBe('12345678');
        });

        it('parse dropper ugyldige tegn', () => {
            expect(fmt.parse('12a34')).toBe('1234');
        });

        it('parse kutter ved antall slots', () => {
            expect(fmt.parse('123456789999')).toBe('12345678');
        });

        it('round-trip parse(format(raw)) === raw', () => {
            for (const raw of ['', '1', '123', '12345678']) {
                expect(fmt.parse(fmt.format(raw))).toBe(raw);
            }
        });

        it('format tåler allerede formatert input (lim inn)', () => {
            expect(fmt.format('123 45 678')).toBe('123 45 678');
        });
    });

    describe('fødselsnummer "000000 00000"', () => {
        const fmt = createPatternFormatter('000000 00000');

        it('formaterer 11 siffer med mellomrom etter 6', () => {
            expect(fmt.format('01019012345')).toBe('010190 12345');
        });

        it('parse gir 11 rene siffer', () => {
            expect(fmt.parse('010190 12345')).toBe('01019012345');
        });
    });

    describe('dato "00.00.0000"', () => {
        const fmt = createPatternFormatter('00.00.0000');

        it('formaterer med punktum', () => {
            expect(fmt.format('24122026')).toBe('24.12.2026');
        });

        it('formaterer delvis uten dinglende punktum', () => {
            expect(fmt.format('24')).toBe('24');
            expect(fmt.format('2412')).toBe('24.12');
        });

        it('parse fjerner punktum', () => {
            expect(fmt.parse('24.12.2026')).toBe('24122026');
        });
    });

    describe('bokstav-slot "aaa"', () => {
        const fmt = createPatternFormatter('aa-aa');

        it('beholder bokstaver inkl. æøå, dropper siffer', () => {
            expect(fmt.parse('A1b2ø3')).toBe('Abø');
            expect(fmt.format('abcd')).toBe('ab-cd');
        });
    });
});

describe('createAmountFormatter', () => {
    const fmt = createAmountFormatter({ groupSeparator: ' ', decimalSeparator: ',' });

    it('setter tusenskille', () => {
        expect(fmt.format('1234567')).toBe('1 234 567');
    });

    it('beholder desimaler', () => {
        expect(fmt.format('1234567,89')).toBe('1 234 567,89');
    });

    it('tom verdi gir tom streng', () => {
        expect(fmt.format('')).toBe('');
    });

    it('parse fjerner tusenskille men beholder desimalskilletegn', () => {
        expect(fmt.parse('1 234 567,89')).toBe('1234567,89');
    });

    it('parse ignorerer ekstra desimalskilletegn', () => {
        expect(fmt.parse('12,34,56')).toBe('12,3456');
    });

    it('round-trip', () => {
        for (const raw of ['', '5', '1234567', '1234567,89']) {
            expect(fmt.parse(fmt.format(raw))).toBe(raw);
        }
    });

    it('format tåler allerede formatert input', () => {
        expect(fmt.format('1 234 567,89')).toBe('1 234 567,89');
    });
});

describe('amountFormatterForLocale', () => {
    it('nb-NO bruker mellomrom og komma', () => {
        const fmt = amountFormatterForLocale('nb-NO');
        // nb-NO grupperer med non-breaking/narrow space — sjekk at siffer/desimal er intakt
        expect(fmt.parse(fmt.format('1234567,89'))).toBe('1234567,89');
    });

    it('en-US bruker komma-gruppe og punktum-desimal', () => {
        const fmt = amountFormatterForLocale('en-US');
        expect(fmt.format('1234567.89')).toBe('1,234,567.89');
        expect(fmt.parse('1,234,567.89')).toBe('1234567.89');
    });
});

describe('registry', () => {
    it('innebygde varianter er registrert', () => {
        expect(resolveFormat('phone')).toBeDefined();
        expect(resolveFormat('ssn')).toBeDefined();
        expect(resolveFormat('date')).toBeDefined();
        expect(resolveFormat('account')).toBeDefined();
        expect(resolveFormat('orgnr')).toBeDefined();
        expect(resolveFormat('amount')).toBeDefined();
    });

    it('phone-varianten formaterer korrekt', () => {
        expect(resolveFormat('phone')!.format('12345678')).toBe('123 45 678');
    });

    it('account-varianten formaterer kontonummer (4-2-5)', () => {
        expect(resolveFormat('account')!.format('12345678903')).toBe('1234 56 78903');
        expect(resolveFormat('account')!.parse('1234 56 78903')).toBe('12345678903');
    });

    it('orgnr-varianten formaterer organisasjonsnummer (3-3-3)', () => {
        expect(resolveFormat('orgnr')!.format('123456789')).toBe('123 456 789');
        expect(resolveFormat('orgnr')!.parse('123 456 789')).toBe('123456789');
    });

    it('ukjent navn gir undefined', () => {
        expect(resolveFormat('finnes-ikke')).toBeUndefined();
    });

    it('kan registrere egen variant', () => {
        const custom: FieldFormatter = createPatternFormatter('00-00-00');
        registerFormat('custom-test', custom);
        expect(resolveFormat('custom-test')!.format('123456')).toBe('12-34-56');
    });
});
