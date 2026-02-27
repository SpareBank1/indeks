// Ikonnavntilordningsobjekt - tillater tilordning mellom ikonnøkler og deres SVG-filnavn
export const ICON_NAMES = {
    hjem: 'home',
    meny: 'menu',
    sparing: 'savings',
} as const;

// Type som representerer alle tilgjengelige ikonnavn
export type IconValue = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];

// Type som representerer alle tilgjengelige ikonnøkler
export type IconName = keyof typeof ICON_NAMES;

// Hjelpetype for å hente ikonnavnet fra en nøkkel
export type GetIconName<K extends IconName> = (typeof ICON_NAMES)[K];

// Hjelpefunksjon for å hente ikonnavn etter nøkkel med typesikkerhet
export function getIconName<K extends IconName>(key: K): GetIconName<K> {
    return ICON_NAMES[key];
}

// Typevakt for å sjekke om en streng er et gyldig ikonnavn
export function isValidIconName(name: string): name is IconValue {
    return Object.values(ICON_NAMES).includes(name as IconValue);
}

// Typevakt for å sjekke om en streng er en gyldig ikonnøkkel
export function isValidIconKey(key: string): key is IconName {
    return key in ICON_NAMES;
}
