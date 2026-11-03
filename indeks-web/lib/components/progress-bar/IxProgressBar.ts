/**
 * IxProgressBar — viser fremdrift i én sammenhengende prosess.
 *
 * DOM-generator: web componenten eier og genererer all indre HTML (header med
 * label + verdi, track + fill, og en støttetekst-region).
 * Forfatteren skriver kun host-elementet `<ix-progress-bar>` med attributter —
 * ingen intern struktur.
 *
 * Tilstander (`data-state`):
 *  - `active` (default): role="progressbar" med aria-valuenow/min/max på host.
 *    Nøytral/primær fremdriftsfarge. Ingen statusikon. Kan vise prosent.
 *  - `success` / `error`: rollen `progressbar` FJERNES (prosessen er ferdig/avbrutt).
 *    `data-status` (success/danger) kobler --ix-color-status-* til fyllet.
 *    Støtteteksten vises som en ValidationMessage (`data-field="error"` med
 *    `data-status` og badge-ikon), slik Figma viser. Den er en aria-live-region
 *    (role="status") så overgangen annonseres politely.
 *
 * Komponenten er rent informativ og aldri fokuserbar (setter aldri tabindex).
 * Ugyldige verdier klampes: value < 0 → 0, > 100 → 100, ikke-numerisk → 0.
 *
 * iOS-workaround: VoiceOver leser ikke løpende `aria-valuenow`-endringer på
 * `role="progressbar"`. På iOS byttes derfor rollen i `active` til `role="img"`
 * og verdien bakes inn i `aria-label` (samme mønster som u-elements sin
 * u-progress). Desktop beholder ekte progressbar-semantikk.
 */

import { isIOS } from '../../utils/platform.js';

let progressBarCounter = 0;

export type ProgressBarState = 'active' | 'success' | 'error';

// Samme ikoner som ValidationMessage.
const STATE_ICON: Record<Exclude<ProgressBarState, 'active'>, string> = {
    success: 'check',
    error: 'close',
};

// data-state → data-status (kobler --ix-color-status-* via status-colors.css).
const STATE_STATUS: Record<Exclude<ProgressBarState, 'active'>, string> = {
    success: 'success',
    error: 'danger',
};

export class IxProgressBar extends HTMLElement {
    private _instanceId = ++progressBarCounter;

    // Genererte delelementer — caches for idempotent rendering.
    private _header: HTMLDivElement | null = null;
    private _label: HTMLSpanElement | null = null;
    private _headerEnd: HTMLSpanElement | null = null;
    private _track: HTMLDivElement | null = null;
    private _fill: HTMLDivElement | null = null;
    private _support: HTMLParagraphElement | null = null;
    private _supportText: HTMLSpanElement | null = null;
    private _icon: HTMLElement | null = null;

    static get observedAttributes(): string[] {
        return ['value', 'data-state', 'label', 'data-support-text', 'data-show-value', 'data-value-text'];
    }

    connectedCallback(): void {
        this._ensureStructure();
        this._update();
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
        if (!this.isConnected) return;
        if (oldValue === newValue) return;
        this._update();
    }

    // DOM-generatoren har ingen observers, event listeners eller timers å koble
    // fra. Cache-referansene beholdes bevisst: den genererte strukturen blir
    // værende i host-elementet ved unmount, så en remount skal gjenbruke den
    // (ikke duplisere) — connectedCallback kaller derfor bare _update() på nytt.
    disconnectedCallback(): void {
        // Ingen ressurser å rydde.
    }

