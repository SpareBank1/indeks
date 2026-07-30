export const themes = [
    { value: 'sb1', label: 'SpareBank 1' },
    { value: 'kredittbanken', label: 'Kredittbanken' },
] as const;

export type ThemeValue = (typeof themes)[number]['value'];

export const DEFAULT_THEME: ThemeValue = 'sb1';

/** Snever allowlist-validering — brukes på verdier fra localStorage/select. */
export function isValidTheme(value: string | null): value is ThemeValue {
    return themes.some((t) => t.value === value);
}

/**
 * Slår et (potensielt untrusted) theme-navn opp mot allowlisten og returnerer
 * stylesheet-URL-en. URL-en bygges fra selve array-konstanten (`match.value`),
 * ikke fra input-strengen — så ingen untrusted DOM/localStorage-tekst kan flyte
 * inn i en `<link href>` (CodeQL js/xss-through-dom).
 */
export function themeStylesheetHref(value: string | null): string {
    const match = themes.find((t) => t.value === value) ?? themes[0];
    return `./themes/${match.value}.css`;
}
