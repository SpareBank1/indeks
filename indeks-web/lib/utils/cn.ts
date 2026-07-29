/**
 * `cn` — slår sammen betingede CSS-klassenavn til én streng.
 *
 * Intern erstatning for `clsx`. Vi implementerer bare mønstrene Indeks faktisk
 * bruker, ikke hele clsx-API-et:
 *   - strenger som varargs:            cn('ix-a', 'ix-b')            → 'ix-a ix-b'
 *   - falsy filtreres bort:            cn('ix-a', false, undefined)  → 'ix-a'
 *     (typisk fra `&&`-uttrykk og valgfrie props)
 *   - objekt med truthy-verdi:         cn({ 'ix-a': true, 'ix-b': 0 }) → 'ix-a'
 *     (inkl. computed/template-literal-nøkler)
 *   - flate (og nøstede) arrays:       cn('ix-a', ['ix-b'])          → 'ix-a ix-b'
 *
 * Returnerer alltid en `string` — tom streng når ingenting matcher, slik at
 * mønsteret `cn(className) || undefined` fungerer.
 */

export interface ClassDictionary {
    // Verdien tolkes kun som truthy/falsy — nøkkelen tas med når verdien er truthy.
    // Tillater vilkårlige verdier fordi kall-steder bruker f.eks. `{ [`ix-m-${x}`]: x }`
    // der `x` er en streng.
    [key: string]: unknown;
}

export type ClassValue = string | number | boolean | null | undefined | ClassDictionary | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
    const klasser: string[] = [];

    for (const input of inputs) {
        if (!input) continue;

        if (typeof input === 'string' || typeof input === 'number') {
            klasser.push(String(input));
        } else if (Array.isArray(input)) {
            const nøstet = cn(...input);
            if (nøstet) klasser.push(nøstet);
        } else if (typeof input === 'object') {
            for (const nøkkel in input) {
                if (input[nøkkel]) klasser.push(nøkkel);
            }
        }
    }

    return klasser.join(' ');
}
