import { buildColorScale } from './buildThemeColors';
import { DEFAULT_STEPS } from '../../themes/types';
import type { OriginColor, OriginScaleNames } from '../../themes/types';

// Re-eksporterer typene konsumenter trenger for å type sine egne kall, så de slipper
// å grave i interne stier. Del av det offentlige `@sb1/indeks-tokens/generate`-API-et.
export type { OriginColor, OriginScaleNames } from '../../themes/types';

/**
 * Runtime-API for å generere fargeskalaer «on-the-fly» — i en Node-backend eller
 * rett i nettleseren.
 *
 * Bakgrunn: de semantiske fargetokenene (`--ix-color-*`) peker på primitivene via
 * `var(--ii-primitive-*)`. For å rethem-e i runtime trenger man derfor bare å regenerere
 * primitiv-skalaen for én eller flere basisfarger og sette `--ii-primitive-<navn>-<steg>`
 * på et scope — alle semantiske tokens re-resolver seg selv via `var()`-kaskaden.
 *
 * Dette er den ene tillatte runtime-bruken av de ellers interne `--ii-`-variablene.
 * Navnekonvensjonen og `gray-0 = #FFFFFF`-unntaket eies her, så konsumenten slipper
 * å hardkode dem.
 */

/** En map fra CSS-variabelnavn (`--ii-primitive-<navn>-<steg>`) til hex-verdi. */
export type ColorScaleVariables = Record<string, OriginColor>;

/** Prefikset alle primitiv-variabler deler. */
const PRIMITIVE_PREFIX = '--ii-primitive';

/**
 * Bygg en 20-trinns fargeskala fra én basisfarge og returner den som en ferdig
 * CSS-variabel-map, keyet på det interne primitiv-navnet.
 *
 * @example
 * buildColorScaleVariables('brand', '#0078D8')
 * // → { '--ii-primitive-brand-0': '#...', ..., '--ii-primitive-brand-950': '#...' }
 */
export function buildColorScaleVariables(name: OriginScaleNames, color: OriginColor): ColorScaleVariables {
    const scale = buildColorScale(color);
    const variables: ColorScaleVariables = {};

    for (const step of DEFAULT_STEPS) {
        variables[`${PRIMITIVE_PREFIX}-${name}-${step}`] = scale[step];
    }

    // Samme unntak som ved statisk bygg: gray-0 skal alltid være hvit.
    if (name === 'gray') {
        variables[`${PRIMITIVE_PREFIX}-gray-0`] = '#FFFFFF';
    }

    return variables;
}

/** Minimal DOM-uavhengig type: alt vi trenger er `style.setProperty`. */
type StyleTarget = { style: { setProperty(property: string, value: string): void } };

/**
 * Sett en fargevariabel-map som inline-styling på et element (nettleser).
 *
 * @example
 * const vars = buildColorScaleVariables('brand', '#0078D8');
 * applyColorScaleVariables(document.documentElement, vars);
 */
export function applyColorScaleVariables(element: StyleTarget, variables: ColorScaleVariables): void {
    for (const [property, value] of Object.entries(variables)) {
        element.style.setProperty(property, value);
    }
}

export type ColorScaleVariablesToCssOptions = {
    /** Selektor deklarasjonene pakkes i. Standard `:root`. */
    selector?: string;
};

/**
 * Serialisér en fargevariabel-map til en CSS-streng, klar til å injiseres i
 * f.eks. et `<style>`-element eller serveres fra en Node-backend.
 *
 * @example
 * const vars = buildColorScaleVariables('brand', '#0078D8');
 * colorScaleVariablesToCss(vars);
 * // → ':root {\n  --ii-primitive-brand-0: #...;\n  ...\n}'
 * colorScaleVariablesToCss(vars, { selector: '.min-merkevare' });
 */
export function colorScaleVariablesToCss(
    variables: ColorScaleVariables,
    options: ColorScaleVariablesToCssOptions = {}
): string {
    const { selector = ':root' } = options;
    const declarations = Object.entries(variables)
        .map(([property, value]) => `  ${property}: ${value};`)
        .join('\n');

    return `${selector} {\n${declarations}\n}`;
}
