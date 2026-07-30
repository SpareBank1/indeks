/**
 * Input-formatering for ix-field — rene funksjoner, pattern-kompilator og registry.
 *
 * ## Filosofi: vi formaterer, vi masker ikke
 *
 * Dette er IKKE en tegn-maske som avviser tastetrykk. Uansett modus vises ALT
 * brukeren skriver — også ekstra tegn og tegn som ikke «hører hjemme» (en bokstav
 * i et sifferfelt). Feil fanges av validering, ikke ved å droppe tegn. Derfor er
 * `parse` tapsfri (fjerner kun separatorene `format` setter inn).
 *
 * To moduser, styrt av `live`-flagget på formatteren:
 *   - **Blur (standard):** feltet formateres når det mister fokus og viser rå
 *     (redigerbar) verdi ved fokus. Ingen caret-hopp mens man skriver — en bevisst
 *     a11y-beslutning (jf. GOV.UK-frarådingen mot å reformatere telefonnummer mens
 *     brukeren skriver).
 *   - **Live (opt-in, `live: true`):** separatorene bygger seg opp mens man
 *     skriver. De innebygde variantene bruker dette.
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
 *   2. Navngitt via registry:       `<input data-format="phone">` (+ `registerFormat(...)`)
 *   3. Pattern-streng, ingen JS:    `<input data-format-pattern="000 00 000">`
 *
 * Alle tre gir samme `FieldFormatter`-kontrakt.
 */

