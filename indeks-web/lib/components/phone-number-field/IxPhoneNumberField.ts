import { type CountryOption, getDefaultCountries, normalizeLocale } from './countries.js';

/**
 * IxPhoneNumberField — telefonnummer med landvelger.
 *
 * ## Designfilosofi
 *
 * Komponenten er en sammensatt gruppe: den binder sammen en <ix-combobox>
 * (landkode) og et <ix-field>-tekstfelt (nummer) under én felles label og én
 * felles valideringsmelding. Den reimplementerer verken combobox- eller
 * formaterings-oppførsel — <ix-combobox> og <ix-field> gjør fortsatt sin egen
 * interne ARIA-kabling.
 *
 * HTML/WC er primærkilden: forfatteren skriver minimal markup (en TOM
 * <ix-combobox> holder), og komponenten fyller landlista, setter forhåndsvalg
 * og stamper nummer-feltets standardattributter. React er et tynt lag som kun
 * videresender config som data-*-attributter.
 *
 * Speiler <ix-checkbox-group>/<ix-radio-group>-mønsteret, med disse forskjellene:
 * de to «kontrollene» er en <ix-combobox> og et nummer-<input> (ikke en liste av
 * like radio/checkbox), og disabled/readonly/required propageres til begge disse.
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
 * 5. Propagerer disabled/readonly/required til begge kontrollene. Egne
 *    (per-kontroll) verdier bevares via WeakMaps slik at group-toggle ikke
 *    overstyrer dem.
 *
 * 6. Fyller landvelgeren: injiserer .ix-combobox__option-markup i den tomme
 *    <ix-combobox>-lista fra en innebygd, lokaliserbar landliste (eller en
 *    egendefinert `data-countries`-JSON), og setter aria-selected på
 *    forhåndsvalgt land (data-country-code / data-default-country-code).
 *
 * 7. Stamper nummer-feltets standardattributter (type=tel, inputmode=numeric,
 *    autocomplete=tel-national, data-format=phone) om de mangler.
 *
 * 8. Utleder data-state (error/readonly/disabled) for CSS.
 *
 * 9. Lytter på childList slik at kontroller som React rendrer inn etter mount
 *    (conditional rendering) fanges opp og re-wires.
 *
 * ## Ingen Shadow DOM
 *
 * Komponenten bruker light DOM slik at CSS fra @sb1/indeks-css når alle
 * delelementer direkte, og aria-koblingene (aria-labelledby/-describedby) ikke
 * krysser en shadow-grense.
 *
 * @example
 * <ix-phone-number-field data-locale="nb" data-default-country-code="47">
 *   <span data-field="legend">Mobilnummer</span>
 *   <span data-field="description">Vi bruker det kun til SMS-varsling</span>
 *   <div data-field="items">
 *     <ix-combobox data-field="country" class="ix-combobox" data-no-hits-text="Ingen treff">
 *       <div class="ix-text-field">
 *         <input class="ix-text-field__input" aria-label="Landkode" />
 *         <button type="button" class="ix-combobox__toggle" aria-label="Vis land"></button>
 *       </div>
 *       <div class="ix-combobox__listbox" hidden></div>
 *     </ix-combobox>
 *     <ix-field data-field="number">
 *       <div class="ix-text-field">
 *         <input aria-label="Telefonnummer" />
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
    // Re-entrancy-vakt rundt options-injisering: hindrer at vår egen
    // childList-mutasjon (options-append) trigger en ny injisering.
    private _filling = false;
    // Bevarer per-kontroll disabled/readonly/required fra forfatter slik at
    // group-toggle ikke overstyrer den. WeakMap for å unngå memory leak ved
    // DOM-fjerning.
    private _ownDisabled: WeakMap<Element, boolean> = new WeakMap();
    private _ownReadonly: WeakMap<Element, boolean> = new WeakMap();
    private _ownRequired: WeakMap<Element, boolean> = new WeakMap();

    static get observedAttributes(): string[] {
        return ['disabled', 'readonly', 'required', 'data-locale', 'data-countries', 'data-country-code', 'data-default-country-code'];
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
        } else if (attr === 'required') {
            this._syncRequired();
        } else if (attr === 'data-locale' || attr === 'data-countries') {
            // Landlista endret seg → bygg våre injiserte options på nytt.
            this._refillCombobox();
        } else if (attr === 'data-country-code' || attr === 'data-default-country-code') {
            // Kun forhåndsvalget endret seg → flytt aria-selected, ikke rebuild.
            this._applyPreselection();
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

        // ── 4. Fyll landvelgeren + stamp nummer-defaults ──────────────────────
        this._fillCombobox();
        this._stampNumberDefaults();

        // ── 5. Propager disabled/readonly/required til kontrollene ────────────
        this._syncHostStateToControls();
        this._syncRequired();

        // ── 6. data-state for CSS ─────────────────────────────────────────────
        this._syncDataState();

        // ── 7. Lytt på childList for felt/kontroller lagt til etter mount ─────
        // React kan rendre <ix-combobox>/<ix-field> ELLER [data-field]-spennene
        // (f.eks. betinget description) inn etter connectedCallback. Da må vi kjøre
        // propageringen på nytt for nye kontroller, fylle en combobox som nettopp
        // dukket opp, OG re-koble aria-describedby om description/error dukket opp
        // eller forsvant. Ignorer mutasjoner vi selv forårsaker under injisering.
        this._childObserver = new MutationObserver((mutations) => {
            if (this._filling) return;

            const hasControlChange = mutations.some((m) =>
                Array.from(m.addedNodes).some((n) => this._containsControl(n)) ||
                Array.from(m.removedNodes).some((n) => this._containsControl(n))
            );
            if (hasControlChange) {
                this._fillCombobox();
                this._stampNumberDefaults();
                this._syncHostStateToControls();
                this._syncRequired();
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
        this._syncDataState();
    }

    // Utleder data-state for CSS fra feiltekst + disabled/readonly på host.
    // error > readonly > disabled (feil vinner alltid; ellers vises tilstanden).
    // Speiler dataState-utledningen React tidligere gjorde i JSX.
    private _syncDataState(): void {
        const error = this.querySelector<HTMLElement>(':scope > [data-field="error"]');
        const hasError = !!error?.textContent?.trim();
        const state = hasError ? 'error' : this.hasAttribute('readonly') ? 'readonly' : this.hasAttribute('disabled') ? 'disabled' : null;
        if (state) this.setAttribute('data-state', state);
        else this.removeAttribute('data-state');
    }

    private _syncHostStateToControls(): void {
        const isDisabled = this.hasAttribute('disabled');
        const isReadonly = this.hasAttribute('readonly');

        const combobox = this._combobox();
        if (combobox) this._applyState(combobox, isDisabled, isReadonly, 'attribute');

        const input = this._numberInput();
        if (input) this._applyState(input, isDisabled, isReadonly, 'property');

        this._syncDataState();
    }

    // Propagerer required fra host til begge kontrollene. Til forskjell fra
    // disabled/readonly (som <ix-combobox> observerer på host-nivå) må required
    // settes på combobox-ens INDRE <input> — <ix-combobox> observerer ikke
    // required, så en attributt på host-en ville vært en no-op.
    private _syncRequired(): void {
        const on = this.hasAttribute('required');
        const comboboxInput = this._combobox()?.querySelector<HTMLInputElement>('input') ?? null;
        if (comboboxInput) this._applyFlag(comboboxInput, 'required', on, this._ownRequired, 'property');
        const numberInput = this._numberInput();
        if (numberInput) this._applyFlag(numberInput, 'required', on, this._ownRequired, 'property');
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
        flag: 'disabled' | 'readonly' | 'required',
        groupOn: boolean,
        ownStore: WeakMap<Element, boolean>,
        mode: 'attribute' | 'property'
    ): void {
        // Mapper flagg → DOM-property (readonly-attributtet er `readOnly`-propertyen).
        const prop = flag === 'readonly' ? 'readOnly' : flag;
        const read = (): boolean =>
            mode === 'attribute' ? control.hasAttribute(flag) : !!(control as unknown as Record<string, boolean>)[prop];
        const write = (value: boolean): void => {
            if (mode === 'attribute') {
                if (value) control.setAttribute(flag, '');
                else control.removeAttribute(flag);
            } else {
                (control as unknown as Record<string, boolean>)[prop] = value;
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

    // ── Landvelger: injisering av options ───────────────────────────────────────

    // Fyller den tomme <ix-combobox>-lista med land-options. Idempotent: fyller
    // KUN når lista er tom, så forfatter-leverte options (eller en allerede fylt
    // liste) aldri overskrives. <ix-combobox> sin egen _optionObserver plukker opp
    // de tillagte nodene og gir dem role/id; siden vi setter aria-selected direkte
    // leser den også forhåndsvalget via _syncFromInitialSelection.
    private _fillCombobox(): void {
        if (this._filling) return;
        const listbox = this._listbox();
        if (!listbox) return;
        if (listbox.querySelector('.ix-combobox__option')) return; // (B) idempotens

        const options = this._resolveCountryOptions();
        if (options.length === 0) return;

        const preselect = this._preselectValue();

        this._filling = true;
        try {
            const frag = document.createDocumentFragment();
            for (const opt of options) {
                frag.appendChild(this._buildOption(opt, opt.value === preselect));
            }
            // Marker at WC-en eier disse options, så en senere locale-endring kun
            // rører våre egne (ikke forfatter-leverte) options.
            listbox.setAttribute('data-ix-injected', '');
            listbox.appendChild(frag);
        } finally {
            this._filling = false;
        }
    }

    // Bygger lista på nytt ved locale/countries-endring — men bare hvis WC-en
    // selv fylte den (data-ix-injected). Forfatter-leverte options røres aldri.
    private _refillCombobox(): void {
        const listbox = this._listbox();
        if (!listbox || !listbox.hasAttribute('data-ix-injected')) {
            // Enten ingen combobox ennå, eller forfatter eier options → prøv vanlig
            // (idempotent) fyll i tilfelle lista fortsatt er tom.
            this._fillCombobox();
            return;
        }
        this._filling = true;
        try {
            for (const opt of Array.from(listbox.querySelectorAll('.ix-combobox__option'))) opt.remove();
        } finally {
            this._filling = false;
        }
        listbox.removeAttribute('data-ix-injected');
        this._fillCombobox();
    }

    // Flytter aria-selected til option som matcher forhåndsvalget, uten å bygge
    // lista på nytt. Single (APG): fjern attributtet på de uvalgte.
    private _applyPreselection(): void {
        const listbox = this._listbox();
        if (!listbox) return;
        const preselect = this._preselectValue();
        this._filling = true;
        try {
            for (const opt of Array.from(listbox.querySelectorAll<HTMLElement>('.ix-combobox__option'))) {
                if (preselect !== null && opt.getAttribute('data-value') === preselect) {
                    opt.setAttribute('aria-selected', 'true');
                } else {
                    opt.removeAttribute('aria-selected');
                }
            }
        } finally {
            this._filling = false;
        }
    }

    private _buildOption(opt: CountryOption, selected: boolean): HTMLElement {
        const el = document.createElement('div');
        el.className = 'ix-combobox__option';
        el.setAttribute('data-value', opt.value);
        // Single (APG): sett aria-selected="true" KUN på den valgte. <ix-combobox>
        // fjerner attributtet på uvalgte og annonserer da ikke «ikke valgt».
        if (selected) el.setAttribute('aria-selected', 'true');

        const check = document.createElement('span');
        check.className = 'ix-combobox__option-check';
        check.setAttribute('aria-hidden', 'true');
        el.appendChild(check);

        const label = document.createElement('span');
        label.className = 'ix-combobox__option-label';
        label.textContent = opt.label;
        el.appendChild(label);

        if (opt.description) {
            const desc = document.createElement('span');
            desc.className = 'ix-combobox__option-description';
            desc.textContent = opt.description;
            el.appendChild(desc);
        }
        return el;
    }

    // Forhåndsvalgt landkode: kontrollert (data-country-code) har forrang over
    // ukontrollert start (data-default-country-code).
    private _preselectValue(): string | null {
        return this.getAttribute('data-country-code') ?? this.getAttribute('data-default-country-code');
    }

    // Løser landlista: egendefinert data-countries (JSON) om gyldig, ellers den
    // innebygde lista i valgt locale.
    private _resolveCountryOptions(): CountryOption[] {
        const raw = this.getAttribute('data-countries');
        if (raw) {
            try {
                const parsed: unknown = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.every((o) => o && typeof o.value === 'string' && typeof o.label === 'string')) {
                    return parsed as CountryOption[];
                }
                if (import.meta.env.DEV) {
                    console.warn('[ix-phone-number-field] data-countries er ikke en gyldig options-liste ({value,label}[]) — bruker innebygd landliste.');
                }
            } catch {
                if (import.meta.env.DEV) {
                    console.warn('[ix-phone-number-field] Kunne ikke parse data-countries som JSON — bruker innebygd landliste.');
                }
            }
        }
        return getDefaultCountries(normalizeLocale(this.getAttribute('data-locale')));
    }

    private _listbox(): HTMLElement | null {
        return this._combobox()?.querySelector<HTMLElement>('.ix-combobox__listbox') ?? null;
    }

    // ── Nummer-felt: standardattributter ────────────────────────────────────────

    // Stamper nummer-inputens standardattributter KUN når de mangler, så en
    // forfatter som setter dem selv beholder sine verdier. data-format="phone"
    // fanges av <ix-field> sin _stateObserver og gir norsk 8-sifret formatering.
    private _stampNumberDefaults(): void {
        const input = this._numberInput();
        if (!input) return;
        const defaults: Record<string, string> = {
            type: 'tel',
            inputmode: 'numeric',
            autocomplete: 'tel-national',
            'data-format': 'phone',
        };
        for (const [attr, value] of Object.entries(defaults)) {
            if (!input.hasAttribute(attr)) input.setAttribute(attr, value);
        }
    }
}
