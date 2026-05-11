/**
 * IxProgressBar — ARIA-lim for nativt `<progress>`-element.
 *
 * Forfatteren skriver `<label>` og `<progress>` som barn.
 * Komponenten kobler dem, injiserer visuell prosentvisning og statusikon,
 * og annonserer tilstandsskift via `aria-live`.
 *
 * @example Grunnleggende bruk
 * <ix-progress-bar>
 *   <label>Laster opp dokumenter</label>
 *   <progress value="65" max="100"></progress>
 * </ix-progress-bar>
 *
 * @example Uten synlig label
 * <ix-progress-bar aria-label="Laster inn innhold">
 *   <progress value="30" max="100"></progress>
 * </ix-progress-bar>
 *
 * @example Fullført
 * <ix-progress-bar state="success">
 *   <label>Laster opp dokumenter</label>
 *   <progress value="100" max="100"></progress>
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
        return ['state', 'aria-label'];
    }

    private _progress: HTMLProgressElement | null = null;
    private _label: HTMLLabelElement | null = null;
    private _percent: HTMLSpanElement | null = null;
    private _announcer: HTMLSpanElement | null = null;
    private _observer: MutationObserver | null = null;

    connectedCallback(): void {
        this._wire();
        this._observe();
        this._syncState();
    }

    disconnectedCallback(): void {
        this._observer?.disconnect();
        this._observer = null;
        this._progress = null;
        this._label = null;
        this._percent = null;
        this._announcer = null;
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue === newValue) return;
        if (this.isConnected) {
            if (name === 'aria-label') {
                this._forwardAriaLabel();
            } else {
                this._syncState();
            }
        }
    }

    // ── Kobling ───────────────────────────────────────────────────────────────

    private _wire(): void {
        this._progress = this.querySelector<HTMLProgressElement>('progress');
        this._label = this.querySelector<HTMLLabelElement>('label');

        if (!this._progress) return;

        if (this._label) {
            if (!this._progress.id) {
                this._progress.id = `ix-pb-${++progressBarCounter}`;
            }
            this._label.htmlFor = this._progress.id;
        } else {
            this._forwardAriaLabel();
        }

        // Injiser prosentvisning
        if (!this.querySelector('.ix-progress-bar__percent')) {
            this._percent = document.createElement('span');
            this._percent.className = 'ix-progress-bar__percent';
            this._progress.insertAdjacentElement('beforebegin', this._percent);
        } else {
            this._percent = this.querySelector<HTMLSpanElement>('.ix-progress-bar__percent');
        }

        // Injiser aria-live-announcer
        if (!this.querySelector('[aria-live]')) {
            this._announcer = document.createElement('span');
            this._announcer.setAttribute('aria-live', 'polite');
            this._announcer.setAttribute('aria-atomic', 'true');
            this._announcer.style.cssText =
                'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';
            this.appendChild(this._announcer);
        } else {
            this._announcer = this.querySelector<HTMLSpanElement>('[aria-live]');
        }

        this._updatePercent();
    }

    private _observe(): void {
        if (!this._progress) return;
        this._observer = new MutationObserver(() => {
            this._updatePercent();
        });
        this._observer.observe(this._progress, { attributes: true, attributeFilter: ['value'] });
    }

    // ── Synkronisering ────────────────────────────────────────────────────────

    private _syncState(): void {
        const state = this._resolveState();
        this._syncIcon(state);
        this._syncProgressAria(state);
        if (state !== 'active') {
            this._announce(state);
        }
        if (this._percent) {
            this._percent.hidden = state !== 'active';
        }
    }

    private _syncProgressAria(state: ProgressBarState): void {
        if (!this._progress) return;
        if (state === 'active') {
            this._progress.removeAttribute('aria-hidden');
        } else {
            this._progress.setAttribute('aria-hidden', 'true');
        }
    }

    private _updatePercent(): void {
        if (!this._percent || !this._progress) return;
        const max = this._progress.max || 100;
        const value = this._progress.value;
        const pct = Math.round((value / max) * 100);
        this._percent.textContent = `${pct} %`;
    }

    private _forwardAriaLabel(): void {
        if (!this._progress || this._label) return;
        const label = this.getAttribute('aria-label');
        if (label) {
            this._progress.setAttribute('aria-label', label);
        } else {
            this._progress.removeAttribute('aria-label');
        }
    }

    private _announce(state: Exclude<ProgressBarState, 'active'>): void {
        if (!this._announcer) return;
        this._announcer.textContent = state === 'success' ? 'Fullført' : 'Feilet';
    }

    private _syncIcon(state: ProgressBarState): void {
        const existing = this.querySelector<HTMLElement>('[data-progress-bar="icon"]');

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
        icon.setAttribute('aria-hidden', 'true');
        icon.className = 'ix-icon';
        icon.style.maskImage = maskUrl;
        (icon.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = maskUrl;

        // Plasser ikon etter label (eller som første barn) — kolonneposisjon styres av CSS
        if (this._label) {
            this._label.insertAdjacentElement('afterend', icon);
        } else {
            this.insertAdjacentElement('afterbegin', icon);
        }
    }

    // ── Hjelpere ─────────────────────────────────────────────────────────────

    private _resolveState(): ProgressBarState {
        const raw = this.getAttribute('state');
        if (raw === 'success' || raw === 'error') return raw;
        if (raw !== null && raw !== 'active') {
            console.warn(
                `[ix-progress-bar] Ugyldig state="${raw}". Gyldige verdier: active | success | error. Faller tilbake til "active".`,
            );
        }
        return 'active';
    }
}
