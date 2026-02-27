import { describe, it, expect } from 'vitest';
import { DEFAULT_STEPS, type Theme } from '../../../themes/types';
import { buildTheme, buildColorScale, buildColorScales } from '../buildThemeColors';

const sampleTheme: Theme = {
    name: 'testkunde',
    colors: {
        brand: '#0078D8',
        success: '#00885B',
        info: '#467CA4',
        danger: '#C94E4F',
        warning: '#AF6500',
        gray: '#6D7888',
        neutral: '#AC7944',
    },
    themeable: {
        'font-family': { normal: 'Inter, sans-serif', heading: 'Inter, sans-serif' },
        'font-weight': { regular: 400, medium: 500 },
        border: {
            radius: { button: '4', checkbox: '3', input: '4' },
        },
    },
    identityColor: '#fff',
};

describe('buildTheme', () => {
    it('returns a BuildtTheme with name and themeable copied', () => {
        const result = buildTheme(sampleTheme);
        expect(result.name).toBe(sampleTheme.name);
        expect(result.themeable).toEqual(sampleTheme.themeable);
    });

    it('creates color scales for all origin scales with DEFAULT_STEPS', () => {
        const result = buildTheme(sampleTheme);
        const originScales = Object.keys(sampleTheme.colors);

        for (const scale of originScales) {
            const stepsRecord = result.colors[scale as keyof typeof result.colors];
            expect(stepsRecord).toBeTruthy();
            const stepKeys = Object.keys(stepsRecord).map((k) => Number(k));
            expect(stepKeys).toHaveLength(DEFAULT_STEPS.length);
            expect(stepKeys).toEqual(DEFAULT_STEPS.map((n) => Number(n)));
        }
    });

    it('populates each step with a valid color string', () => {
        const result = buildTheme(sampleTheme);
        for (const [scale, stepsRecord] of Object.entries(result.colors)) {
            for (const step of DEFAULT_STEPS) {
                const value = stepsRecord[step];
                expect(typeof value).toBe('string');
                expect(value.length).toBeGreaterThan(0);
            }
        }
    });

    it('600 of each color is the same of origin color for each scale', () => {
        const result = buildTheme(sampleTheme);
        const values = {
            brand: '#0058a6',
            success: '#006a45',
            info: '#315d7d',
            danger: '#943234',
            warning: '#834800',
            gray: '#505966',
            neutral: '#774f23',
        };
        for (const [scale, originColor] of Object.entries(sampleTheme.colors)) {
            const stepsRecord = result.colors[scale as keyof typeof result.colors];
            const value = stepsRecord[600];
            expect(value).toBe(values[scale as keyof typeof values]);
        }
    });

    it('200 of each color is correct', () => {
        const result = buildTheme(sampleTheme);
        const values = {
            brand: '#d3e9ff',
            success: '#d6ede0',
            info: '#dbe9f4',
            danger: '#ffddda',
            warning: '#f7e2d1',
            gray: '#e4e7eb',
            neutral: '#f2e4d7',
        };
        for (const [scale, originColor] of Object.entries(sampleTheme.colors)) {
            const stepsRecord = result.colors[scale as keyof typeof result.colors];
            const value = stepsRecord[200];
            expect(value).toBe(values[scale as keyof typeof values]);
        }
        console.log('theme', JSON.stringify(result, null, 2));
    });
});

describe('buildColorScale', () => {
    it('returns scale with all DEFAULT_STEPS for a single origin color', () => {
        const scale = buildColorScale(sampleTheme.colors.brand);
        const keys = Object.keys(scale)
            .map(Number)
            .sort((a, b) => a - b);
        expect(keys).toEqual(DEFAULT_STEPS.map(Number).sort((a, b) => a - b));
    });

    it('produces expected 600 and 200 values for brand color', () => {
        const scale = buildColorScale(sampleTheme.colors.brand);
        expect(scale[600]).toBe('#0058a6');
        expect(scale[200]).toBe('#d3e9ff');
    });

    it('is deterministic for brand color', () => {
        const a = buildColorScale(sampleTheme.colors.brand);
        const b = buildColorScale(sampleTheme.colors.brand);
        expect(a).toEqual(b);
    });

    it('each step value is a valid hex string', () => {
        const scale = buildColorScale(sampleTheme.colors.brand);
        for (const step of DEFAULT_STEPS) {
            const value = scale[step];
            expect(value).toMatch(/^#[0-9a-fA-F]{6}$/);
        }
    });
});

describe('buildColorScales', () => {
    it('returns all origin scale names present in theme colors', () => {
        const scales = buildColorScales(sampleTheme.colors);
        const scaleNames = Object.keys(scales).sort();
        expect(scaleNames).toEqual(Object.keys(sampleTheme.colors).sort());
    });

    it('each returned scale has all DEFAULT_STEPS', () => {
        const scales = buildColorScales(sampleTheme.colors);
        for (const [name, scale] of Object.entries(scales)) {
            const keys = Object.keys(scale)
                .map(Number)
                .sort((a, b) => a - b);
            expect(keys).toEqual(DEFAULT_STEPS.map(Number).sort((a, b) => a - b));
        }
    });

    it('brand scale matches buildColorScale(brand)', () => {
        const scales = buildColorScales(sampleTheme.colors);
        const brandScale = scales.brand;
        const singleBrand = buildColorScale(sampleTheme.colors.brand);
        expect(brandScale).toEqual(singleBrand);
    });

    it('is deterministic (two builds produce identical result)', () => {
        const a = buildColorScales(sampleTheme.colors);
        const b = buildColorScales(sampleTheme.colors);
        expect(b).toEqual(a);
    });

    it('does not mutate the input colors object', () => {
        const original = { ...sampleTheme.colors };
        buildColorScales(sampleTheme.colors);
        expect(sampleTheme.colors).toEqual(original);
    });
});
