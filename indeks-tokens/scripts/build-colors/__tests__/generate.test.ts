import { describe, it, expect, vi } from 'vitest';
import Color from 'colorjs.io';
import {
    buildColorScaleVariables,
    applyColorScaleVariables,
    colorScaleVariablesToCss,
    getOriginChroma,
} from '../generate';
import { DEFAULT_STEPS } from '../../../themes/types';

describe('buildColorScaleVariables', () => {
    it('gir én variabel per trinn, keyet på det interne primitiv-navnet', () => {
        const vars = buildColorScaleVariables('brand', '#0078D8');

        expect(Object.keys(vars)).toHaveLength(DEFAULT_STEPS.length);
        for (const step of DEFAULT_STEPS) {
            const key = `--ii-primitive-brand-${step}`;
            expect(vars[key]).toMatch(/^#[0-9a-fA-F]{6}$/);
        }
    });

    it('tvinger gray-0 til hvit (samme unntak som ved statisk bygg)', () => {
        const vars = buildColorScaleVariables('gray', '#6D7888');
        expect(vars['--ii-primitive-gray-0']).toBe('#FFFFFF');
    });

    it('tvinger gray-0 til hvit også med justeringer', () => {
        const vars = buildColorScaleVariables('gray', '#6D7888', { lightness: { 0: 0.5 }, chroma: 0.2 });
        expect(vars['--ii-primitive-gray-0']).toBe('#FFFFFF');
    });
});

describe('buildColorScaleVariables med justeringer', () => {
    const oklch = (hex: string) => new Color(hex).to('oklch');

    it('gir samme skala som uten options når options er tomme', () => {
        expect(buildColorScaleVariables('brand', '#0078D8', {})).toEqual(
            buildColorScaleVariables('brand', '#0078D8')
        );
    });

    it('overstyrer lysstyrken bare på angitt trinn', () => {
        const base = buildColorScaleVariables('brand', '#0078D8');
        const vars = buildColorScaleVariables('brand', '#0078D8', { lightness: { 600: 0.6 } });

        expect(oklch(vars['--ii-primitive-brand-600']).l).toBeCloseTo(0.6, 2);
        expect(vars['--ii-primitive-brand-500']).toBe(base['--ii-primitive-brand-500']);
    });

    it('bruker chroma i stedet for basisfargens chroma', () => {
        const low = buildColorScaleVariables('brand-himmel', '#6C97A8', { chroma: 0.02 });
        const high = buildColorScaleVariables('brand-himmel', '#6C97A8', { chroma: 0.1 });

        expect(oklch(high['--ii-primitive-brand-himmel-600']).c).toBeGreaterThan(
            oklch(low['--ii-primitive-brand-himmel-600']).c
        );
    });

    it('ganger inn chromaFactor bare på angitt trinn', () => {
        const base = buildColorScaleVariables('brand', '#0078D8');
        const vars = buildColorScaleVariables('brand', '#0078D8', { chromaFactor: { 300: 0 } });

        expect(oklch(vars['--ii-primitive-brand-300']).c).toBeCloseTo(0, 2);
        expect(vars['--ii-primitive-brand-400']).toBe(base['--ii-primitive-brand-400']);
    });
});

describe('getOriginChroma', () => {
    it('gir OKLCH-chroma for basisfargen', () => {
        expect(getOriginChroma('#0078D8')).toBeCloseTo(new Color('#0078D8').to('oklch').c, 6);
    });

    it('gir 0 for en grå uten chroma', () => {
        expect(getOriginChroma('#808080')).toBeCloseTo(0, 6);
    });
});

describe('colorScaleVariablesToCss', () => {
    it('pakker deklarasjonene i :root som standard', () => {
        const css = colorScaleVariablesToCss(buildColorScaleVariables('brand', '#0078D8'));

        expect(css.startsWith(':root {')).toBe(true);
        expect(css.trimEnd().endsWith('}')).toBe(true);
        // Én deklarasjonslinje per variabel.
        expect(css).toContain('--ii-primitive-brand-0:');
        expect(css).toContain('--ii-primitive-brand-950:');
    });

    it('bruker angitt selektor', () => {
        const css = colorScaleVariablesToCss(
            { '--ii-primitive-brand-500': '#123456' },
            { selector: '.min-merkevare' }
        );
        expect(css).toBe('.min-merkevare {\n  --ii-primitive-brand-500: #123456;\n}');
    });
});

describe('applyColorScaleVariables', () => {
    it('kaller setProperty én gang per variabel med riktige argumenter', () => {
        const setProperty = vi.fn();
        const element = { style: { setProperty } };
        const vars = { '--ii-primitive-brand-500': '#123456', '--ii-primitive-brand-600': '#abcdef' };

        applyColorScaleVariables(element, vars);

        expect(setProperty).toHaveBeenCalledTimes(2);
        expect(setProperty).toHaveBeenCalledWith('--ii-primitive-brand-500', '#123456');
        expect(setProperty).toHaveBeenCalledWith('--ii-primitive-brand-600', '#abcdef');
    });
});
