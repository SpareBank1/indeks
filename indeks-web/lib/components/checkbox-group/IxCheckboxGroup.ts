/**
 * IxCheckboxGroup — ARIA-lim for checkbox-grupper.
 *
 * ## Designfilosofi
 *
 * Komponenten erstatter ingen native HTML-elementer. Forfatteren skriver
 * native <input type="checkbox">, <label> og hjelpetekster inni
 * <ix-checkbox-group>. Komponenten sin eneste jobb er å sette opp
 * ARIA-koblingene mellom dem. Speiler <ix-radio-group>, med tre bevisste
 * forskjeller (se under).
 *
 * ## Hva komponenten gjør
 *
 * 1. Setter role="group" på host slik at skjermlesere annonserer gruppen og
 *    leser legend-teksten som gruppens tilgjengelige navn. (Det finnes ingen
 *    "checkboxgroup"-rolle i ARIA — "group" er korrekt for en checkbox-gruppe.)
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
 * 5. Setter aria-live="polite" på [data-field="error"] og observerer
 *    textContent-endringer: ikke-tomt innhold → aria-invalid="true" på host;
 *    tomt → aria-invalid fjernes. aria-invalid settes kun på host.
 *
 * 6. Propagerer disabled/readonly til alle inputs via attributeChangedCallback.
 *    Per-knapp disabled bevares — settes med en WeakMap ved første _wire().
 *
 * 7. Lytter på childList på host slik at nye <input type="checkbox">-elementer
 *    som legges til etter mount automatisk wires (id, name, htmlFor, disabled).
 *
 * ## Forskjeller fra <ix-radio-group>
 *
 * - **role="group"**, ikke "radiogroup".
 * - **Ingen name-mutex.** Checkbox deler ikke `name` for gjensidig utelukkelse.
 *   Host-`name` propageres til alle inputs (for form-innsending under felles
 *   navn), men når host ikke har name lar vi forfatterens egne name/value stå
 *   — vi auto-genererer ikke et felles name.
 * - **Ingen required-triks.** For radio settes `required` kun på første input
 *   (Safari-boble-fiks for mutex-gruppen). For checkbox betyr `required` "denne
 *   må krysses", så vi rører ikke required automatisk på gruppenivå.
 * - **Tastatur:** checkbox har ingen pil-navigasjon; readonly blokkerer kun
 *   Space (toggle) — ikke piltaster.
 *
 * ## Ingen Shadow DOM
 *
 * Komponenten bruker light DOM slik at CSS fra @sb1/indeks-css når alle
 * delelementer direkte.
 *
 * @example
 * <ix-checkbox-group>
 *   <span data-field="legend">Hvordan vil du bli kontaktet?</span>
 *   <span data-field="description">Velg én eller flere</span>
 *   <div data-field="items">
 *     <div class="ix-checkbox">
 *       <input type="checkbox" value="epost" />
 *       <label>E-post</label>
 *     </div>
 *   </div>
 *   <span data-field="error"></span>
 * </ix-checkbox-group>
 */

let checkboxGroupCounter = 0;
let checkboxInputCounter = 0;

export class IxCheckboxGroup extends HTMLElement {
    private _errorObserver: MutationObserver | null = null;
    private _childObserver: MutationObserver | null = null;
    private _keydownListener: ((e: KeyboardEvent) => void) | null = null;
    private _instanceId = 0;
    // Lagrer per-knapp disabled fra forfatter slik at group disable-toggle
    // ikke overstyrer den. Bruker WeakMap for å unngå memory leak ved DOM-fjerning.
    private _ownDisabled: WeakMap<HTMLInputElement, boolean> = new WeakMap();

    static get observedAttributes(): string[] {
        return ['disabled', 'readonly', 'name'];
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
        if (attr === 'name') {
            this._wireInputs();
        }
    }

