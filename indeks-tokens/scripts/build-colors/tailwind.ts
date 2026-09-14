import { flattenObject } from '../utils';

/**
 * Genererer Tailwind v4-tema for de semantiske fargene. Resten av tokensettet bygges i
 * scripts/build-tokens/css/tailwind.ts.
 *
 * Vi aliaser bare Tailwind-navnerommet på våre egne variabler — ingen fargeverdier
 * kopieres. Da fortsetter lys/mørk-bytte å virke gjennom var()-kaskaden i colors.css,
 * og en Tailwind-konsument trenger ikke `dark:` for Indeks-farger i det hele tatt.
 *
 * `@theme inline` er påkrevd her: uten `inline` deklareres `--color-*` på `:root` og
 * regnes ut der, og da arver barna den utregnede lyse verdien selv om `.ix-dark-mode`
 * står lenger ned i treet.
 */

/**
 * Vi itererer bare det lyse settet, siden lys og mørk skal ha identiske nøkler.
 * FFE antar dette stille; vi feiler bygget i stedet, så et Figma-sync-avvik ikke
 * blir en farge som mangler i mørk modus.
 */
function assertMatchingKeys(light: string[], dark: string[]): void {
    const onlyLight = light.filter((name) => !dark.includes(name));
    const onlyDark = dark.filter((name) => !light.includes(name));

    if (onlyLight.length === 0 && onlyDark.length === 0) return;

    const details = [
        onlyLight.length ? `  Bare i Light: ${onlyLight.join(', ')}` : '',
        onlyDark.length ? `  Bare i Dark: ${onlyDark.join(', ')}` : '',
    ]
        .filter(Boolean)
        .join('\n');

    throw new Error(`Semantiske farger har ulike nøkler i Light og Dark:\n${details}`);
}

export function buildTailwindColorsCss(semanticColors: any): string {
    const light = Object.keys(flattenObject<string>(semanticColors.light));
    const dark = Object.keys(flattenObject<string>(semanticColors.dark));

    assertMatchingKeys(light, dark);

    // Komponent-tokens (component.button.…) er med. De finnes for at komponentene våre skal
    // kunne temes, men de er like synlige i Figma som de semantiske, og et team som bygger
    // noe knappeaktig selv har bruk for dem. Merk at fargeutility-generatoren i indeks-utils
    // filtrerer dem bort, så `ix-color-component-*`-klasser finnes ikke.
    const lines = light
        .map((name) => name.replace(/\./g, '-'))
        .sort((a, b) => a.localeCompare(b))
        .map((name) => `    --color-${name}: var(--ix-color-${name});`)
        .join('\n');

    // Indeks' egne farger bytter av seg selv inne i .ix-dark-mode, men Tailwinds egen
    // `dark:`-variant peker default på prefers-color-scheme. Vi peker den på vår klasse
    // slik at konsumentens egne dark:-klasser følger samme modus som designsystemet.
    return `@custom-variant dark (&:where(.ix-dark-mode, .ix-dark-mode *));

@theme inline {
${lines}
}
`;
}