export interface FieldFormatter {
    /** Rå verdi → visningsstreng. */
    format(raw: string): string;
    /**
     * Visningsstreng → rå verdi (sannheten konsumenten lagrer).
     *
     * **Tapsfri:** fjerner kun separatorene formatteren selv setter inn og
     * beholder alt annet — også tegn som ikke «hører hjemme» (en bokstav i et
     * sifferfelt). Vi formaterer, vi masker ikke: feil fanges av validering, ikke
     * ved å droppe tegn. Derfor holder `parse(format(raw)) === raw` for enhver rå
     * verdi, ikke bare gyldige.
     */
    parse(display: string): string;
    /**
     * Formater mens brukeren skriver (separatorer dukker opp fortløpende).
     * Standard `false`/utelatt = format-on-blur (formateres når feltet mister
     * fokus, rå verdi vises ved fokus for fri redigering). De innebygde variantene
     * opter inn på live; egne pattern-strenger og `{format,parse}`-objekter er
     * blur med mindre de setter dette.
     */
    live?: boolean;
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
 * `format` fyller slots med matchende tegn fra den rå verdien og setter inn en
 * separator så snart gruppen foran er fylt OG resten av verdien er konsumert —
 * separatoren dukker altså opp med én gang gruppen er komplett ("24" → "24.",
 * "2412" → "24.12."), ikke først når neste siffer skrives. En separator legges
 * aldri til for en halvfylt gruppe, og heller ikke når vi stoppet fordi neste
 * tegn ikke passet sloten (da ville vi doblet separatoren ved innliming av
 * allerede formatert tekst). Tegn som ikke passer neste slot — enten fordi
 * brukeren skrev flere tegn enn
 * patternet har plasser, eller skrev noe som ikke hører hjemme (bokstav i et
 * sifferfelt) — droppes IKKE: den ledende delen som passer formateres, og resten
 * legges uformatert på til slutt i samme rekkefølge brukeren skrev. Alt brukeren
 * skriver forblir synlig.
 *
 * `parse` er tapsfri: den fjerner kun separator-tegnene patternet definerer
 * (literal-tokens) og beholder alt annet i rekkefølge — ingen cap på antall
 * slots, ingen filtrering av «ugyldige» tegn. Slik overlever et feilaktig tegn
 * (bokstav i et sifferfelt) i den rå verdien og kan fanges av validering.
 */
export function createPatternFormatter(pattern: string): FieldFormatter {
    const tokens = compileTokens(pattern);

    // Separator-tegnene patternet setter inn (literal-tokens). parse fjerner kun
    // disse. En slot-definisjon som også kan matche et separator-tegn ville vært
    // tvetydig, men patternene våre bruker mellomrom/punktum som ingen slot matcher.
    const separators = new Set(tokens.filter((t) => t.type === 'literal').map((t) => (t as Extract<PatternToken, { type: 'literal' }>).value));

    return {
        parse(display: string): string {
            let raw = '';
            for (const char of display) {
                if (!separators.has(char)) raw += char;
            }
            return raw;
        },

        format(raw: string): string {
            const chars = [...raw];
            let out = '';
            let pendingLiterals = '';
            let i = 0;

            for (const token of tokens) {
                if (token.type === 'literal') {
                    pendingLiterals += token.value;
                    continue;
                }
                // slot: neste tegn må matche slotens type. Passer det ikke,
                // stopper vi konsumeringen — resten legges på verbatim under.
                if (i >= chars.length || !token.match.test(chars[i])) break;
                out += pendingLiterals + chars[i];
                pendingLiterals = '';
                i++;
            }

            // Flush en ventende separator når HELE den rå verdien er konsumert og
            // gruppen foran nettopp ble fylt: da dukker separatoren opp med én gang
            // ("24" → "24.", "2412" → "24.12."), i stedet for å vente på neste
            // siffer. Stoppet vi derimot fordi neste tegn ikke passet sloten
            // (i < chars.length) — f.eks. innliming av en allerede formatert streng
            // der neste tegn ER separatoren, eller et ugyldig tegn — dropper vi
            // flushen og legger resten uformatert på, så vi verken dobler
            // separatoren eller dikter opp en for en gruppe brukeren ikke fylte.
            const trailing = i >= chars.length ? pendingLiterals : '';
            return out + trailing + chars.slice(i).join('');
        },
    };
}

// ── Dato-formatter (variabel-bredde grupper, skilletegn-bevisst) ─────────────
//
// Dato er den ENE innebygde varianten der en gruppe kan være 1 ELLER 2 sifre
// (dag/måned). Da bærer det tastede punktumet informasjon posisjonen alene ikke
// gir: `1.1.2026` (1. januar) mot `11.20.26`. Den generiske pattern-masken
// (`00.00.0000`) stripper punktumet og re-plasserer bare sifre posisjonelt — den
// ville tolket `1.1.2026` som `11.20.26`. Det bryter «vi formaterer, vi masker
// ikke». Derfor en egen formatter som RESPEKTERER det tastede punktumet som en
// segment-grense og kun LEGGER TIL formatering (nullutfylling), aldri fjerner
// eller omrokerer.
//
// Til forskjell fra de fast-bredde variantene formaterer dato på BLUR (live
// utelatt): teksten står urørt mens man skriver, og normaliseres når feltet
// mister fokus. Å reformatere variabel-bredde grupper mens man skriver ville
// gjort caret-oppførselen uforutsigbar.

export interface DateParts {
    day: string;
    month: string;
    year: string;
}

/**
 * Kanonisk dato-parser — den ENE sannheten for hvordan en dato-streng tolkes.
 * Både ix-field sin synlige formatering og IxDateField sin ISO-utleding går
 * gjennom denne, så de aldri kan drifte fra hverandre.
 *
 * Komplett dato → nullutfylte deler; ufullstendig/tvetydig → `null`.
 *
 *   - Med punktum: nøyaktig 3 rent-numeriske segmenter, dag/måned 1-2 sifre,
 *     år 2 eller 4 sifre. Dag/måned nullutfylles; 2-sifret år utvides til `20xx`
 *     (`"26"` → `"2026"`). `"1.1.2026"` og `"1.1.26"` → begge 01/01/2026.
 *   - Uten punktum: nøyaktig 8 sifre tolkes som ddmmåååå (`"01012026"`). Annen
 *     lengde uten skilletegn (f.eks. `"112026"`) er tvetydig — vi kan ikke vite
 *     hvor grensene går uten punktum — og regnes ufullstendig → `null`.
 *   - Bokstaver, ekstra punktum eller feil segmentantall → `null`.
 */
export function parseDate(display: string): DateParts | null {
    const trimmed = display.trim();

    if (trimmed.includes('.')) {
        const segments = trimmed.split('.');
        if (segments.length !== 3) return null;
        const [day, month, year] = segments;
        if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !/^(\d{2}|\d{4})$/.test(year)) return null;
        const fullYear = year.length === 2 ? `20${year}` : year;
        return { day: day.padStart(2, '0'), month: month.padStart(2, '0'), year: fullYear };
    }

    if (/^\d{8}$/.test(trimmed)) {
        return { day: trimmed.slice(0, 2), month: trimmed.slice(2, 4), year: trimmed.slice(4, 8) };
    }

