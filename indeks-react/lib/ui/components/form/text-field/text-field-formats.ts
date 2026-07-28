/**
 * Typer for input-formatering i `TextField`. Skilt ut fra `TextField.tsx` fordi
 * verdi-eksporter (`BUILTIN_FORMAT_NAMES`) i en komponentfil bryter react-refresh.
 *
 * `FieldFormatter` og `BUILTIN_FORMAT_NAMES` er duplisert her (ikke importert fra
 * `@sb1/indeks-web`) fordi React-laget aldri importerer web-runtime — web lastes fra
 * CDN. Holdes i synk med indeks-web via `text-field-formats.sync.test.ts`.
 */

/** Format/parse-par for input-formatering. Holdes i synk med `FieldFormatter` i indeks-web. */
export type FieldFormatter = {
    /** Rå verdi → visningsstreng. */
    format(raw: string): string;
    /** Visningsstreng → rå verdi (tapsfri: fjerner kun separatorer). */
    parse(display: string): string;
    /** Formater mens brukeren skriver. Standard false = format-on-blur. */
    live?: boolean;
};

/** Navnene på de innebygde formatvariantene. Holdes i synk med `BUILTIN_FORMAT_NAMES` i indeks-web. */
export const BUILTIN_FORMAT_NAMES = ['phone', 'amount', 'account', 'orgnr', 'ssn', 'date'] as const;

export type BuiltInFormatName = (typeof BUILTIN_FORMAT_NAMES)[number];

// `BuiltInFormatName | (string & {})`: `(string & {})` beholder autocomplete på de
// innebygde variantene samtidig som egne, registrerte navn (registerFormat) godtas.
// `BuiltInFormatName | string` ville kollapset til bare `string` og drept autocomplete.
// Gir INGEN runtime-validering — et ukjent navn kompilerer og faller tilbake til ingen
// formatering (samme forbehold som IconName).
export type FormatName = BuiltInFormatName | (string & {});
