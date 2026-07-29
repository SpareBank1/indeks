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
