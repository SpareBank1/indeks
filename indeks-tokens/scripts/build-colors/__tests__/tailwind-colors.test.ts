import { describe, it, expect } from 'vitest';
import { buildTailwindColorsCss } from '../tailwind';

const semanticColors = {
    light: {
        background: { default: 'neutral.0' },
        fill: { main: { default: 'brand.600' } },
        component: { button: { primary: { fill: 'brand.600' } } },
    },
    dark: {
        background: { default: 'neutral.950' },
        fill: { main: { default: 'brand.400' } },
        component: { button: { primary: { fill: 'brand.400' } } },
    },
};

describe('buildTailwindColorsCss', () => {
    it('aliaser Tailwind-navnerommet på --ix-variabelen i stedet for å kopiere verdien', () => {
        const css = buildTailwindColorsCss(semanticColors);

        expect(css).toContain('--color-background-default: var(--ix-color-background-default);');
        expect(css).toContain('--color-fill-main-default: var(--ix-color-fill-main-default);');
    });

    it('bruker @theme inline, slik at farger resolves per element og .ix-dark-mode virker', () => {
        expect(buildTailwindColorsCss(semanticColors)).toContain('@theme inline {');
    });

    it('peker Tailwinds dark-variant på .ix-dark-mode i stedet for prefers-color-scheme', () => {
        expect(buildTailwindColorsCss(semanticColors)).toContain(
            '@custom-variant dark (&:where(.ix-dark-mode, .ix-dark-mode *));'
        );
    });

    it('tar med komponent-tokens, som er like synlige i Figma som de semantiske', () => {
        expect(buildTailwindColorsCss(semanticColors)).toContain(
            '--color-component-button-primary-fill: var(--ix-color-component-button-primary-fill);'
        );
    });

    it('inneholder ingen fargeverdier — bare var()-aliaser', () => {
        expect(buildTailwindColorsCss(semanticColors)).not.toContain('neutral.0');
        expect(buildTailwindColorsCss(semanticColors)).not.toContain('--ii-primitive');
    });

    it('feiler når en farge mangler i mørk modus', () => {
        const mismatched = {
            light: { background: { default: 'neutral.0' }, surface: { main: 'neutral.50' } },
            dark: { background: { default: 'neutral.950' } },
        };

        expect(() => buildTailwindColorsCss(mismatched)).toThrow(/Bare i Light: surface\.main/);
    });

    it('feiler når mørk modus har en farge som ikke finnes i lys', () => {
        const mismatched = {
            light: { background: { default: 'neutral.0' } },
            dark: { background: { default: 'neutral.950' }, surface: { main: 'neutral.900' } },
        };

        expect(() => buildTailwindColorsCss(mismatched)).toThrow(/Bare i Dark: surface\.main/);
    });
});
