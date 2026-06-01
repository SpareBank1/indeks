/**
 * IxRadioGroup — ARIA-lim for radioknapp-grupper.
 *
 * ## Designfilosofi
 *
 * Komponenten erstatter ingen native HTML-elementer. Forfatteren skriver
 * native <input type="radio">, <label> og hjelpetekster inni <ix-radio-group>.
 * Komponenten sin eneste jobb er å sette opp ARIA-koblingene mellom dem.
 *
 * ## Hva komponenten gjør
 *
 * 1. Setter role="radiogroup" på host slik at skjermlesere annonserer gruppen
 *    med riktig rolle og leser legend-teksten som gruppens tilgjengelige navn.
 *
 * 2. Kobler legend via aria-labelledby — genererer ID på [data-field="legend"]
 *    om nødvendig og peker host til den.
 *
 * 3. Setter aria-describedby på host med IDer til description og error
 *    (description alltid først). Hopper over elementer som mangler.
 *
 * 4. Genererer stabile IDer på hvert input og setter htmlFor på matchende label
 *    om label ikke allerede har det. Respekterer alltid eksisterende IDer.
 *
 * 5. Synkroniserer name-attributt på alle inputs — name er mekanismen
 *    nettleseren bruker for mutual exclusivity (ett valg av gangen) og
 *    ArrowKey-navigasjon mellom alternativene. Alle inputs i gruppen må ha
 *    samme name. Hvis ingen input har name, genereres et stabilt gruppe-name.
 *    Hvis én har name, propageres den til de øvrige.
 *
 * 6. Setter aria-live="polite" på [data-field="error"] og observerer
 *    textContent-endringer: ikke-tomt innhold → aria-invalid="true" på host;
 *    tomt → aria-invalid fjernes. aria-invalid settes kun på host (ikke per
 *    input) — det er gruppens validitet som telles, og en duplisert flagg
 *    per input gir ingen merverdi for skjermlesere.
 *
 * 7. Propagerer disabled/readonly til alle inputs via attributeChangedCallback.
 *    Per-knapp disabled bevares — settes med en WeakMap ved første _wire().
 *
 * 8. Lytter på childList på host slik at nye <input type="radio">-elementer
 *    som legges til etter mount automatisk wires (id, name, htmlFor, disabled).
 *
 * ## Ingen Shadow DOM
 *
 * Komponenten bruker light DOM slik at CSS fra @sb1/indeks-css når alle
 * delelementer direkte.
 *
 * @example
 * <ix-radio-group>
 *   <span data-field="legend">Velg kundetype</span>
 *   <span data-field="description">Beskrivelse</span>
 *   <div class="ix-radio-button">
 *     <input type="radio" value="privat" />
 *     <label>Privat</label>
 *   </div>
 *   <div class="ix-radio-button">
 *     <input type="radio" value="bedrift" />
 *     <label>Bedrift</label>
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
    // Lagrer per-knapp disabled fra forfatter slik at group disable-toggle
    // ikke overstyrer den. Bruker WeakMap for å unngå memory leak ved DOM-fjerning.
    private _ownDisabled: WeakMap<HTMLInputElement, boolean> = new WeakMap();

    static get observedAttributes(): string[] {
        return ['disabled', 'readonly', 'required'];
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

    attributeChangedCallback(name: string, _oldValue: string | null, _newValue: string | null): void {
        if (!this.isConnected) return;
        if (name === 'disabled' || name === 'readonly') {
            this._syncHostStateToInputs();
        }
        if (name === 'required') {
            this._syncRequired();
        }
    }

    private _wire(): void {
        // ── 1. Rolle ──────────────────────────────────────────────────────────
        this.setAttribute('role', 'radiogroup');

        // Counter inkrementeres alltid så description/error-IDer ikke kolliderer
        // mellom instanser som mangler legend.
        this._instanceId = ++radioGroupCounter;

        // ── 2. Legend → aria-labelledby ───────────────────────────────────────
        const legend = this.querySelector<HTMLElement>('[data-field="legend"]');
        if (legend) {
            if (!legend.id) legend.id = `ix-radio-group-legend-${this._instanceId}`;
            this.setAttribute('aria-labelledby', legend.id);
        } else if (import.meta.env.DEV) {
            console.warn('[ix-radio-group] Mangler [data-field="legend"]. Legg til en synlig eller visuelt skjult legend-tekst — uten den får ikke gruppen et tilgjengelig navn.');
        }

        // ── 3. aria-describedby (description + error) ─────────────────────────
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

            // aria-live="polite" settes av komponenten — ikke av forfatteren.
            // "polite" venter til skjermleseren er ferdig med å lese, i motsetning
            // til role="alert" som impliserer "assertive" og avbryter brukeren.
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

        // ── 4. Wire inputs (id, name, htmlFor, disabled-snapshot) ─────────────
        this._wireInputs();

        // ── 5. required: aria-required på host + native required på første input ──
        this._syncRequired();

        // ── 6. ReadOnly: blokker tastatur-endringer ───────────────────────────
        // readOnly er en no-op på <input type="radio"> (HTML-spec), så vi må
        // selv blokkere ArrowKeys og Space når readonly er satt på host.
        // pointer-events: none i CSS dekker mus/touch.
        this._keydownListener = (e: KeyboardEvent) => {
            if (
                this.hasAttribute('readonly') &&
                ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)
            ) {
                e.preventDefault();
            }
        };
        this.addEventListener('keydown', this._keydownListener);

        // ── 7. Lytt på childList for dynamisk lagt til/fjernet inputs ─────────
        // Når forfatteren legger til en ny <input type="radio"> etter mount
        // (typisk i React conditional rendering), må den wires med samme
        // ID/name/htmlFor/disabled-logikk som ved mount.
        this._childObserver = new MutationObserver((mutations) => {
            const hasInputChange = mutations.some((m) =>
                Array.from(m.addedNodes).some((n) => this._containsRadioInput(n)) ||
                Array.from(m.removedNodes).some((n) => this._containsRadioInput(n))
            );
            if (hasInputChange) {
                this._wireInputs();
                this._syncRequired();
            }
        });
        this._childObserver.observe(this, { childList: true, subtree: true });
    }

    private _containsRadioInput(node: Node): boolean {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        const el = node as Element;
        if (el.matches?.('input[type="radio"]')) return true;
        return !!el.querySelector?.('input[type="radio"]');
    }

    // Wirer alle inputs i gruppen — idempotent, kan kjøres igjen ved DOM-endring.
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

            // Finn label som er søsken til input (inni samme .ix-radio-button-wrapper)
            // eller som er et direkte barn av wrapperen og ikke har htmlFor ennå.
            const wrapper = input.closest('.ix-radio-button') ?? input.parentElement;
            if (wrapper) {
                const label = wrapper.querySelector<HTMLLabelElement>('label');
                if (label && !label.htmlFor) label.htmlFor = input.id;
            }
        }

        // name-synkronisering
        const existingName = inputs.find((i) => i.name)?.name;
        const groupName = existingName ?? `ix-radio-group-name-${this._instanceId}`;
        for (const input of inputs) {
            if (!input.name) input.name = groupName;
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

        // readOnly settes ikke på input — det er en no-op for radio. Tastatur-
        // blokkeringen håndteres av keydown-listener i _wire(), pointer-events: none
        // i CSS dekker mus/touch.
        //
        // Per-knapp disabled bevares: snapshot tas KUN når vi er i ferd med å
        // overskrive den (host disabled toggles på), og restoreres når host
        // disabled toggles av. Hvis vi aldri har snapshot-et en input, lar vi
        // dens disabled være i fred — det er authorens valg.
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

    // Setter aria-required på host slik at skjermleser annonserer påkrevd-tilstand
    // på gruppenivå (ikke per radio). Setter native required på første input slik at
    // HTML5-form-validering virker uten at Safari viser valideringsbobel på hvert
    // alternativ.
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