    /** Bygger den indre strukturen én gang (idempotent). */
    private _ensureStructure(): void {
        if (this._track) return;

        // Header: label (venstre) + verdi (høyre).
        this._header = document.createElement('div');
        this._header.className = 'ix-progress-bar__header';

        this._label = document.createElement('span');
        this._label.className = 'ix-progress-bar__label';
        this._label.id = `ix-progress-bar-label-${this._instanceId}`;

        this._headerEnd = document.createElement('span');
        this._headerEnd.className = 'ix-progress-bar__value';

        this._header.append(this._label, this._headerEnd);

        // Track + fill.
        this._track = document.createElement('div');
        this._track.className = 'ix-progress-bar__track';
        this._fill = document.createElement('div');
        this._fill.className = 'ix-progress-bar__fill';
        this._track.appendChild(this._fill);

        // Støttetekst — alltid i DOM som stabil live-region (role="status").
        // Skal aldri fjernes fra DOM (skjermlesere fanger ikke opp endringer i
        // en live-region som ikke fantes da innholdet ble satt inn).
        this._support = document.createElement('p');
        this._support.className = 'ix-progress-bar__support';
        this._support.id = `ix-progress-bar-support-${this._instanceId}`;
        this._support.setAttribute('role', 'status');
        this._support.setAttribute('aria-live', 'polite');
        this._support.setAttribute('aria-atomic', 'false');
        this._supportText = document.createElement('span');
        this._support.appendChild(this._supportText);

        this.append(this._header, this._track, this._support);
    }

    private _update(): void {
        if (!this._track || !this._fill || !this._header || !this._label || !this._headerEnd || !this._support || !this._supportText) {
            return;
        }

        const state = this._resolveState();
        const clamped = this._clampValue(this.getAttribute('value'));
        const label = this.getAttribute('label');
        const supportText = this.getAttribute('data-support-text');
        const valueText = this.getAttribute('data-value-text');
        const showValue = this.hasAttribute('data-show-value');
        const isActive = state === 'active';

        // --- Fyllgrad ---
        // success er visuelt ferdigstilt (100 %); error beholder klampet verdi;
        // active følger klampet verdi.
        const fillPercent = state === 'success' ? 100 : clamped;
        this.style.setProperty('--ii-progress-bar-fill', `${fillPercent}%`);

        // --- Label ---
        this._label.textContent = label ?? '';
        this._label.hidden = !label;

        // --- Verdi (kun active) ---
        this._updateValue(clamped, showValue, isActive, Boolean(label));

        // --- Støttetekst, som ValidationMessage i success/error ---
        this._supportText.textContent = supportText ?? '';
        this._updateStatusMessage(state, Boolean(supportText));

        // Et tilgjengelig navn kan komme fra label, aria-label eller
        // aria-labelledby satt av konsumenten.
        const hasAccessibleName =
            Boolean(label) || this.hasAttribute('aria-label') || this.hasAttribute('aria-labelledby');

        // --- Host-tilstand og ARIA ---
        if (isActive) {
            this.removeAttribute('data-status');

            // A1: en progressbar uten tilgjengelig navn er et 4.1.2-brudd.
            if (import.meta.env.DEV && !hasAccessibleName) {
                console.warn(
                    '[ix-progress-bar] Mangler tilgjengelig navn i active-tilstand. Sett label eller aria-label.',
                );
            }

            if (isIOS()) {
                // A2: VoiceOver leser ikke løpende aria-valuenow-endringer på
                // role="progressbar". Bruk role="img" og bak verdien inn i
                // aria-label. valueText (lokalisert) foretrekkes; «NN %» er
                // fallback. aria-value* og aria-labelledby er ikke relevante på
                // role="img" og fjernes; aria-describedby beholdes.
                this.setAttribute('role', 'img');
                this.removeAttribute('aria-valuemin');
                this.removeAttribute('aria-valuemax');
                this.removeAttribute('aria-valuenow');
                this.removeAttribute('aria-valuetext');
                this.removeAttribute('aria-labelledby');
                const valuePart = valueText ?? `${Math.round(clamped)}\u00A0%`;
                const iosLabel = [label, valuePart].filter(Boolean).join(', ');
                // Ikke overskriv en aria-label konsumenten selv har satt uten label.
                if (label || !this.hasAttribute('aria-label')) {
                    this.setAttribute('aria-label', iosLabel);
                }
                this._setAriaRef('aria-describedby', supportText ? this._support.id : null);
            } else {
                // Ekte progressbar-semantikk på desktop og Android.
                this.setAttribute('role', 'progressbar');
                this.setAttribute('aria-valuemin', '0');
                this.setAttribute('aria-valuemax', '100');
                this.setAttribute('aria-valuenow', String(Math.round(clamped)));
                if (valueText) {
                    this.setAttribute('aria-valuetext', valueText);
                } else {
                    this.removeAttribute('aria-valuetext');
                }
                this._setAriaRef('aria-labelledby', label ? this._label.id : null);
                this._setAriaRef('aria-describedby', supportText ? this._support.id : null);
            }
        } else {
            // success/error: ikke lenger en progressbar. Rollen og alle
            // value-attributtene fjernes; status formidles via data-status +
            // ikon + tekst (aldri farge alene).
            this.removeAttribute('role');
            this.removeAttribute('aria-valuemin');
            this.removeAttribute('aria-valuemax');
            this.removeAttribute('aria-valuenow');
            this.removeAttribute('aria-valuetext');
            this.removeAttribute('aria-label');
            this.removeAttribute('aria-labelledby');
            this.removeAttribute('aria-describedby');
            this.setAttribute('data-status', STATE_STATUS[state]);

            // A5: uten støttetekst blir overgangen til success/error stille for
            // skjermleser (live-regionen får ikke nytt innhold).
            if (import.meta.env.DEV && !supportText) {
                console.warn(
                    `[ix-progress-bar] ${state} uten data-support-text annonseres ikke for skjermleser. Sett støttetekst.`,
                );
            }
        }
    }

