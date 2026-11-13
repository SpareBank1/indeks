/**
 * IxPhoneNumberField — telefonnummer med landkode.
 *
 * Komponenten er en sammensatt gruppe: den binder sammen to <ix-field>-tekstfelt
 * (landkode og nummer) under én felles label og én felles valideringsmelding.
 * Formatering og ARIA per felt eies fortsatt av <ix-field>.
 *
 * Landkoden er et vanlig tekstfelt med «+» som prefix, ikke en landvelger.
 * Utvikleren kan låse den (readonly på inputen) eller utelate feltet helt.
 *
 * Speiler <ix-checkbox-group>/<ix-radio-group>: role="group" på host, én
 * feilmelding for gruppen og aria-invalid på host.
 *
 * ## Hva komponenten gjør
 *
 * 1. role="group" og aria-labelledby til [data-field="legend"].
 * 2. aria-describedby på host til description og error (description først).
 * 3. aria-live="polite" på [data-field="error"]; ikke-tom tekst gir
 *    aria-invalid="true" på host og data-state="error" for CSS.
 * 4. Propagerer disabled/readonly/required til begge inputene. Egne verdier per
 *    input (f.eks. en låst landkode) bevares når gruppen slår av igjen.
 * 5. Stamper standardattributter når de mangler: landkoden får
 *    inputmode=numeric og autocomplete=tel-country-code, nummeret type=tel,
 *    inputmode=numeric, autocomplete=tel-national og data-format=phone.
 * 6. Landkoden tar bare sifre, maks tre. Autofyll gir «+47», så plusstegnet og
 *    andre tegn fjernes. Ikke maxlength: det ville kuttet «+358» til «+35», og
 *    <ix-field> ville vist en tegnteller.
 * 7. Lytter på childList, så felt React rendrer inn etter mount fanges opp.
 *
 * Ingen Shadow DOM, så CSS fra @sb1/indeks-css når delene og ARIA-koblingene
 * ikke krysser en shadow-grense.
 *
 * @example
 * <ix-phone-number-field>
 *   <span data-field="legend">Mobilnummer</span>
 *   <span data-field="description">Vi bruker det kun til SMS-varsling</span>
 *   <div data-field="items">
 *     <ix-field data-field="country">
 *       <div class="ix-text-field">
 *         <div data-field="prefix">+</div>
 *         <input aria-label="Landkode" value="47" />
 *       </div>
 *     </ix-field>
 *     <ix-field data-field="number">
 *       <div class="ix-text-field">
 *         <input aria-label="Telefonnummer" />
 *       </div>
 *     </ix-field>
 *   </div>
 *   <span data-field="error"></span>
 * </ix-phone-number-field>
 */

const COUNTRY_CODE_MAX_DIGITS = 3;

let phoneNumberFieldCounter = 0;

