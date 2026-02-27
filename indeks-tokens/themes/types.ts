export type OriginColor = `#${string}` | `rgb(${string})` | `rgba(${string})` | `hsl(${string})` | `hsla(${string})`;

export type OriginScaleNames = 'brand' | 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'gray';

export type ThemeableProperties = {
    'font-family'?: {
        normal?: string;
        heading?: string;
        icons?: string;
    };
    'font-weight'?: {
        regular?: number;
        medium?: number;
        button?: number;
    };
    border?: {
        radius?: {
            button?: string;
            checkbox?: string;
            input?: string;
            xs?: string;
            sm?: string;
            md?: string;
            lg?: string;
            xl?: string;
        };
    };
};

export type ThemeColors = Record<OriginScaleNames, OriginColor>;
export type ThemeColorScale = Record<(typeof DEFAULT_STEPS)[number], OriginColor>;
export type BuiltThemeColors = Record<OriginScaleNames, ThemeColorScale>;

export type Theme = {
    name: string;
    figmaName?: string;
    identityColor: OriginColor;
    colors: ThemeColors;
    themeable?: ThemeableProperties;
};

export type BuiltTheme = {
    name: string;
    figmaName?: string;
    identityColor: OriginColor;
    colors: BuiltThemeColors;
    themeable: ThemeableProperties;
};

export const DEFAULT_STEPS = [
    0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
] as const;
