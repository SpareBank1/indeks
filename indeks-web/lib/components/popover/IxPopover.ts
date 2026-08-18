/**
 * IxPopover — ARIA-lim for en popover med kontekstuell informasjon eller handlinger.
 *
 * ## Designfilosofi
 *
 * Komponenten kobler en trigger-knapp med et innholdspanel. Forfatteren skriver
 * en <button> (trigger) og en .ix-popover__content i light DOM. Komponentens jobb
 * er å sette opp ARIA-attributter, håndtere åpne/lukke-logikk, posisjonere panelet,
 * og styre fokus.
 *
 * ## Fokushåndtering
 *
 * Når popoveren åpnes, flyttes fokus til første focusable element i content (hvis det
 * finnes). Når popoveren lukkes med Escape, returneres fokus til trigger. Fokus trappes IKKE —
 * brukeren kan tabbe ut av popoveren naturlig.
 *
 * ## Posisjonering
 *
 * Panelet posisjoneres manuelt med getBoundingClientRect + viewport-clamp
 * (samme grep som dropdown og tooltip) — position: fixed, JS setter top/left.
 * Auto-flip brukes hvis det ikke er nok plass i ønsket retning.
 *
 * @example
 * <ix-popover placement="top">
 *   <button class="ix-button">Åpne popover</button>
 *   <div class="ix-popover__content">
 *     <div class="ix-popover__heading">Overskrift</div>
 *     <div class="ix-popover__body">Forklarende tekst her.</div>
 *     <div class="ix-popover__actions">
 *       <button class="ix-button" data-size="sm">OK</button>
 *     </div>
 *   </div>
 * </ix-popover>
 */

let popoverCounter = 0;

export class IxPopover extends HTMLElement {
    private _instanceId = 0;

    private _trigger: HTMLElement | null = null;
    private _content: HTMLElement | null = null;

    private _onTriggerClick: ((e: MouseEvent) => void) | null = null;
    private _onTriggerKeydown: ((e: KeyboardEvent) => void) | null = null;
    private _onContentKeydown: ((e: KeyboardEvent) => void) | null = null;
    private _onDocPointer: ((e: Event) => void) | null = null;
    private _onFocusout: ((e: FocusEvent) => void) | null = null;
    private _onReposition: (() => void) | null = null;

    static get observedAttributes(): string[] {
        return ['open', 'placement'];
    }

    /**
     * Kontrollert modus: når `data-controlled` er satt, endrer ikke komponenten
     * egen åpen-tilstand. Den dispatcher kun `open-request` / `close-request`,
     * og foreldren må sette `open`-attributtet for å faktisk åpne/lukke.
     */
    private get _isControlled(): boolean {
        return this.hasAttribute('data-controlled');
    }

    connectedCallback(): void {
        this._instanceId = ++popoverCounter;
        this._wire();
    }

