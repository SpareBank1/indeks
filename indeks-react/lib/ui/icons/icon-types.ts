export const ICON_NAMES = {
    hjem: 'home',
    meny: 'menu',
    sparing: 'savings',
    lukk: 'close',
    'pil-hoyre': 'chevron_right',
    'legg-til': 'add',
    hake: 'check',
    'apne-ekstern': 'open_in_new',
    bankkonto: 'account_balance',
    rediger: 'edit',
    betalingskort: 'credit_card',
    slett: 'delete',
    'last-ned': 'download',
    person: 'person',
    'pil-ned': 'keyboard_arrow_down',
    'e-post': 'mail',
    betaling: 'payments',
    info: 'info',
    sok: 'search',
    innstillinger: 'settings',
    bil: 'directions_car',
    'pil-venstre': 'chevron_left',
    feil: 'error',
} as const;

export type IconValue = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];
export type IconName = keyof typeof ICON_NAMES;