    return null;
}

/** Komplett dato → visning `dd.mm.åååå` (nullutfylt); ellers strengen verbatim. */
export function normalizeDateDisplay(display: string): string {
    const parts = parseDate(display);
    return parts ? `${parts.day}.${parts.month}.${parts.year}` : display;
}

/** Komplett dato → ISO `åååå-mm-dd`; ellers tom streng. */
export function isoFromDate(display: string): string {
    const parts = parseDate(display);
    return parts ? `${parts.year}-${parts.month}-${parts.day}` : '';
}

/**
 * Formatter for datofelt. `parse` er identitet — punktumet er en meningsfull
 * tastet grense, ikke en separator å fjerne (trivielt tapsfri). `format`
 * nullutfyller til `dd.mm.åååå` når datoen er komplett, ellers vises alt verbatim.
 *
 * Invariant-unntak: `parse(format(raw)) === raw` gjelder IKKE her, fordi
 * nullutfylling (`"1"` → `"01"`) ikke er reversibel. Blur-syklusen krever i
 * stedet at `format` er idempotent på allerede-normaliserte verdier —
 * `format("01.01.2026") === "01.01.2026"` — som holder.
 */
export function createDateFormatter(): FieldFormatter {
    return {
        parse: (display) => display,
        format: (raw) => normalizeDateDisplay(raw),
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

    // Tapsfri parse: fjern kun tusenskillet (separatoren format setter inn), og
    // behold alt annet — siffer, desimalskilletegn og eventuelle feilaktige tegn.
    // Vi formaterer, vi masker ikke; validering fanger ugyldige verdier.
    const stripToRaw = (display: string): string => {
        // split/join fjerner alle forekomster av gruppe-tegnet uten regex-escaping.
        return display.split(group).join('');
    };

    return {
        parse: stripToRaw,

        format(raw: string): string {
            // Konsumer den ledende delen som er gyldig beløp (siffer + ett
            // desimalskilletegn), stopp ved første tegn som ikke passer, og legg
            // resten uformatert på — slik at alt brukeren skriver forblir synlig.
            const chars = [...raw];
            let leading = '';
            let seenDecimal = false;
            let i = 0;
            for (; i < chars.length; i++) {
                const char = chars[i];
                if (char >= '0' && char <= '9') {
                    leading += char;
                } else if (char === decimal && !seenDecimal) {
                    leading += decimal;
                    seenDecimal = true;
                } else {
                    break;
                }
            }

            const rest = chars.slice(i).join('');
            if (leading === '') return rest;

            const [intPart, ...decimals] = leading.split(decimal);
            const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, group);
            const formatted = decimals.length > 0 ? `${grouped}${decimal}${decimals.join('')}` : grouped;
            return formatted + rest;
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
 * `data-format="<navn>"` på et input inne i et ix-field, hvor som helst i appen.
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

/**
 * Navnene på de innebygde formatvariantene. Eksporteres slik at typelaget
 * (indeks-react dupliserer denne listen for autocomplete på `format`) kan holdes
 * i synk via en sync-test — React importerer ikke web-runtime ellers.
 */
export const BUILTIN_FORMAT_NAMES = ['phone', 'amount', 'account', 'orgnr', 'ssn', 'date'] as const;

export type BuiltInFormatName = (typeof BUILTIN_FORMAT_NAMES)[number];

// live: true — de innebygde variantene formaterer mens brukeren skriver. Flagget
// settes på registreringen (ikke i factoryene, som deles med egne pattern-strenger
// som skal være blur som standard). Spread beholder format/parse uendret.
registerFormat('phone', { ...createPatternFormatter('000 00 000'), live: true }); // norsk 8-sifret nummer
registerFormat('ssn', { ...createPatternFormatter('000000 00000'), live: true }); // fødselsnummer DDMMÅÅ NNNNN
registerFormat('date', createDateFormatter()); // dd.mm.åååå — blur, skilletegn-bevisst (godtar 1.1.2026)
registerFormat('account', { ...createPatternFormatter('0000 00 00000'), live: true }); // kontonummer 1234 56 78903
registerFormat('orgnr', { ...createPatternFormatter('000 000 000'), live: true }); // organisasjonsnummer 123 456 789
registerFormat('amount', { ...createAmountFormatter({ groupSeparator: ' ', decimalSeparator: ',' }), live: true });
