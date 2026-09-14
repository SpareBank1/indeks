import { describe, it, expect } from 'vitest';
import { buildTailwindTokens } from '../css/tailwind';

const tokens = {
    border: {
        width: { _property: 'border-width', default: { value: '1px', description: '' } },
        radius: {
            _property: 'border-radius',
            md: { value: '16px', description: '' },
            pill: { value: '9999px', description: '' },
        },
    },
    breakpoint: {
        _property: 'width',
        md: { value: '1024px', description: '' },
    },
    'z-index': {
        _property: 'z-index',
        _key: 'z',
        dialog: { value: 60, description: '' },
    },
    font: {
        base: { size: { value: '1rem', description: '', internal: true } },
        size: { '0': { value: 'var(--ii-font-base-size)', description: '', internal: true } },
        weight: {
            _property: 'font-weight',
            regular: { value: '400', description: '' },
            bold: { value: '700', description: '', internal: true },
        },
    },
    transition: {
        animation: { _property: 'transition-timing-function', value: 'cubic-bezier(.25, .1, .25, 1)', description: '' },
        duration: { _property: 'transition-duration', value: '0.2s', description: '' },
    },
};

const build = () => buildTailwindTokens('0.0.0-test', tokens);

describe('buildTailwindTokens', () => {
    it('aliaser border-radius på Tailwinds radius-navnerom', () => {
        expect(build()).toContain('--radius-md: var(--ix-border-radius-md);');
        expect(build()).toContain('--radius-pill: var(--ix-border-radius-pill);');
    });

    it('emitter breakpoints som literalverdi, siden Tailwind ikke resolver var() i media queries', () => {
        expect(build()).toContain('--breakpoint-md: 1024px;');
        expect(build()).not.toContain('--breakpoint-md: var(');
    });

    it('hopper over internal-tokens, som ikke er offentlig API', () => {
        const css = build();
        expect(css).not.toContain('--ii-');
        expect(css).not.toContain('--font-weight-bold');
    });

    it('tar med offentlige font-weights', () => {
        expect(build()).toContain('--font-weight-regular: var(--ix-font-weight-regular);');
    });

    it('hopper over tokens uten Tailwind-navnerom', () => {
        const css = build();
        // z-index, border-width og transition-duration har ingen tema-navnerom i v4 —
        // de brukes som z-[var(--ix-z-index-dialog)] i stedet.
        expect(css).not.toContain('z-index');
        expect(css).not.toContain('--border-width');
        expect(css).not.toContain('duration');
    });

    it('mapper transition-timing-function til ease-navnerommet', () => {
        expect(build()).toContain('--ease-default: var(--ix-transition-animation);');
    });

    it('mapper font-family-normal til --font-sans, siden .font-normal er font-weight i Tailwind', () => {
        const css = build();
        expect(css).toContain('--font-sans: var(--ix-font-family-normal);');
        expect(css).not.toContain('--font-normal:');
    });

    it('emitterer hver Tailwind-nøkkel én gang, selv om radius står både i border.json og themeables', () => {
        const occurrences = build().match(/--radius-md:/g) ?? [];
        expect(occurrences).toHaveLength(1);
    });

    it('bruker @theme inline, så density og fargemodus virker lenger ned i treet', () => {
        expect(build()).toContain('@theme inline {');
    });
});
