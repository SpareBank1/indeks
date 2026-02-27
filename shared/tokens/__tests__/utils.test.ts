import { describe, expect, it } from 'vitest';
import { buildCSSVarNameFromToken, flattenTokens, type FlatToken } from '../utils.ts';

describe('flattenTokens', () => {
    it('handles transition tokens with direct value and nested structure', () => {
        const input = {
            animation: {
                _property: 'transition-timing-function',
                value: 'ease-in-out',
                description: 'Standard overgangsanimasjon.',
            },
            property: {
                _property: 'transition-property',
                all: {
                    value: 'all',
                    description: 'Setter transition animation på alle properties',
                },
            },
            duration: {
                _property: 'transition-duration',
                value: '0.2s',
                description: 'Standard overgangsvarighet.',
            },
        };

        const out = flattenTokens(input, 'transition');
        expect(out.length).toBe(3);

        const animation = out.find((t) => t.path.join('.') === 'transition.animation');
        const propertyAll = out.find((t) => t.path.join('.') === 'transition.property.all');
        const duration = out.find((t) => t.path.join('.') === 'transition.duration');

        expect(animation?.keyPath).toEqual(['transition', 'animation']);
        expect(animation?._property).toBe('transition-timing-function');
        expect(animation?.value).toBe('ease-in-out');

        expect(propertyAll?.keyPath).toEqual(['transition', 'property', 'all']);
        expect(propertyAll?._property).toBe('transition-property');
        expect(propertyAll?.value).toBe('all');

        expect(duration?.keyPath).toEqual(['transition', 'duration']);
        expect(duration?._property).toBe('transition-duration');
        expect(duration?.value).toBe('0.2s');
    });

    it('handles border tokens with multiple nested properties', () => {
        const input = {
            width: {
                _property: 'border-width',
                default: {
                    value: '1px',
                    description: 'Standard kantlinjebredde.',
                },
                bold: {
                    value: '2px',
                    description: 'Kantlinjebredde for knapper.',
                },
            },
            radius: {
                _property: 'border-radius',
                circle: {
                    value: '50%',
                    description: 'Fullt avrundet kantlinje-radius.',
                },
                pill: {
                    value: '9999px',
                    description: 'Kantlinje-radius for pille-formede elementer. Feks. knapper.',
                },
            },
        };

        const out = flattenTokens(input, 'border');
        expect(out.length).toBe(4);

        const widthDefault = out.find((t) => t.path.join('.') === 'border.width.default');
        const widthBold = out.find((t) => t.path.join('.') === 'border.width.bold');
        const radiusCircle = out.find((t) => t.path.join('.') === 'border.radius.circle');
        const radiusPill = out.find((t) => t.path.join('.') === 'border.radius.pill');

        expect(widthDefault?.keyPath).toEqual(['border', 'width', 'default']);
        expect(widthDefault?._property).toBe('border-width');
        expect(widthDefault?.value).toBe('1px');

        expect(widthBold?.keyPath).toEqual(['border', 'width', 'bold']);
        expect(widthBold?._property).toBe('border-width');
        expect(widthBold?.value).toBe('2px');

        expect(radiusCircle?.keyPath).toEqual(['border', 'radius', 'circle']);
        expect(radiusCircle?._property).toBe('border-radius');
        expect(radiusCircle?.value).toBe('50%');

        expect(radiusPill?.keyPath).toEqual(['border', 'radius', 'pill']);
        expect(radiusPill?._property).toBe('border-radius');
        expect(radiusPill?.value).toBe('9999px');
    });

    it('propagates _property from parent, overridden by leaf', () => {
        const input = {
            _property: 'color',
            primary: { value: 'red', description: 'Primary border color' },
            thin: { _property: 'width', value: '1px', description: 'Thin border width' },
        };

        const out = flattenTokens(input, 'border');
        const primary = out.find((t) => t.path.join('.') === 'border.primary');
        const thin = out.find((t) => t.path.join('.') === 'border.thin');

        expect(primary?._property).toBe('color');
        expect(thin?._property).toBe('width');
    });

    it('uses group _key to seed keyPath and leaf _key to override', () => {
        const input = {
            _key: 'sp',
            small: { _key: 'sm', value: '4px', description: 'Small spacing' },
            medium: { value: '8px', description: 'Medium spacing' },
        };

        const out = flattenTokens(input, 'spacing');
        const small = out.find((t) => t.path.join('.') === 'spacing.small');
        const medium = out.find((t) => t.path.join('.') === 'spacing.medium');

        expect(small?.keyPath).toEqual(['sp', 'sm']);
        expect(medium?.keyPath).toEqual(['sp', 'medium']);
    });

    it('defaults keyPath to path segments when no _key is present', () => {
        const input = {
            focus: { value: '2px', description: 'Focus outline width' },
        };

        const out = flattenTokens(input, 'outline');
        expect(out[0].keyPath).toEqual(['outline', 'focus']);
    });

    it('uses _property in keyPath when present in nested structure', () => {
        const input = {
            width: {
                _property: 'outline-width',
                default: {
                    value: '2px',
                    description: 'Standard outline-bredde.',
                },
            },
            offset: {
                _property: 'outline-offset',
                default: {
                    value: '3px',
                    description: 'Standard outline-offset.',
                },
            },
        };

        const out = flattenTokens(input, 'outline');
        const widthDefault = out.find((t) => t.path.join('.') === 'outline.width.default');
        const offsetDefault = out.find((t) => t.path.join('.') === 'outline.offset.default');

        expect(widthDefault?.keyPath).toEqual(['outline', 'width', 'default']);
        expect(offsetDefault?.keyPath).toEqual(['outline', 'offset', 'default']);
    });
});

describe('buildCSSVarNameFromToken', () => {
    it('builds non-internal CSS var without prefixes', () => {
        const token: FlatToken = {
            path: ['border', 'width', 'default'],
            keyPath: ['border', 'width', 'default'],
            description: 'Standard kantlinjebredde',
            value: '1px',
            internal: false,
            prefixes: [],
        };
        expect(buildCSSVarNameFromToken(token)).toBe('--ix-border-width-default');
    });

    it('builds internal CSS var with multiple prefixes', () => {
        const token: FlatToken = {
            path: ['spacing', 'small'],
            keyPath: ['spacing', 'small'],
            description: 'Small spacing',
            value: '4px',
            internal: true,
            prefixes: ['layout', 'mobile'],
        };
        expect(buildCSSVarNameFromToken(token)).toBe('--ii-layout-mobile-spacing-small');
    });
});