    /** Prosentverdien vises i header-slutten, bare i active. */
    private _updateValue(clamped: number, showValue: boolean, isActive: boolean, hasLabel: boolean): void {
        if (!this._headerEnd || !this._header) return;

        const visible = isActive && showValue;
        this._headerEnd.textContent = visible ? `${Math.round(clamped)}\u00A0%` : '';
        this._headerEnd.hidden = !visible;

        // Header skjules helt når den er tom.
        this._header.hidden = !hasLabel && !visible;
    }

    /**
     * I success/error med tekst blir støtteteksten en ValidationMessage med
     * badge-ikon foran. Uten tekst vises ingenting, så ikonet ikke står alene.
     */
    private _updateStatusMessage(state: ProgressBarState, hasText: boolean): void {
        if (!this._support || !this._supportText) return;

        if (state === 'active' || !hasText) {
            this._support.removeAttribute('data-field');
            this._support.removeAttribute('data-status');
            this._icon?.remove();
            return;
        }

        const status = STATE_STATUS[state];
        this._support.setAttribute('data-field', 'error');
        // Som ValidationMessage: data-status bare for success, feil er standard.
        if (state === 'success') {
            this._support.setAttribute('data-status', 'success');
        } else {
            this._support.removeAttribute('data-status');
        }
        const icon = this._ensureIcon();
        icon.setAttribute('name', STATE_ICON[state]);
        icon.setAttribute('data-status', status);
        this._support.insertBefore(icon, this._supportText);
    }

    private _ensureIcon(): HTMLElement {
        if (!this._icon) {
            this._icon = document.createElement('ix-icon');
            this._icon.setAttribute('data-badge', '');
            // Dekorativt — IxIcon setter selv aria-hidden når uten label, men vi
            // er eksplisitte: status formidles av tekst, ikonet er redundant.
            this._icon.setAttribute('aria-hidden', 'true');
        }
        return this._icon;
    }

    private _resolveState(): ProgressBarState {
        const raw = this.getAttribute('data-state');
        if (raw === 'success' || raw === 'error') return raw;
        return 'active';
    }

    /** Klamper til 0–100. Ikke-numerisk → 0. */
    private _clampValue(raw: string | null): number {
        const parsed = Number(raw);
        if (raw === null || raw.trim() === '' || !Number.isFinite(parsed)) return 0;
        if (parsed < 0) return 0;
        if (parsed > 100) return 100;
        return parsed;
    }

    private _setAriaRef(attr: string, id: string | null): void {
        if (id) {
            this.setAttribute(attr, id);
        } else {
            this.removeAttribute(attr);
        }
    }
}
