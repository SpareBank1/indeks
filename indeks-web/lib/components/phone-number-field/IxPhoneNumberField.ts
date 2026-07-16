/**
 * IxPhoneNumberField — ARIA-lim for telefonnummer med landvelger.
 *
 * ## Designfilosofi
 *
 * Komponenten er en sammensatt gruppe: den binder sammen en eksisterende
 * <ix-combobox> (landkode) og et <ix-field>-tekstfelt (nummer) under én felles
 * label og én felles valideringsmelding. Den erstatter ingen native elementer
 * og reimplementerer verken combobox- eller formaterings-oppførsel — <ix-combobox>
 * og <ix-field> gjør fortsatt sin egen interne ARIA-kabling. Denne komponentens
 * eneste jobb er gruppe-semantikken rundt de to feltene.
 *
 * Speiler <ix-checkbox-group>/<ix-radio-group>-mønsteret, med disse forskjellene:
 * de to «kontrollene» er en <ix-combobox> og et nummer-<input> (ikke en liste av
 * like radio/checkbox), og disabled/readonly propageres til begge disse.
 *
 * ## Hva komponenten gjør
 *
 * 1. Setter role="group" på host slik at skjermlesere annonserer gruppen og
 *    leser legend-teksten som gruppens tilgjengelige navn. (Det finnes ingen
 *    egen rolle for et sammensatt felt — "group" er korrekt.)
 *
 * 2. Kobler legend via aria-labelledby — genererer ID på [data-field="legend"]
 *    om nødvendig og peker host til den.
 *
 * 3. Setter aria-describedby på host med IDer til description og error
 *    (description alltid først). Hopper over elementer som mangler.
 *
 * 4. Setter aria-live="polite" på [data-field="error"] og observerer
 *    textContent-endringer: ikke-tomt innhold → aria-invalid="true" på host;
 *    tomt → aria-invalid fjernes. aria-invalid settes kun på host — det er
 *    gruppens validitet som telles.
 *
 * 5. Propagerer disabled/readonly til begge kontrollene: attributt på
 *    <ix-combobox> og .disabled/.readOnly på nummer-<input>. Egne (per-kontroll)
 *    verdier bevares via en WeakMap slik at group-toggle ikke overstyrer dem.
 *
 * 6. Lytter på childList slik at kontroller som React rendrer inn etter mount
 *    (conditional rendering) fanges opp og re-wires.
 *
 * ## Ingen Shadow DOM
 *
 * Komponenten bruker light DOM slik at CSS fra @sb1/indeks-css når alle
 * delelementer direkte, og aria-koblingene (aria-labelledby/-describedby) ikke
 * krysser en shadow-grense.
 *
 * @example
 * <ix-phone-number-field>
 *   <span data-field="legend">Mobilnummer</span>
 *   <span data-field="description">Vi bruker det kun til SMS-varsling</span>
 *   <div data-field="items">
 *     <ix-combobox data-field="country" data-no-hits-text="Ingen treff"> … </ix-combobox>
 *     <ix-field data-field="number">
 *       <div class="ix-text-field">
 *         <input type="tel" inputmode="numeric" autocomplete="tel-national"
 *                data-format="phone" aria-label="Telefonnummer" />
 *       </div>
 *     </ix-field>
 *   </div>
 *   <span data-field="error"></span>
 * </ix-phone-number-field>
 */

let phoneNumberFieldCounter = 0;

export class IxPhoneNumberField extends HTMLElement {
    private _errorObserver: MutationObserver | null = null;
    private _childObserver: MutationObserver | null = null;
    private _instanceId = 0;
    // Bevarer per-kontroll disabled/readonly fra forfatter slik at group-toggle
    // ikke overstyrer den. WeakMap for å unngå memory leak ved DOM-fjerning.
    private _ownDisabled: WeakMap<Element, boolean> = new WeakMap();
    private _ownReadonly: WeakMap<Element, boolean> = new WeakMap();

    static get observedAttributes(): string[] {
        return ['disabled', 'readonly'];
    }

