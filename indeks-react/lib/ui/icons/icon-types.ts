export const ICON_NAMES = {
    hjem: 'home',
    meny: 'menu',
    sparing: 'savings',
} as const;

export type IconValue = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];
export type IconName = keyof typeof ICON_NAMES;
