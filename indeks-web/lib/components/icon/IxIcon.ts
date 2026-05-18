const ICON_CDN_BASE = 'https://cdn.sparebank1.no/icons';

export const ICON_NAMES = {
    hjem: 'home',
    meny: 'menu',
    sparing: 'savings',
} as const;

export type IconValue = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];
export type IconName = keyof typeof ICON_NAMES;

export class IxIcon extends HTMLElement {
    static get observedAttributes(): string[] {
        return ['name', 'materialdesignname', 'size', 'aria-label'];
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
        const size = this.getAttribute('size') ?? 'md';
        const ariaLabel = this.getAttribute('aria-label');

        const iconFileName = nameAttr
            ? (ICON_NAMES[nameAttr as IconName] ?? nameAttr)
            : materialDesignName;

        if (iconFileName) {
            this.style.setProperty('--ii-icon-url', `url(${ICON_CDN_BASE}/${iconFileName}.svg)`);
        } else {
            this.style.removeProperty('--ii-icon-url');
        }

        if (size && size !== 'md') {
            this.setAttribute('data-size', size);
        } else {
            this.removeAttribute('data-size');
        }

        if (ariaLabel) {
            this.setAttribute('role', 'img');
            this.removeAttribute('aria-hidden');
        } else {
            this.removeAttribute('role');
            this.setAttribute('aria-hidden', 'true');
        }
    }
}
