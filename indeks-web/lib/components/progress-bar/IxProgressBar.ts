/**
 * IxProgressBar — selvdokumenterende progress-bar som genererer all indre HTML.
 *
 * ## Designfilosofi
 *
 * Forfatteren skriver kun host-elementet med attributter — komponenten bygger
 * hele den indre strukturen (header, track, fill, support-text) selv.
 *
 * ## Attributter
 *
 * | Attributt          | Type                              | Default   | Beskrivelse                   |
 * |--------------------|-----------------------------------|-----------|-------------------------------|
 * | `value`            | number (0–100)                    | `0`       | Progresjonsverdi. Clampes.    |
 * | `data-state`       | `active` \| `success` \| `error`  | `active`  | Tilstand. CSS leser direkte.  |
 * | `label`            | string                            | —         | Synlig label over sporet.     |
 * | `data-support-text`| string                            | —         | Støttetekst under sporet.     |
 *
 * @example Grunnleggende bruk
 * <ix-progress-bar value="65" data-state="active"
 *   label="Laster opp dokumenter"
 *   data-support-text="65 % fullført">
 * </ix-progress-bar>
 *
 * @example Uten label
 * <ix-progress-bar value="30" data-state="active"></ix-progress-bar>
 *
 * @example Fullført
 * <ix-progress-bar value="100" data-state="success"
 *   label="Laster opp dokumenter"
 *   data-support-text="Alle dokumenter er lastet opp">
 * </ix-progress-bar>
 */

type ProgressBarState = 'active' | 'success' | 'error';

const ICON_CDN_BASE = 'https://cdn.sparebank1.no/icons';
const STATE_ICONS: Record<Exclude<ProgressBarState, 'active'>, string> = {
    success: 'check_circle',
    error: 'error',
};

let progressBarCounter = 0;

export class IxProgressBar extends HTMLElement {
    static get observedAttributes(): string[] {
        return ['value', 'data-state', 'label', 'data-support-text'];
    }

    private _announcer: HTMLSpanElement | null = null;
    private _header: HTMLElement | null = null;
    private _track: HTMLElement | null = null;
    private _supportText: HTMLElement | null = null;
    private _labelEl: HTMLElement | null = null;

    connectedCallback(): void {
        this._build();
        this._sync();
    }

    disconnectedCallback(): void {
        this._announcer = null;
        this._header = null;
        this._track = null;
        this._supportText = null;
        this._labelEl = null;
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue === newValue) return;
        if (this.isConnected) {
            this._sync();
        }
    }

    // ── Bygg DOM-struktur ────────────────────────────────────────────────────

    private _build(): void {
        this.innerHTML = '';

        this._header = document.createElement('div');
        this._header.className = 'ix-progress-bar__header';

        this._labelEl = document.createElement('span');
        this._labelEl.className = 'ix-progress-bar__label';
        this._header.appendChild(this._labelEl);

        const fill = document.createElement('div');
        fill.className = 'ix-progress-bar__fill';

        this._track = document.createElement('div');
        this._track.className = 'ix-progress-bar__track';
        this._track.appendChild(fill);

        this._supportText = document.createElement('span');
        this._supportText.className = 'ix-progress-bar__support-text';

        this._announcer = document.createElement('span');
        this._announcer.setAttribute('aria-live', 'polite');
        this._announcer.setAttribute('aria-atomic', 'true');
        this._announcer.style.cssText =
            'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';

        this.appendChild(this._header);
        this.appendChild(this._track);
        this.appendChild(this._supportText);
        this.appendChild(this._announcer);
    }

    // ── Synkronisering ────────────────────────────────────────────────────────

    private _sync(): void {
        if (!this._track || !this._header || !this._supportText || !this._labelEl) return;

        const state = this._resolveState();
        const value = this._resolveValue();
        const label = this.getAttribute('label') ?? '';
        const supportText = this.getAttribute('data-support-text') ?? '';

        this._labelEl.textContent = label;
        this._supportText.textContent = supportText;

        // Koble host til label via aria-labelledby når synlig label finnes
        if (label) {
            if (!this._labelEl.id) {
                this._labelEl.id = `ix-progress-bar-label-${++progressBarCounter}`;
            }
            this.setAttribute('aria-labelledby', this._labelEl.id);
        } else {
            this.removeAttribute('aria-labelledby');
        }

        this._track!.style.setProperty('--ix-progress-bar-value', `${value}%`);

        const hasHeaderContent = !!label || state !== 'active';
        this._header!.hidden = !hasHeaderContent;

        if (state === 'active') {
            this._applyActiveAria(value);
        } else {
            this._applyTerminalAria();
            this._announce(state, supportText);
        }

        this._syncIcon(state);
    }

    private _applyActiveAria(value: number): void {
        this.setAttribute('role', 'progressbar');
        this.setAttribute('aria-valuemin', '0');
        this.setAttribute('aria-valuemax', '100');
        this.setAttribute('aria-valuenow', String(value));
        this._track!.setAttribute('aria-hidden', 'true');
    }

    private _applyTerminalAria(): void {
        this.removeAttribute('role');
        this.removeAttribute('aria-valuemin');
        this.removeAttribute('aria-valuemax');
        this.removeAttribute('aria-valuenow');
        this._track!.setAttribute('aria-hidden', 'true');
    }

    private _announce(state: Exclude<ProgressBarState, 'active'>, supportText: string): void {
        if (!this._announcer) return;
        const fallback = state === 'success' ? 'Fullført' : 'Feilet';
        this._announcer.textContent = supportText || fallback;
    }

    private _syncIcon(state: ProgressBarState): void {
        const existing = this._header!.querySelector<HTMLElement>('[data-progress-bar="icon"]');

        if (state === 'active') {
            existing?.remove();
            return;
        }

        const iconName = STATE_ICONS[state];
        const maskUrl = `url(${ICON_CDN_BASE}/${iconName}.svg)`;

        if (existing) {
            existing.style.maskImage = maskUrl;
            (existing.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = maskUrl;
            return;
        }

        const icon = document.createElement('span');
        icon.setAttribute('data-progress-bar', 'icon');
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-hidden', 'true');
        icon.className = 'ix-icon';
        icon.style.maskImage = maskUrl;
        (icon.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = maskUrl;
        this._header!.appendChild(icon);
    }

    // ── Hjelpere ─────────────────────────────────────────────────────────────

    private _resolveState(): ProgressBarState {
        const raw = this.getAttribute('data-state');
        if (raw === 'success' || raw === 'error') return raw;
        if (raw !== null && raw !== 'active') {
            console.warn(`[ix-progress-bar] Ugyldig data-state="${raw}". Gyldige verdier: active | success | error. Faller tilbake til "active".`);
        }
        return 'active';
    }

    private _resolveValue(): number {
        const rawAttr = this.getAttribute('value');
        const raw = parseFloat(rawAttr ?? '0');
        if (isNaN(raw)) {
            if (rawAttr !== null) {
                console.warn(`[ix-progress-bar] Ugyldig value="${rawAttr}". Forventet et tall mellom 0 og 100. Faller tilbake til 0.`);
            }
            return 0;
        }
        if (raw < 0 || raw > 100) {
            console.warn(`[ix-progress-bar] value="${raw}" er utenfor gyldig område [0, 100]. Clampes til ${Math.min(100, Math.max(0, raw))}.`);
        }
        return Math.min(100, Math.max(0, raw));
    }
}
