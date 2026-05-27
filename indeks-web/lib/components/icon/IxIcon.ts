const ICON_CDN_BASE = 'https://cdn.sparebank1.no/icons';

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

export class IxIcon extends HTMLElement {
    static get observedAttributes(): string[] {
        return ['name', 'materialdesignname', 'aria-label', 'aria-labelledby'];
    }

    connectedCallback(): void {
        this._update();
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue === newValue) return;
        this._update();
    }

    private _update(): void {
        const nameAttr = this.getAttribute('name');
        const materialDesignName = this.getAttribute('materialdesignname');
        const ariaLabel = this.getAttribute('aria-label');
        const ariaLabelledBy = this.getAttribute('aria-labelledby');

        const iconFileName = nameAttr
            ? (ICON_NAMES[nameAttr as IconName] ?? nameAttr)
            : materialDesignName;

        if (iconFileName) {
            this.style.setProperty('--ii-icon-url', `url(${ICON_CDN_BASE}/${iconFileName}.svg)`);
        } else {
            this.style.removeProperty('--ii-icon-url');
        }

        if (ariaLabel || ariaLabelledBy) {
            this.setAttribute('role', 'img');
            this.removeAttribute('aria-hidden');
        } else {
            this.removeAttribute('role');
            this.setAttribute('aria-hidden', 'true');
        }
    }
}