    private _wire(): void {
        // ── 1. Rolle ──────────────────────────────────────────────────────────
        this.setAttribute('role', 'group');

        // Counter inkrementeres alltid så description/error-IDer ikke kolliderer
        // mellom instanser som mangler legend.
        this._instanceId = ++checkboxGroupCounter;

        // ── 2. Legend → aria-labelledby ───────────────────────────────────────
        const legend = this.querySelector<HTMLElement>('[data-field="legend"]');
        if (legend) {
            if (!legend.id) legend.id = `ix-checkbox-group-legend-${this._instanceId}`;
            this.setAttribute('aria-labelledby', legend.id);
        } else if (import.meta.env.DEV) {
            console.warn('[ix-checkbox-group] Mangler [data-field="legend"]. Legg til en synlig eller visuelt skjult legend-tekst — uten den får ikke gruppen et tilgjengelig navn.');
        }

        // ── 3. aria-describedby (description + error) ─────────────────────────
        const description = this.querySelector<HTMLElement>('[data-field="description"]');
        const error = this.querySelector<HTMLElement>('[data-field="error"]');
        const describedBy: string[] = [];

        if (description) {
            if (!description.id) description.id = `ix-checkbox-group-desc-${this._instanceId}`;
            describedBy.push(description.id);
        }
        if (error) {
            if (!error.id) error.id = `ix-checkbox-group-error-${this._instanceId}`;
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

        // ── 5. ReadOnly: blokker tastatur-endringer ───────────────────────────
        // readOnly er en no-op på <input type="checkbox"> (HTML-spec), så vi må
        // selv blokkere Space når readonly er satt på host. Checkbox har ingen
        // pil-navigasjon å blokkere. pointer-events: none i CSS dekker mus/touch.
        this._keydownListener = (e: KeyboardEvent) => {
            if (this.hasAttribute('readonly') && e.key === ' ') {
                e.preventDefault();
            }
        };
        this.addEventListener('keydown', this._keydownListener);

        // ── 6. Lytt på childList for dynamisk lagt til/fjernet inputs ─────────
        // Når forfatteren legger til en ny <input type="checkbox"> etter mount
        // (typisk i React conditional rendering), må den wires med samme
        // ID/name/htmlFor/disabled-logikk som ved mount.
        //
        // Observerer også attributter på subtree: React kan fjerne name-attributt
        // ved re-render (f.eks. name={undefined}), så vi må resette name når
        // det skjer.
        this._childObserver = new MutationObserver((mutations) => {
            const hasInputChange = mutations.some((m) =>
                Array.from(m.addedNodes).some((n) => this._containsCheckboxInput(n)) ||
                Array.from(m.removedNodes).some((n) => this._containsCheckboxInput(n))
            );
            const hasNameRemoval = mutations.some(
                (m) =>
                    m.type === 'attributes' &&
                    m.attributeName === 'name' &&
                    m.target instanceof HTMLInputElement &&
                    m.target.type === 'checkbox' &&
                    !m.target.name
            );
            if (hasInputChange || hasNameRemoval) {
                this._wireInputs();
            }
        });
        this._childObserver.observe(this, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['name'],
        });
    }

    private _containsCheckboxInput(node: Node): boolean {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        const el = node as Element;
        if (el.matches?.('input[type="checkbox"]')) return true;
        return !!el.querySelector?.('input[type="checkbox"]');
    }

    // Wirer alle inputs i gruppen — idempotent, kan kjøres igjen ved DOM-endring.
    private _wireInputs(): void {
        const inputs = Array.from(this.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));

        if (inputs.length === 0) {
            if (import.meta.env.DEV) {
                console.warn('[ix-checkbox-group] Fant ingen <input type="checkbox">. Gruppen er ikke aktiv.');
            }
            return;
        }

        for (const input of inputs) {
            if (!input.id) input.id = `ix-checkbox-${++checkboxInputCounter}`;

            // Checkbox-markupen er <div class="ix-checkbox"><input><label></label></div>
            // — label er søsken til input. Koble eksplisitt med htmlFor så klikk på
            // label togglar riktig input.
            const wrapper = input.closest('.ix-checkbox') ?? input.parentElement;
            if (wrapper) {
                const label = wrapper.querySelector<HTMLLabelElement>('label, .ix-checkbox__label');
                if (label instanceof HTMLLabelElement && !label.htmlFor) {
                    label.htmlFor = input.id;
                }
            }
        }

        // name-propagering: host name → alle inputs. Ingen mutex-auto-generering
        // — uten host-name lar vi forfatterens egne name/value stå (checkbox
        // trenger ikke felles name for å fungere).
        const hostName = this.getAttribute('name');
        if (hostName) {
            for (const input of inputs) input.name = hostName;
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
        const inputs = Array.from(this.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
        const isDisabled = this.hasAttribute('disabled');

        // readOnly settes ikke på input — det er en no-op for checkbox. Tastatur-
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
}
