/**
 * IxRadioGroup kobler ARIA mellom native radioknapper, legend og hjelpetekster.
 * Forfatteren skriver markupen selv.
 *
 * - role="radiogroup" og aria-labelledby til [data-field="legend"]
 * - aria-describedby til [data-field="description"] og [data-field="error"]
 * - id på hver input og for på labelen i samme forelder, når de mangler
 * - samme name på alle inputs: name på host, ellers name fra en input, ellers generert
 * - aria-invalid="true" på host (ikke per input) når error-feltet har tekst
 * - disabled, readonly og required på host gjelder hele gruppen
 * - inputs som legges til etter mount, kobles på samme måte
 *
 * @example
 * <ix-radio-group>
 *   <span data-field="legend">Velg kundetype</span>
 *   <span data-field="description">Beskrivelse</span>
 *   <div data-field="items">
 *     <div>
 *       <input type="radio" value="privat" />
 *       <label>Privat</label>
 *     </div>
 *     <div>
 *       <input type="radio" value="bedrift" />
 *       <label>Bedrift</label>
 *     </div>
 *   </div>
 *   <span data-field="error"></span>
 * </ix-radio-group>
 */

let radioGroupCounter = 0;
let radioInputCounter = 0;

export class IxRadioGroup extends HTMLElement {
    private _errorObserver: MutationObserver | null = null;
    private _childObserver: MutationObserver | null = null;
    private _keydownListener: ((e: KeyboardEvent) => void) | null = null;
    private _instanceId = 0;
    // Forfatterens disabled per input, så den står igjen når host-disabled fjernes.
    private _ownDisabled: WeakMap<HTMLInputElement, boolean> = new WeakMap();

    static get observedAttributes(): string[] {
        return ['disabled', 'readonly', 'required', 'name'];
    }

    connectedCallback(): void {
        this._wire();
    }

    disconnectedCallback(): void {
        this._errorObserver?.disconnect();
        this._errorObserver = null;

        this._childObserver?.disconnect();
        this._childObserver = null;

        if (this._keydownListener) {
            this.removeEventListener('keydown', this._keydownListener);
        }
        this._keydownListener = null;
    }

    attributeChangedCallback(attr: string, _oldValue: string | null, _newValue: string | null): void {
        if (!this.isConnected) return;
        if (attr === 'disabled' || attr === 'readonly') {
            this._syncHostStateToInputs();
        }
        if (attr === 'required') {
            this._syncRequired();
        }
        if (attr === 'name') {
            this._wireInputs();
        }
    }

    private _wire(): void {
        this.setAttribute('role', 'radiogroup');

        // Økes alltid, så description- og error-id-er ikke kolliderer når legend mangler.
        this._instanceId = ++radioGroupCounter;

        const legend = this.querySelector<HTMLElement>('[data-field="legend"]');
        if (legend) {
            if (!legend.id) legend.id = `ix-radio-group-legend-${this._instanceId}`;
            this.setAttribute('aria-labelledby', legend.id);
        } else if (import.meta.env.DEV) {
            console.warn('[ix-radio-group] Mangler [data-field="legend"]. Legg til en synlig eller visuelt skjult legend-tekst — uten den får ikke gruppen et tilgjengelig navn.');
        }

        const description = this.querySelector<HTMLElement>('[data-field="description"]');
        const error = this.querySelector<HTMLElement>('[data-field="error"]');
        const describedBy: string[] = [];

        if (description) {
            if (!description.id) description.id = `ix-radio-group-desc-${this._instanceId}`;
            describedBy.push(description.id);
        }
        if (error) {
            if (!error.id) error.id = `ix-radio-group-error-${this._instanceId}`;
            describedBy.push(error.id);

            // polite, ikke role="alert", så feilen ikke avbryter skjermleseren.
            error.setAttribute('aria-live', 'polite');

            this._errorObserver = new MutationObserver(() => {
                this._syncInvalid(error);
            });
            this._errorObserver.observe(error, {
                childList: true,
                characterData: true,
                subtree: true,
            });

            this._syncInvalid(error);
        }

        if (describedBy.length > 0) {
            this.setAttribute('aria-describedby', describedBy.join(' '));
        }

        this._wireInputs();

        this._syncRequired();

        // readOnly virker ikke på radio, så piltastene og mellomrom blokkeres her.
        this._keydownListener = (e: KeyboardEvent) => {
            if (
                this.hasAttribute('readonly') &&
                ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)
            ) {
                e.preventDefault();
            }
        };
        this.addEventListener('keydown', this._keydownListener);

