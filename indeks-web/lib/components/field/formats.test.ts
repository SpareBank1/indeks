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

        it('setter separator så snart gruppen foran er full', () => {
            // Full første gruppe (3 siffer) → separatoren dukker opp med én gang.
            expect(fmt.format('123')).toBe('123 ');
            // Halvfylt andre gruppe → ingen ny separator ennå.
            expect(fmt.format('1234')).toBe('123 4');
        });

        it('parse fjerner kun separatorer og gir rå verdi', () => {
            expect(fmt.parse('123 45 678')).toBe('12345678');
        });

        it('parse er tapsfri: beholder tegn som ikke passer (validering fanger feil)', () => {
            expect(fmt.parse('12a34')).toBe('12a34');
        });

        it('parse kutter ikke ved antall slots (tapsfri)', () => {
            expect(fmt.parse('123456789999')).toBe('123456789999');
        });

        it('round-trip parse(format(raw)) === raw', () => {
            for (const raw of ['', '1', '123', '12345678']) {
                expect(fmt.parse(fmt.format(raw))).toBe(raw);
            }
        });

        it('format tåler allerede formatert input (lim inn)', () => {
            expect(fmt.format('123 45 678')).toBe('123 45 678');
        });

        it('viser ekstra tegn utover patternet uformatert til slutt', () => {
            expect(fmt.format('1234567890')).toBe('123 45 67890');
        });

        it('bevarer tegn som ikke passer, i skrevet rekkefølge', () => {
            expect(fmt.format('12a34')).toBe('12a34');
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

        it('setter punktum så snart gruppen foran er full', () => {
            // Full dag (2 siffer) → punktum dukker opp med én gang.
            expect(fmt.format('24')).toBe('24.');
            // Full dag + måned → begge punktum, klar for år.
            expect(fmt.format('2412')).toBe('24.12.');
            // Halvfylt dag → intet punktum ennå.
            expect(fmt.format('2')).toBe('2');
        });

        it('parse fjerner punktum', () => {
            expect(fmt.parse('24.12.2026')).toBe('24122026');
        });

        it('dikter ikke opp separator når neste tegn ikke passer (vist verbatim)', () => {
            // Gruppen er full, men neste tegn er ugyldig ⇒ vi stopper og legger
            // resten uformatert på uten å tvinge inn et punktum (unngår også
            // dobling ved innliming av allerede formatert tekst).
            expect(fmt.format('24a')).toBe('24a');
        });

        it('round-trip holder med etterhengende separator', () => {
            for (const raw of ['', '2', '24', '2412', '24122026']) {
                expect(fmt.parse(fmt.format(raw))).toBe(raw);
            }
        });
    });

    describe('bokstav-slot "aaa"', () => {
        const fmt = createPatternFormatter('aa-aa');

        it('parse fjerner kun separatoren (-), format fyller slots', () => {
            // Tapsfri parse fjerner bare bindestreken; siffer beholdes (validering fanger dem).
            expect(fmt.parse('A1b2ø3')).toBe('A1b2ø3');
            expect(fmt.parse('ab-cd')).toBe('abcd');
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

    it('parse er tapsfri: fjerner kun tusenskillet, beholder alt annet', () => {
        // Ekstra desimaltegn dedupliseres IKKE lenger — validering fanger ugyldig verdi.
        expect(fmt.parse('12,34,56')).toBe('12,34,56');
        expect(fmt.parse('12a34')).toBe('12a34');
    });

    it('round-trip', () => {
        for (const raw of ['', '5', '1234567', '1234567,89']) {
            expect(fmt.parse(fmt.format(raw))).toBe(raw);
        }
    });

    it('format tåler allerede formatert input', () => {
        expect(fmt.format('1 234 567,89')).toBe('1 234 567,89');
    });

    it('bevarer tegn som ikke passer, i skrevet rekkefølge', () => {
        expect(fmt.format('12a34')).toBe('12a34');
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

describe('live-flagg', () => {
    it('de innebygde variantene formaterer live', () => {
        for (const name of ['phone', 'ssn', 'date', 'account', 'orgnr', 'amount']) {
            expect(resolveFormat(name)!.live, name).toBe(true);
        }
    });

    it('egne pattern-/beløps-formattere er blur (live utelatt)', () => {
        expect(createPatternFormatter('000 00 000').live).toBeUndefined();
        expect(createAmountFormatter().live).toBeUndefined();
    });
});