    disconnectedCallback(): void {
        if (this._trigger) {
            if (this._onTriggerClick) this._trigger.removeEventListener('click', this._onTriggerClick);
            if (this._onTriggerKeydown) this._trigger.removeEventListener('keydown', this._onTriggerKeydown);
        }
        if (this._content) {
            if (this._onContentKeydown) this._content.removeEventListener('keydown', this._onContentKeydown);
        }
        if (this._onDocPointer) {
            document.removeEventListener('pointerdown', this._onDocPointer, true);
        }
        if (this._onFocusout) {
            this.removeEventListener('focusout', this._onFocusout);
        }
        this._removeRepositionListeners();

        this._onTriggerClick = null;
        this._onTriggerKeydown = null;
        this._onContentKeydown = null;
        this._onDocPointer = null;
        this._onFocusout = null;
        this._onReposition = null;
        this._trigger = null;
        this._content = null;
    }

    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
        if (!this.isConnected) return;
        if (name === 'open') {
            const shouldBeOpen = newValue !== null && newValue !== 'false';
            if (shouldBeOpen && !this._isOpen) this._doOpen();
            else if (!shouldBeOpen && this._isOpen) this._doClose();
        } else if (name === 'placement' && this._isOpen) {
            this._position();
        }
    }

    get open(): boolean {
        const attr = this.getAttribute('open');
        return attr !== null && attr !== 'false';
    }

    set open(value: boolean) {
        this.toggleAttribute('open', value);
    }

    private get _isOpen(): boolean {
        return this.hasAttribute('data-open');
    }

    private get _placement(): string {
        return this.getAttribute('placement') ?? 'top';
    }

    private _wire(): void {
        this._content = this.querySelector<HTMLElement>(':scope > .ix-popover__content');

        this._trigger = Array.from(this.children).find(
            (child): child is HTMLElement =>
                child instanceof HTMLElement &&
                !child.classList.contains('ix-popover__content')
        ) ?? null;

        if (!this._trigger || !this._content) {
            if (import.meta.env.DEV) {
                console.warn('[ix-popover] Mangler trigger eller .ix-popover__content. Komponenten er ikke aktiv.');
            }
            return;
        }

        if (!this._content.id) this._content.id = `ix-popover-content-${this._instanceId}`;

        this._trigger.setAttribute('aria-haspopup', 'dialog');
        this._trigger.setAttribute('aria-expanded', 'false');
        this._trigger.setAttribute('aria-controls', this._content.id);

        this._content.hidden = true;
        this._content.setAttribute('role', 'dialog');

        this._onTriggerClick = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this._toggleOpen();
        };
        this._trigger.addEventListener('click', this._onTriggerClick);

        this._onTriggerKeydown = (e: KeyboardEvent) => this._handleTriggerKeydown(e);
        this._trigger.addEventListener('keydown', this._onTriggerKeydown);

        this._onContentKeydown = (e: KeyboardEvent) => this._handleContentKeydown(e);
        this._content.addEventListener('keydown', this._onContentKeydown);

        this._onDocPointer = (e: Event) => {
            if (!this._isOpen) return;
            const target = e.target as Node;
            if (!this.contains(target)) {
                this._close();
            }
        };
        document.addEventListener('pointerdown', this._onDocPointer, true);

        this._onFocusout = (e: FocusEvent) => {
            if (!this._isOpen) return;
            const relatedTarget = e.relatedTarget as Node | null;
            if (relatedTarget && this.contains(relatedTarget)) return;
            this._close();
        };
        this.addEventListener('focusout', this._onFocusout);

        if (this.open) this._doOpen();
    }

    private _handleTriggerKeydown(e: KeyboardEvent): void {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                this._toggleOpen();
                break;
            case 'ArrowDown':
                if (!this._isOpen) {
                    e.preventDefault();
                    this._open();
                }
                break;
        }
    }

    private _handleContentKeydown(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            this._close();
            this._trigger?.focus();
        }
    }

    private _open(): void {
        if (this._isOpen || !this._content || !this._trigger) return;

        if (this._isControlled) {
            this.dispatchEvent(new CustomEvent('open-request', { bubbles: true }));
            return;
        }

        this._doOpen();
    }

    private _doOpen(): void {
        if (this._isOpen || !this._content || !this._trigger) return;

        this.setAttribute('data-open', '');
        this.setAttribute('open', '');
        this._content.hidden = false;
        this._trigger.setAttribute('aria-expanded', 'true');

        this._position();
        this._addRepositionListeners();

        const firstFocusable = this._content.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
            firstFocusable.focus();
        }

        this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
    }

    private _close(): void {
        if (!this._isOpen || !this._content || !this._trigger) return;

        if (this._isControlled) {
            this.dispatchEvent(new CustomEvent('close-request', { bubbles: true }));
            return;
        }

        this._doClose();
    }

    private _doClose(): void {
        if (!this._isOpen || !this._content || !this._trigger) return;

        this.removeAttribute('data-open');
        this.removeAttribute('open');
        this._content.hidden = true;
        this._trigger.setAttribute('aria-expanded', 'false');

        this._removeRepositionListeners();

        this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    }

    private _toggleOpen(): void {
        if (this._isOpen) this._close();
        else this._open();
    }

    private _position(): void {
        if (!this._content || !this._trigger) return;

        const triggerRect = this._trigger.getBoundingClientRect();
        const contentRect = this._content.getBoundingClientRect();

        // Finn offset fra transformert ancestor (position: fixed blir relativ til den)
        const offsetParent = this._getFixedOffsetParent();
        const offsetRect = offsetParent?.getBoundingClientRect() ?? { top: 0, left: 0 };

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const gap = 8;
        const arrowSize = 8;

        let top: number;
        let left: number;
        let actualPlacement = this._placement;

        const spaceAbove = triggerRect.top;
        const spaceBelow = vh - triggerRect.bottom;
        const spaceLeft = triggerRect.left;
        const spaceRight = vw - triggerRect.right;

        if (actualPlacement === 'top' && spaceAbove < contentRect.height + gap + arrowSize) {
            if (spaceBelow >= contentRect.height + gap + arrowSize) {
                actualPlacement = 'bottom';
            }
        } else if (actualPlacement === 'bottom' && spaceBelow < contentRect.height + gap + arrowSize) {
            if (spaceAbove >= contentRect.height + gap + arrowSize) {
                actualPlacement = 'top';
            }
        } else if (actualPlacement === 'left' && spaceLeft < contentRect.width + gap + arrowSize) {
            if (spaceRight >= contentRect.width + gap + arrowSize) {
                actualPlacement = 'right';
            }
        } else if (actualPlacement === 'right' && spaceRight < contentRect.width + gap + arrowSize) {
            if (spaceLeft >= contentRect.width + gap + arrowSize) {
                actualPlacement = 'left';
            }
        }

        const triggerCenterX = triggerRect.left + triggerRect.width / 2;
        const triggerCenterY = triggerRect.top + triggerRect.height / 2;

        switch (actualPlacement) {
            case 'top':
                top = triggerRect.top - contentRect.height - gap - arrowSize;
                left = triggerCenterX - contentRect.width / 2;
                break;
            case 'bottom':
                top = triggerRect.bottom + gap + arrowSize;
                left = triggerCenterX - contentRect.width / 2;
                break;
            case 'left':
                top = triggerCenterY - contentRect.height / 2;
                left = triggerRect.left - contentRect.width - gap - arrowSize;
                break;
            case 'right':
                top = triggerCenterY - contentRect.height / 2;
                left = triggerRect.right + gap + arrowSize;
                break;
            default:
                top = triggerRect.top - contentRect.height - gap - arrowSize;
                left = triggerCenterX - contentRect.width / 2;
        }

        if (left + contentRect.width > vw - gap) {
            left = vw - contentRect.width - gap;
        }
        if (left < gap) {
            left = gap;
        }

        if (top + contentRect.height > vh - gap) {
            top = Math.max(gap, vh - contentRect.height - gap);
        }
        if (top < gap) {
            top = gap;
        }

        // Juster for transformert ancestor
        top -= offsetRect.top;
        left -= offsetRect.left;

        this._content.style.top = `${top}px`;
        this._content.style.left = `${left}px`;
        this._content.setAttribute('data-placement', actualPlacement);

        // Beregn pilposisjon relativt til content-boksen
        // triggerCenter må også justeres for offset siden left/top allerede er justert
        const adjustedTriggerCenterX = triggerCenterX - offsetRect.left;
        const adjustedTriggerCenterY = triggerCenterY - offsetRect.top;

        let arrowX: number;
        let arrowY: number;

        if (actualPlacement === 'top' || actualPlacement === 'bottom') {
            arrowX = adjustedTriggerCenterX - left;
            arrowX = Math.max(arrowSize + gap, Math.min(arrowX, contentRect.width - arrowSize - gap));
            this._content.style.setProperty('--_arrow-x', `${arrowX}px`);
            this._content.style.removeProperty('--_arrow-y');
        } else {
            arrowY = adjustedTriggerCenterY - top;
            arrowY = Math.max(arrowSize + gap, Math.min(arrowY, contentRect.height - arrowSize - gap));
            this._content.style.setProperty('--_arrow-y', `${arrowY}px`);
            this._content.style.removeProperty('--_arrow-x');
        }
    }

    /**
     * Finner nærmeste ancestor med transform, filter, eller will-change som
     * skaper en ny containing block for position: fixed.
     */
    private _getFixedOffsetParent(): Element | null {
        let el: Element | null = this._content?.parentElement ?? null;
        while (el && el !== document.documentElement) {
            const style = getComputedStyle(el);
            const transform = style.transform;
            const willChange = style.willChange;
            const filter = style.filter;

            if (
                (transform && transform !== 'none') ||
                (willChange && (willChange.includes('transform') || willChange.includes('filter'))) ||
                (filter && filter !== 'none')
            ) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    private _addRepositionListeners(): void {
        if (this._onReposition) return;
        this._onReposition = () => {
            if (this._isOpen) this._position();
        };
        window.addEventListener('scroll', this._onReposition, true);
        window.addEventListener('resize', this._onReposition);
    }

    private _removeRepositionListeners(): void {
        if (this._onReposition) {
            window.removeEventListener('scroll', this._onReposition, true);
            window.removeEventListener('resize', this._onReposition);
            this._onReposition = null;
        }
    }
}