        // Observerer også name, fordi React kan fjerne det ved re-render.
        this._childObserver = new MutationObserver((mutations) => {
            const hasInputChange = mutations.some((m) =>
                Array.from(m.addedNodes).some((n) => this._containsRadioInput(n)) ||
                Array.from(m.removedNodes).some((n) => this._containsRadioInput(n))
            );
            const hasNameRemoval = mutations.some(
                (m) =>
                    m.type === 'attributes' &&
                    m.attributeName === 'name' &&
                    m.target instanceof HTMLInputElement &&
                    m.target.type === 'radio' &&
                    !m.target.name
            );
            if (hasInputChange || hasNameRemoval) {
                this._wireInputs();
                this._syncRequired();
            }
        });
        this._childObserver.observe(this, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['name'],
        });
    }

    private _containsRadioInput(node: Node): boolean {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        const el = node as Element;
        if (el.matches?.('input[type="radio"]')) return true;
        return !!el.querySelector?.('input[type="radio"]');
    }

    // Idempotent, fordi den kjøres på nytt ved hver DOM-endring.
    private _wireInputs(): void {
        const inputs = Array.from(this.querySelectorAll<HTMLInputElement>('input[type="radio"]'));

        if (inputs.length === 0) {
            if (import.meta.env.DEV) {
                console.warn('[ix-radio-group] Fant ingen <input type="radio">. Gruppen er ikke aktiv.');
            }
            return;
        }

        for (const input of inputs) {
            if (!input.id) input.id = `ix-radio-${++radioInputCounter}`;

            const wrapper = input.parentElement;
            if (wrapper) {
                const label = wrapper.querySelector<HTMLLabelElement>('label');
                if (label && !label.htmlFor) label.htmlFor = input.id;
            }
        }

        // Host-name vinner over name på en input, så hele gruppen får samme name.
        const hostName = this.getAttribute('name');
        const existingName = inputs.find((i) => i.name)?.name;
        const groupName = hostName || existingName || `ix-radio-group-name-${this._instanceId}`;
        for (const input of inputs) {
            if (hostName || !input.name) input.name = groupName;
        }

        this._syncHostStateToInputs();
    }

    private _syncInvalid(error: HTMLElement): void {
        const hasError = !!error.textContent?.trim();
        if (hasError) {
            this.setAttribute('aria-invalid', 'true');
        } else {
            this.removeAttribute('aria-invalid');
        }
    }

    private _syncHostStateToInputs(): void {
        const inputs = Array.from(this.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        const isDisabled = this.hasAttribute('disabled');

        // Inputs som aldri er overstyrt av host-disabled, lar vi være i fred.
        for (const input of inputs) {
            if (isDisabled) {
                if (!this._ownDisabled.has(input)) {
                    this._ownDisabled.set(input, input.disabled);
                }
                input.disabled = true;
            } else if (this._ownDisabled.has(input)) {
                input.disabled = this._ownDisabled.get(input)!;
                this._ownDisabled.delete(input);
            }
        }
    }

    // Native required bare på første input, så Safari ikke viser valideringsboble
    // på hvert alternativ.
    private _syncRequired(): void {
        const inputs = Array.from(this.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        const isRequired = this.hasAttribute('required');

        if (isRequired) {
            this.setAttribute('aria-required', 'true');
            if (inputs[0]) inputs[0].required = true;
            for (const input of inputs.slice(1)) input.required = false;
        } else {
            this.removeAttribute('aria-required');
            for (const input of inputs) input.required = false;
        }
    }
}
