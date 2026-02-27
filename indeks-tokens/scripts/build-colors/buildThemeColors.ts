import Color from 'colorjs.io';
import { Theme } from '../../themes';
import {
    BuiltTheme,
    BuiltThemeColors,
    DEFAULT_STEPS,
    OriginColor,
    OriginScaleNames,
    ThemeColors,
    ThemeColorScale,
} from '../../themes/types';

export const DEFAULT_CHROMA = {
    0: 0.01,
    50: 0.02,
    100: 0.03,
    150: 0.05,
    200: 0.08,
    250: 0.14,
    300: 0.21,
    350: 0.29,
    400: 0.39,
    450: 0.49,
    500: 0.59,
    550: 0.65,
    600: 0.68,
    650: 0.65,
    700: 0.58,
    750: 0.48,
    800: 0.36,
    850: 0.22,
    900: 0.1,
    950: 0.03,
};

const lightnessValues = {
    '0': 0.99,
    '50': 0.9820951504625667,
    '100': 0.9693508410453796,
    '150': 0.9508844480599062,
    '200': 0.9258814729177034,
    '250': 0.8936370469937818,
    '300': 0.8506516916419451,
    '350': 0.7988509641666537,
    '400': 0.7364798645152209,
    '450': 0.6674381446838379,
    '500': 0.5968936773446889,
    '550': 0.5264686441729561,
    '600': 0.46159937419212205,
    '650': 0.4032662729116586,
    '700': 0.3500117288322116,
    '750': 0.3040197173871386,
    '800': 0.265156466960907,
    '850': 0.22874000701811523,
    '900': 0.19738369594328103,
    '950': 0.17,
};

export function buildTheme(theme: Theme): BuiltTheme {
    return {
        name: theme.name,
        colors: buildColorScales(theme.colors),
        themeable: theme.themeable,
        figmaName: theme.figmaName,
        identityColor: theme.identityColor,
    };
}
export function buildColorScales(colors: ThemeColors): BuiltThemeColors {
    const builtColors: BuiltThemeColors = {} as BuiltThemeColors;

    (Object.keys(colors) as OriginScaleNames[]).forEach((scaleName) => {
        builtColors[scaleName] = buildColorScale(colors[scaleName]);
    });

    builtColors['gray'][0] = '#FFFFFF'; // Overskriver gray 0 til å alltid være hvit

    return builtColors;
}
export function buildColorScale(originColor: OriginColor): ThemeColorScale {
    const colorScale: ThemeColorScale = {} as ThemeColorScale;
    DEFAULT_STEPS.forEach((step) => {
        const chromaModifier = DEFAULT_CHROMA[step];
        const color = new Color(originColor);
        const oklch = color.to('oklch');
        const lightness = lightnessValues[step];
        oklch.set({
            // override the origin (l)ightness to control the scale
            l: lightness,

            // modify the (c)hroma
            c: (c) => Math.sin(chromaModifier * Math.PI) * c,

            // (h)ue remains the same, no need to modify
        });

        colorScale[step] = oklch.to('srgb').toString({ format: 'hex' }) as OriginColor;
    });

    return colorScale;
}
