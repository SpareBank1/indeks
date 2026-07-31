import type { OriginScaleNames } from '@sb1/indeks-tokens/generate';

/** Skalaene man kan overstyre, i visningsrekkefølge. */
export const colorScales: { name: OriginScaleNames; label: string }[] = [
    { name: 'brand', label: 'Brand' },
    { name: 'success', label: 'Success' },
    { name: 'info', label: 'Info' },
    { name: 'warning', label: 'Warning' },
    { name: 'danger', label: 'Danger' },
    { name: 'gray', label: 'Gray' },
    { name: 'neutral', label: 'Neutral' },
];

/** Standard basisfarge per skala, brukt som utgangspunkt i fargevelgeren. */
export const defaultColors: Record<OriginScaleNames, string> = {
    brand: '#0078d8',
    success: '#00885b',
    info: '#467ca4',
    warning: '#af6500',
    danger: '#c94e4f',
    gray: '#6d7888',
    neutral: '#af6516',
};
