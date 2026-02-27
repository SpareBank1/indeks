import type { ThemeableProperties } from './types';

export const themeableDefaults: ThemeableProperties = {
    'font-family': {
        normal: 'Roboto',
        heading: 'Roboto',
    },
    'font-weight': {
        regular: 400,
        medium: 500,
        button: 600,
    },
    border: {
        radius: {
            checkbox: '4px',
            input: '8px',
            button: 'var(--ix-border-radius-pill)',
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '40px',
        },
    },
};