    connectedCallback(): void {
        this._wire();
    }

    disconnectedCallback(): void {
        this._errorObserver?.disconnect();
        this._errorObserver = null;

        this._childObserver?.disconnect();
        this._childObserver = null;
    }

    attributeChangedCallback(attr: string, _oldValue: string | null, _newValue: string | null): void {
        if (!this.isConnected) return;
        if (attr === 'disabled' || attr === 'readonly') {
            this._syncHostStateToControls();
        }
    }

    private _wire(): void {
        // ── 1. Rolle ──────────────────────────────────────────────────────────
        this.setAttribute('role', 'group');

        // Counter inkrementeres alltid så description/error-IDer ikke kolliderer
        // mellom instanser som mangler legend.
        this._instanceId = ++phoneNumberFieldCounter;

        // Gruppe-nivå felt (legend/description/error) hentes med `:scope >` slik
        // at vi treffer VÅRE direkte barn — ikke [data-field]-spennene som de
        // indre <ix-field>-ene (combobox + tekstfelt) selv legger i DOM.
        // ── 2. Legend → aria-labelledby ───────────────────────────────────────
        const legend = this.querySelector<HTMLElement>(':scope > [data-field="legend"]');
        if (legend) {
            if (!legend.id) legend.id = `ix-phone-number-field-legend-${this._instanceId}`;
            this.setAttribute('aria-labelledby', legend.id);
        } else if (import.meta.env.DEV) {
            console.warn('[ix-phone-number-field] Mangler [data-field="legend"]. Legg til en synlig eller visuelt skjult legend-tekst — uten den får ikke gruppen et tilgjengelig navn.');
        }

        // ── 3. aria-describedby (description + error) ─────────────────────────
        this._wireDescribedBy();

        // ── 4. Propager disabled/readonly til kontrollene ─────────────────────
        this._syncHostStateToControls();

        // ── 5. Lytt på childList for felt/kontroller lagt til etter mount ─────
        // React kan rendre <ix-combobox>/<ix-field> ELLER [data-field]-spennene
        // (f.eks. betinget description) inn etter connectedCallback. Da må vi kjøre
        // disabled/readonly-propageringen på nytt for nye kontroller, OG re-koble
        // aria-describedby om description/error dukket opp eller forsvant.
        this._childObserver = new MutationObserver((mutations) => {
            const hasControlChange = mutations.some((m) =>
                Array.from(m.addedNodes).some((n) => this._containsControl(n)) ||
                Array.from(m.removedNodes).some((n) => this._containsControl(n))
            );
            if (hasControlChange) {
                this._syncHostStateToControls();
            }

            const hasGroupFieldChange = mutations.some((m) =>
                Array.from(m.addedNodes).some((n) => this._containsGroupField(n)) ||
                Array.from(m.removedNodes).some((n) => this._containsGroupField(n))
            );
            if (hasGroupFieldChange) {
                this._wireDescribedBy();
            }
        });
        this._childObserver.observe(this, { childList: true, subtree: true });
    }

    // Kobler description + error til host via aria-describedby (description først).
    // Idempotent: trygg å kalle på nytt når betingede felt dukker opp/forsvinner
    // etter mount. Kobler fra en evt. tidligere error-observer først, så vi ikke
    // dobbelt-observerer.
    private _wireDescribedBy(): void {
        const description = this.querySelector<HTMLElement>(':scope > [data-field="description"]');
        const error = this.querySelector<HTMLElement>(':scope > [data-field="error"]');
        const describedBy: string[] = [];

        if (description) {
            if (!description.id) description.id = `ix-phone-number-field-desc-${this._instanceId}`;
            describedBy.push(description.id);
        }

        // Gammel observer kobles alltid fra — enten fordi error forsvant, eller
        // fordi vi er i ferd med å (re)koble den til gjeldende error-element.
        this._errorObserver?.disconnect();
        this._errorObserver = null;

        if (error) {
            if (!error.id) error.id = `ix-phone-number-field-error-${this._instanceId}`;
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
        } else {
            // Ingen error lenger → gruppa kan ikke være ugyldig.
            this.removeAttribute('aria-invalid');
        }

        if (describedBy.length > 0) {
            this.setAttribute('aria-describedby', describedBy.join(' '));
        } else {
            this.removeAttribute('aria-describedby');
        }
    }

