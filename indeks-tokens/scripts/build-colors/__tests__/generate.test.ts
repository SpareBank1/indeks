import { describe, it, expect, vi } from 'vitest';
import {
    buildColorScaleVariables,
    applyColorScaleVariables,
    colorScaleVariablesToCss,
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
