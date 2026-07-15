/**
 * Input-formatering for ix-field — rene funksjoner, pattern-kompilator og registry.
 *
 * ## Filosofi: formatering, ikke masking
 *
 * Dette er IKKE en live tegn-maske som avviser tastetrykk mens man skriver.
 * Mekanismen bygger på **format-on-blur**: brukeren skriver fritt, feltet
 * formateres når det mister fokus, og går tilbake til rå (redigerbar) form når
 * det får fokus igjen. Det unngår caret-hopp og skjermleser-relesing som følger
 * med per-tegn-maskering — en bevisst a11y-beslutning (jf. GOV.UK-frarådingen mot
 * å reformatere telefonnummer mens brukeren skriver).
 *
 * ## Kontrakten
 *
 * En formatter er et par rene funksjoner:
 *   - `format(raw)`  : rå verdi → visningsstreng   ("12345678" → "123 45 678")
 *   - `parse(vist)`  : visningsstreng → rå verdi    ("123 45 678" → "12345678")
 *
 * Den **rå verdien** er alltid sannheten. Konsumenten lagrer og validerer den rå
 * verdien; visningsstrengen er kun presentasjon. `parse(format(raw)) === raw` skal
 * holde for enhver gyldig rå verdi.
 *
 * ## Tre måter å skaffe en formatter (i ix-field, se IxField.ts)
 *
 *   1. Egen funksjon som property:  `el.formatter = { format, parse }`
 *   2. Navngitt via registry:       `data-format="phone"` (+ `registerFormat(...)`)
 *   3. Pattern-streng, ingen JS:    `data-format-pattern="000 00 000"`
 *
 * Alle tre gir samme `FieldFormatter`-kontrakt.
 */

export interface FieldFormatter {
    /** Rå verdi → visningsstreng. */
    format(raw: string): string;
    /** Visningsstreng → rå verdi (sannheten konsumenten lagrer). */
    parse(display: string): string;
}

// ── Pattern-kompilator ──────────────────────────────────────────────────────

/**
 * Slot-definisjoner for pattern-strenger. Et pattern består av slot-tegn som
 * brukeren fyller, og faste separatorer (alt annet) som settes inn automatisk.
 *
 *   `0` → ett siffer
 *   `a` → én bokstav (inkl. æ ø å)
 *   `*` → hvilket som helst tegn
 *
 * Alt annet i patternet er en fast separator: `"000 00 000"`, `"00.00.0000"`.
 */
const SLOT_DEFINITIONS: Record<string, RegExp> = {
    '0': /\d/,
    a: /[a-zA-ZæøåÆØÅ]/,
    '*': /[^\s]/,
};

type PatternToken = { type: 'slot'; match: RegExp } | { type: 'literal'; value: string };

function compileTokens(pattern: string): PatternToken[] {
    const tokens: PatternToken[] = [];
    for (const char of pattern) {
        const slot = SLOT_DEFINITIONS[char];
        tokens.push(slot ? { type: 'slot', match: slot } : { type: 'literal', value: char });
    }
    return tokens;
}

/**
 * Lager en formatter fra en pattern-streng.
 *
 * `format` fyller slots med matchende tegn fra den rå verdien og setter inn
 * separatorer først når neste slot faktisk fylles (ingen dinglende separator på
 * slutten mens man skriver). `parse` beholder kun tegn som kan fylle en slot, i
 * rekkefølge, opp til antall slots — separatorer og ugyldige tegn droppes.
 */
export function createPatternFormatter(pattern: string): FieldFormatter {
    const tokens = compileTokens(pattern);
    const slots = tokens.filter((t): t is Extract<PatternToken, { type: 'slot' }> => t.type === 'slot');

    // Beholder tegn som matcher minst én slot-definisjon i patternet.
    const keepChar = (char: string): boolean => slots.some((s) => s.match.test(char));

    return {
        parse(display: string): string {
            let raw = '';
            for (const char of display) {
                if (keepChar(char)) {
                    raw += char;
                    if (raw.length === slots.length) break;
                }
            }
            return raw;
        },

        format(raw: string): string {
            // Rens rå verdi til kun gyldige tegn, slik at lim inn av en allerede
            // formatert verdi ("123 45 678") også fungerer.
            const chars = [...raw].filter(keepChar);
            let out = '';
            let pendingLiterals = '';
            let i = 0;

            for (const token of tokens) {
                if (token.type === 'literal') {
                    pendingLiterals += token.value;
                    continue;
                }
                // slot: finn neste tegn som matcher denne slotens type
                while (i < chars.length && !token.match.test(chars[i])) i++;
                if (i >= chars.length) break;
                out += pendingLiterals + chars[i];
                pendingLiterals = '';
                i++;
            }
            return out;
        },
    };
}