    private _containsControl(node: Node): boolean {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        const el = node as Element;
        if (el.matches?.('ix-combobox, input')) return true;
        return !!el.querySelector?.('ix-combobox, input');
    }

    // Sant hvis noden er (eller inneholder) et gruppe-nivå felt som påvirker
    // aria-describedby: description eller error. Holdes adskilt fra
    // _containsControl slik at kontroll-propagering og describedby-rewiring
    // trigges av hver sin type endring.
    private _containsGroupField(node: Node): boolean {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        const el = node as Element;
        const selector = '[data-field="description"], [data-field="error"]';
        if (el.matches?.(selector)) return true;
        return !!el.querySelector?.(selector);
    }

    // Finner de to kontrollene: landvelger (<ix-combobox>) og nummer-<input>.
    private _combobox(): Element | null {
        return this.querySelector('ix-combobox');
    }

    private _numberInput(): HTMLInputElement | null {
        // Nummer-inputen ligger i [data-field="number"]-feltet; fall tilbake til
        // en input som IKKE er inni comboboxen om data-field mangler.
        const numberField = this.querySelector('[data-field="number"]');
        if (numberField) return numberField.querySelector<HTMLInputElement>('input');
        const combobox = this._combobox();
        return Array.from(this.querySelectorAll<HTMLInputElement>('input')).find(
            (input) => !combobox?.contains(input)
        ) ?? null;
    }

    private _syncInvalid(error: HTMLElement): void {
        const hasError = !!error.textContent?.trim();
        if (hasError) {
            this.setAttribute('aria-invalid', 'true');
        } else {
            this.removeAttribute('aria-invalid');
        }
    }

    private _syncHostStateToControls(): void {
        const isDisabled = this.hasAttribute('disabled');
        const isReadonly = this.hasAttribute('readonly');

        const combobox = this._combobox();
        if (combobox) this._applyState(combobox, isDisabled, isReadonly, 'attribute');

        const input = this._numberInput();
        if (input) this._applyState(input, isDisabled, isReadonly, 'property');
    }

    // Setter/gjenoppretter disabled+readonly på én kontroll. `mode` skiller
    // <ix-combobox> (leser attributter) fra <input> (bruker DOM-properties).
    // Per-kontroll-verdien snapshottes KUN når vi er i ferd med å overstyre den,
    // og gjenopprettes når group-toggelen slås av — forfatterens egen verdi
    // bevares dermed.
    private _applyState(control: Element, isDisabled: boolean, isReadonly: boolean, mode: 'attribute' | 'property'): void {
        this._applyFlag(control, 'disabled', isDisabled, this._ownDisabled, mode);
        this._applyFlag(control, 'readonly', isReadonly, this._ownReadonly, mode);
    }

    private _applyFlag(
        control: Element,
        flag: 'disabled' | 'readonly',
        groupOn: boolean,
        ownStore: WeakMap<Element, boolean>,
        mode: 'attribute' | 'property'
    ): void {
        const read = (): boolean =>
            mode === 'attribute'
                ? control.hasAttribute(flag)
                : flag === 'disabled'
                  ? (control as HTMLInputElement).disabled
                  : (control as HTMLInputElement).readOnly;
        const write = (value: boolean): void => {
            if (mode === 'attribute') {
                if (value) control.setAttribute(flag, '');
                else control.removeAttribute(flag);
            } else if (flag === 'disabled') {
                (control as HTMLInputElement).disabled = value;
            } else {
                (control as HTMLInputElement).readOnly = value;
            }
        };

        if (groupOn) {
            if (!ownStore.has(control)) ownStore.set(control, read());
            write(true);
        } else if (ownStore.has(control)) {
            write(ownStore.get(control)!);
            ownStore.delete(control);
        }
    }
}