export class IxPhoneNumberField extends HTMLElement {
    private _errorObserver: MutationObserver | null = null;
    private _childObserver: MutationObserver | null = null;
    private _onInput: ((e: Event) => void) | null = null;
    private _instanceId = 0;
    // WeakMap, så fjernede inputer ikke holdes i minnet.
    private _ownDisabled: WeakMap<Element, boolean> = new WeakMap();
    private _ownReadonly: WeakMap<Element, boolean> = new WeakMap();
    private _ownRequired: WeakMap<Element, boolean> = new WeakMap();

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
        if (this._onInput) this.removeEventListener('input', this._onInput);
        this._onInput = null;
    }

    attributeChangedCallback(attr: string): void {
        if (!this.isConnected) return;
        if (attr === 'required') this._syncRequired();
        else this._syncHostStateToControls();
    }

    private _wire(): void {
        this.setAttribute('role', 'group');

        // Telles alltid opp, så ID-er ikke kolliderer mellom instanser uten legend.
        this._instanceId = ++phoneNumberFieldCounter;

        // `:scope >` treffer gruppens egne felt, ikke [data-field]-elementene
        // som de indre <ix-field>-ene legger inn.
        const legend = this.querySelector<HTMLElement>(':scope > [data-field="legend"]');
        if (legend) {
            if (!legend.id) legend.id = `ix-phone-number-field-legend-${this._instanceId}`;
            this.setAttribute('aria-labelledby', legend.id);
        } else if (import.meta.env.DEV) {
            console.warn('[ix-phone-number-field] Mangler [data-field="legend"]. Legg til en synlig eller visuelt skjult legend-tekst — uten den får ikke gruppen et tilgjengelig navn.');
        }

        this._wireDescribedBy();
        this._stampDefaults();
        this._syncHostStateToControls();
        this._syncRequired();

        // Delegert på host, så lytteren overlever at React bytter ut inputen.
        this._onInput = (e: Event) => {
            if (e.target === this._countryInput()) this._sanitizeCountryCode(e.target as HTMLInputElement);
        };
        this.addEventListener('input', this._onInput);

        this._childObserver = new MutationObserver((mutations) => {
            const changed = (selector: string) =>
                mutations.some((m) => [...m.addedNodes, ...m.removedNodes].some((n) => this._contains(n, selector)));

            if (changed('input')) {
                this._stampDefaults();
                this._syncHostStateToControls();
                this._syncRequired();
            }
            if (changed('[data-field="description"], [data-field="error"]')) {
                this._wireDescribedBy();
            }
        });
        this._childObserver.observe(this, { childList: true, subtree: true });
    }

    // Idempotent: kalles på nytt når description eller error dukker opp eller
    // forsvinner etter mount.
    private _wireDescribedBy(): void {
        const description = this.querySelector<HTMLElement>(':scope > [data-field="description"]');
        const error = this.querySelector<HTMLElement>(':scope > [data-field="error"]');
        const describedBy: string[] = [];

        if (description) {
            if (!description.id) description.id = `ix-phone-number-field-desc-${this._instanceId}`;
            describedBy.push(description.id);
        }

        this._errorObserver?.disconnect();
        this._errorObserver = null;

        if (error) {
            if (!error.id) error.id = `ix-phone-number-field-error-${this._instanceId}`;
            describedBy.push(error.id);
            // polite, ikke role="alert": venter til skjermleseren er ferdig.
            error.setAttribute('aria-live', 'polite');

            this._errorObserver = new MutationObserver(() => this._syncInvalid(error));
            this._errorObserver.observe(error, {
                childList: true,
                characterData: true,
                subtree: true,
                attributeFilter: ['data-status'],
            });
            this._syncInvalid(error);
        } else {
            this.removeAttribute('aria-invalid');
            this._syncDataState();
        }

        if (describedBy.length > 0) this.setAttribute('aria-describedby', describedBy.join(' '));
        else this.removeAttribute('aria-describedby');
    }

    private _contains(node: Node, selector: string): boolean {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        const el = node as Element;
        return !!el.matches?.(selector) || !!el.querySelector?.(selector);
    }

    // Med formatter legger <ix-field> en skjult mirror-input ved siden av den synlige.
    private _countryInput(): HTMLInputElement | null {
        return this.querySelector<HTMLInputElement>('[data-field="country"] input:not([type="hidden"])');
    }

    private _numberInput(): HTMLInputElement | null {
        return this.querySelector<HTMLInputElement>('[data-field="number"] input:not([type="hidden"])');
    }

    private _controls(): HTMLInputElement[] {
        return [this._countryInput(), this._numberInput()].filter((c): c is HTMLInputElement => !!c);
    }

    // Native setter: React overstyrer `value` på inputen for å spore endringer.
    // Skriver vi gjennom den, tror React at verdien er uendret og sender ingen
    // onChange, så RHF ville aldri fått «358» fra autofyllt «+358».
    private _sanitizeCountryCode(input: HTMLInputElement): void {
        const clean = input.value.replace(/\D/g, '').slice(0, COUNTRY_CODE_MAX_DIGITS);
        if (clean === input.value) return;
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, clean);
    }

    // En suksessmelding (data-status="success") er ingen feil.
    private _hasError(error: HTMLElement | null): boolean {
        return !!error?.textContent?.trim() && error.dataset.status !== 'success';
    }

    private _syncInvalid(error: HTMLElement): void {
        if (this._hasError(error)) this.setAttribute('aria-invalid', 'true');
        else this.removeAttribute('aria-invalid');
        this._syncDataState();
    }

    // Feil vinner over readonly, som vinner over disabled.
    private _syncDataState(): void {
        const error = this.querySelector<HTMLElement>(':scope > [data-field="error"]');
        let state: string | null = null;
        if (this._hasError(error)) state = 'error';
        else if (this.hasAttribute('readonly')) state = 'readonly';
        else if (this.hasAttribute('disabled')) state = 'disabled';

        if (state) this.setAttribute('data-state', state);
        else this.removeAttribute('data-state');
    }

    private _syncHostStateToControls(): void {
        const isDisabled = this.hasAttribute('disabled');
        const isReadonly = this.hasAttribute('readonly');
        for (const input of this._controls()) {
            this._applyFlag(input, 'disabled', isDisabled, this._ownDisabled);
            this._applyFlag(input, 'readOnly', isReadonly, this._ownReadonly);
        }
        this._syncDataState();
    }

    private _syncRequired(): void {
        const on = this.hasAttribute('required');
        for (const input of this._controls()) this._applyFlag(input, 'required', on, this._ownRequired);
    }

    // Lagrer inputens egen verdi før gruppen overstyrer den, og setter den
    // tilbake når gruppen slår av.
    private _applyFlag(
        input: HTMLInputElement,
        prop: 'disabled' | 'readOnly' | 'required',
        groupOn: boolean,
        ownStore: WeakMap<Element, boolean>
    ): void {
        if (groupOn) {
            if (!ownStore.has(input)) ownStore.set(input, input[prop]);
            input[prop] = true;
        } else if (ownStore.has(input)) {
            input[prop] = ownStore.get(input)!;
            ownStore.delete(input);
        }
    }

    // Bare når attributtet mangler, så forfatterens egne verdier beholdes.
    // data-format="phone" fanges av <ix-field> og gir norsk formatering.
    private _stampDefaults(): void {
        const stamp = (input: HTMLInputElement | null, defaults: Record<string, string>) => {
            if (!input) return;
            for (const [attr, value] of Object.entries(defaults)) {
                if (!input.hasAttribute(attr)) input.setAttribute(attr, value);
            }
        };
        stamp(this._countryInput(), { inputmode: 'numeric', autocomplete: 'tel-country-code' });
        stamp(this._numberInput(), {
            type: 'tel',
            inputmode: 'numeric',
            autocomplete: 'tel-national',
            'data-format': 'phone',
        });
    }
}