// ── Tall-/beløpsformatter (variabel lengde, tusenskille) ─────────────────────

/**
 * Beløp er ikke en fast-lengde pattern-maske: lengden varierer og tusenskillet
 * forskyver seg mens man skriver. Derfor en egen formatter.
 *
 * Rå verdi = siffer med valgfritt desimalskilletegn (`decimalSeparator`), uten
 * tusenskille: `"1234567,89"`. Visning = med tusenskille: `"1 234 567,89"`.
 */
export function createAmountFormatter(options: { groupSeparator?: string; decimalSeparator?: string } = {}): FieldFormatter {
    const group = options.groupSeparator ?? ' ';
    const decimal = options.decimalSeparator ?? ',';

    // Alt som ikke er siffer eller desimalskilletegn fjernes (også tusenskille).
    const stripToRaw = (display: string): string => {
        let raw = '';
        let seenDecimal = false;
        for (const char of display) {
            if (char >= '0' && char <= '9') {
                raw += char;
            } else if (char === decimal && !seenDecimal) {
                raw += decimal;
                seenDecimal = true;
            }
        }
        return raw;
    };

    return {
        parse: stripToRaw,

        format(raw: string): string {
            const clean = stripToRaw(raw);
            if (clean === '') return '';
            const [intPart, ...rest] = clean.split(decimal);
            const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, group);
            return rest.length > 0 ? `${grouped}${decimal}${rest.join('')}` : grouped;
        },
    };
}

/**
 * Utleder tusenskille og desimalskilletegn for en locale via `Intl.NumberFormat`.
 * Brukes for locale-bevisst beløpsformatering uten å hardkode separatorer.
 */
export function amountFormatterForLocale(locale: string): FieldFormatter {
    const parts = new Intl.NumberFormat(locale).formatToParts(1234567.8);
    const group = parts.find((p) => p.type === 'group')?.value ?? ' ';
    const decimal = parts.find((p) => p.type === 'decimal')?.value ?? ',';
    return createAmountFormatter({ groupSeparator: group, decimalSeparator: decimal });
}

// ── Registry ────────────────────────────────────────────────────────────────

const registry = new Map<string, FieldFormatter>();

/**
 * Registrerer en navngitt formatter som deretter kan brukes via
 * `data-format="<navn>"` på et ix-field, hvor som helst i appen.
 *
 * Team kan registrere sine egne varianter (orgnr, kortnummer, …) uten at
 * designsystemet må endres — «felles, men ikke avhengig av oss».
 */
export function registerFormat(name: string, formatter: FieldFormatter): void {
    registry.set(name, formatter);
}

/** Slår opp en registrert formatter. Returnerer `undefined` om navnet er ukjent. */
export function resolveFormat(name: string): FieldFormatter | undefined {
    return registry.get(name);
}

// ── Innebygde varianter ──────────────────────────────────────────────────────
//
// Registreres ved modullasting. `phone`/`ssn`/`date` er pattern-baserte;
// `amount` bruker tall-formatteren med norske separatorer (mellomrom + komma),
// i tråd med eksisterende intern bruk.

registerFormat('phone', createPatternFormatter('000 00 000')); // norsk 8-sifret nummer
registerFormat('ssn', createPatternFormatter('000000 00000')); // fødselsnummer DDMMÅÅ NNNNN
registerFormat('date', createPatternFormatter('00.00.0000')); // dd.mm.åååå
registerFormat('account', createPatternFormatter('0000 00 00000')); // kontonummer 1234 56 78903
registerFormat('orgnr', createPatternFormatter('000 000 000')); // organisasjonsnummer 123 456 789
registerFormat('amount', createAmountFormatter({ groupSeparator: ' ', decimalSeparator: ',' }));
