/**
 * Landvalg for <ix-phone-number-field>. `value` er landkoden (uten `+`) og
 * brukes som verdi/`data-country-code`. `label` er kalle-koden (`+47`) — den
 * vises som valgt verdi i input og er primærtekst. `description` er landnavnet
 * (sekundær tekst i lista, som skjermleseren leser etter kallekoden).
 */
export type CountryOption = {
    /** Landkode uten `+` (option-value, f.eks. `"47"`). */
    value: string;
    /** Kalle-kode vist som primærtekst (`"+47"`). */
    label: string;
    /** Landnavn — sekundær beskrivelse i lista. */
    description?: string;
};

/** Språk for den innebygde landlista. */
export type CountryLocale = 'nb' | 'nn' | 'en';

type CountryEntry = {
    /** ISO 3166-1 alpha-2 — kun brukt internt som stabil nøkkel/sortering-fallback. */
    iso: string;
    /** Kalle-kode uten `+`. Brukes som option-value og vises som label `+<code>`. */
    code: string;
    /** Landnavn per språk. */
    name: Record<CountryLocale, string>;
};

// Kuratert landliste. IKKE en full ISO-liste — dekker Norden + de vanligste
// landene norske tjenester møter. Konsumenten kan sende inn en egen liste (via
// `data-countries` på host / `countries`-prop i React) for å utvide/begrense.
// Landnavn er bevisst hardkodet, oversatt data (utvikler-godkjent unntak fra
// «ingen hardkodet tekst»): de er lokaliserbare via `locale` og fullt
// overstyrbare.
//
// Norden (SE/DK/FI/IS) løftes til toppen (etter Norge) uavhengig av alfabetisk
// sortering. Norge er alltid aller øverst.
//
// MERK: kallekoden (`code`) er også option-`value`, så den MÅ være unik i lista.
// E.164 deler koder mellom land (+1 = hele NANP, +7 = RU/KZ …). Der to land
// deler kode kan bare ett representeres i den kuraterte lista — vi tar med det
// vanligste (USA for +1). Trenger konsumenten flere, sender de egen liste.
const NORDIC = new Set(['SE', 'DK', 'FI', 'IS']);

const COUNTRIES: CountryEntry[] = [
    { iso: 'NO', code: '47', name: { nb: 'Norge', nn: 'Noreg', en: 'Norway' } },
    { iso: 'SE', code: '46', name: { nb: 'Sverige', nn: 'Sverige', en: 'Sweden' } },
    { iso: 'DK', code: '45', name: { nb: 'Danmark', nn: 'Danmark', en: 'Denmark' } },
    { iso: 'FI', code: '358', name: { nb: 'Finland', nn: 'Finland', en: 'Finland' } },
    { iso: 'IS', code: '354', name: { nb: 'Island', nn: 'Island', en: 'Iceland' } },
    { iso: 'BE', code: '32', name: { nb: 'Belgia', nn: 'Belgia', en: 'Belgium' } },
    { iso: 'EE', code: '372', name: { nb: 'Estland', nn: 'Estland', en: 'Estonia' } },
    { iso: 'FR', code: '33', name: { nb: 'Frankrike', nn: 'Frankrike', en: 'France' } },
    { iso: 'GR', code: '30', name: { nb: 'Hellas', nn: 'Hellas', en: 'Greece' } },
    { iso: 'IN', code: '91', name: { nb: 'India', nn: 'India', en: 'India' } },
    { iso: 'IE', code: '353', name: { nb: 'Irland', nn: 'Irland', en: 'Ireland' } },
    { iso: 'IT', code: '39', name: { nb: 'Italia', nn: 'Italia', en: 'Italy' } },
    { iso: 'HR', code: '385', name: { nb: 'Kroatia', nn: 'Kroatia', en: 'Croatia' } },
    { iso: 'LV', code: '371', name: { nb: 'Latvia', nn: 'Latvia', en: 'Latvia' } },
    { iso: 'LT', code: '370', name: { nb: 'Litauen', nn: 'Litauen', en: 'Lithuania' } },
    { iso: 'NL', code: '31', name: { nb: 'Nederland', nn: 'Nederland', en: 'Netherlands' } },
    { iso: 'PL', code: '48', name: { nb: 'Polen', nn: 'Polen', en: 'Poland' } },
    { iso: 'PT', code: '351', name: { nb: 'Portugal', nn: 'Portugal', en: 'Portugal' } },
    { iso: 'RO', code: '40', name: { nb: 'Romania', nn: 'Romania', en: 'Romania' } },
    { iso: 'RU', code: '7', name: { nb: 'Russland', nn: 'Russland', en: 'Russia' } },
    { iso: 'ES', code: '34', name: { nb: 'Spania', nn: 'Spania', en: 'Spain' } },
    { iso: 'GB', code: '44', name: { nb: 'Storbritannia', nn: 'Storbritannia', en: 'United Kingdom' } },
    { iso: 'CH', code: '41', name: { nb: 'Sveits', nn: 'Sveits', en: 'Switzerland' } },
    { iso: 'DE', code: '49', name: { nb: 'Tyskland', nn: 'Tyskland', en: 'Germany' } },
    { iso: 'US', code: '1', name: { nb: 'USA', nn: 'USA', en: 'United States' } },
    { iso: 'AT', code: '43', name: { nb: 'Østerrike', nn: 'Austerrike', en: 'Austria' } },
    { iso: 'TR', code: '90', name: { nb: 'Tyrkia', nn: 'Tyrkia', en: 'Turkey' } },
    { iso: 'UA', code: '380', name: { nb: 'Ukraina', nn: 'Ukraina', en: 'Ukraine' } },
    { iso: 'CN', code: '86', name: { nb: 'Kina', nn: 'Kina', en: 'China' } },
    { iso: 'JP', code: '81', name: { nb: 'Japan', nn: 'Japan', en: 'Japan' } },
    { iso: 'BR', code: '55', name: { nb: 'Brasil', nn: 'Brasil', en: 'Brazil' } },
    { iso: 'AU', code: '61', name: { nb: 'Australia', nn: 'Australia', en: 'Australia' } },
];

/**
 * Bygger standard landliste for en gitt `locale`. Rekkefølge: Norge først,
 * deretter Norden (Sverige, Danmark, Finland, Island), deretter resten
 * alfabetisk etter lokalisert landnavn (locale-bevisst `Intl.Collator`, som
 * håndterer æ/ø/å).
 *
 * @default locale = 'nb'
 */
export function getDefaultCountries(locale: CountryLocale = 'nb'): CountryOption[] {
    const collator = new Intl.Collator(locale);
    const toOption = (c: CountryEntry): CountryOption => ({
        value: c.code,
        label: `+${c.code}`,
        description: c.name[locale],
    });

    const norway = COUNTRIES.filter((c) => c.iso === 'NO');
    const nordics = COUNTRIES.filter((c) => NORDIC.has(c.iso)).sort((a, b) =>
        collator.compare(a.name[locale], b.name[locale])
    );
    const rest = COUNTRIES.filter((c) => c.iso !== 'NO' && !NORDIC.has(c.iso)).sort((a, b) =>
        collator.compare(a.name[locale], b.name[locale])
    );

    return [...norway, ...nordics, ...rest].map(toOption);
}

/** Normaliserer en `data-locale`-attributt til en gyldig `CountryLocale`. */
export function normalizeLocale(value: string | null): CountryLocale {
    return value === 'nn' || value === 'en' ? value : 'nb';
}
