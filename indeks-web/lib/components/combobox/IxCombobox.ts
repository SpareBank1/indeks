/**
 * IxCombobox — ARIA-lim for en søkbar select med single- og multiselect.
 *
 * ## Designfilosofi
 *
 * Komponenten erstatter ingen native elementer. Forfatteren skriver <input>,
 * en options-liste og en skjult <select> i light DOM inni <ix-combobox>.
 * Komponentens jobb er å koble dem sammen med korrekt combobox/listbox-ARIA,
 * håndtere tastatur og filtrering, posisjonere lista, og synkronisere valgte
 * verdier til den skjulte <select> for form-innsending.
 *
 * ## Virtual focus
 *
 * DOM-fokus blir ALLTID på <input>. Aktivt listeelement spores med
 * `aria-activedescendant` som peker på option-ens id — fokus flyttes aldri
 * fysisk inn i lista. Dette lar brukeren skrive og pil-navigere samtidig, og
 * er den enkeltbeslutningen hjemmelagde comboboxer oftest bommer på.
 *
 * ## Single vs. multi
 *
 * `multiple` (attributt på host) bytter oppførsel — ikke to komponenter:
 *   - Single: valg setter input.value = label, lukker lista, synker én <option>.
 *   - Multi:  valg legges i et sett, lista holdes åpen, input tømmes, og en
 *             <data class="ix-chip" data-removable> rendres i chips-wrapperen.
 *             Chips nås med piltast (radiogruppe-modell), ikke egne tab-stopp.
 *
 * ## Posisjonering
 *
 * Lista posisjoneres manuelt med getBoundingClientRect + viewport-clamp (samme
 * grep som tooltip.ts) — position: fixed, flip over feltet ved plassmangel.
 * INGEN popover-API og INGEN avhengigheter: indeks-web er dependency-fritt og
 * bundles til CDN, og manuell posisjonering fungerer på hele browserslist.
 *
 * ## Delelementer (data-field / klasse i light DOM)
 *   - .ix-text-field > input           → combobox-input
 *   - .ix-combobox__toggle             → chevron-knapp (åpne/lukke)
 *   - .ix-combobox__listbox            → listbox-panel
 *   - .ix-combobox__option[data-value] → alternativer
 *   - .ix-combobox__no-hits            → melding ved 0 treff (role="status")
 *   - [data-field="chips"]             → chips-wrapper (kun multi)
 *   - [data-field="native"] (select)   → skjult select for form-synk
 *
 * @example Single
 * <ix-combobox data-no-hits-text="Ingen treff">
 *   <div class="ix-text-field">
 *     <input class="ix-text-field__input" placeholder="Søk …" />
 *     <button class="ix-combobox__toggle"></button>
 *   </div>
 *   <div class="ix-combobox__listbox">
 *     <div class="ix-combobox__option" data-value="47">
 *       <span class="ix-combobox__option-check" aria-hidden="true"></span>
 *       <span class="ix-combobox__option-label">Norge</span>
 *     </div>
 *   </div>
 *   <div class="ix-combobox__no-hits" role="status" hidden>Ingen treff</div>
 *   <select data-field="native" hidden></select>
 * </ix-combobox>
 */

// Modul-teller for stabile, unike IDer på tvers av instanser.
let comboboxCounter = 0;

// Locale-bevisst matcher: sensitivity 'base' ignorerer store/små bokstaver og
// aksenter, men håndterer norsk æ/ø/å korrekt.
const COLLATOR = new Intl.Collator('no', { sensitivity: 'base', usage: 'search' });

// Enkel touch-plattform-sniff (samme idé som u-combobox): skjul clear/toggle fra
// skjermleser på mobil så swipe-navigasjon ikke lukker lista utilsiktet.
const IS_TOUCH = typeof navigator !== 'undefined' && /iphone|ipad|ipod|android/i.test(navigator.userAgent);

export class IxCombobox extends HTMLElement {
    private _instanceId = 0;

    // Cachede delelementer
    private _input: HTMLInputElement | null = null;
    private _listbox: HTMLElement | null = null;
    private _toggle: HTMLButtonElement | null = null;
    private _chips: HTMLElement | null = null;
    private _noHits: HTMLElement | null = null;
    private _noHitsText = '';
    private _select: HTMLSelectElement | null = null;

    // WC-eide skjulte a11y-elementer (light DOM, class="ix-sr-only")
    private _arrowHint: HTMLElement | null = null;
    private _results: HTMLElement | null = null;
    private _lastAnnouncedCount = -1;
    private _announceTimer: ReturnType<typeof setTimeout> | null = null;

    // Aktivt element (virtual focus)
    private _activeOption: HTMLElement | null = null;

    // Cleanup-referanser
    private _onInput: ((e: Event) => void) | null = null;
    private _onKeydown: ((e: KeyboardEvent) => void) | null = null;
    private _onFocusin: ((e: FocusEvent) => void) | null = null;
    private _onClick: ((e: MouseEvent) => void) | null = null;
    private _onDocPointer: ((e: Event) => void) | null = null;
    private _onReposition: (() => void) | null = null;
    private _optionObserver: MutationObserver | null = null;

    static get observedAttributes(): string[] {
        return [
            'multiple',
            'disabled',
            'readonly',
            'name',
            'data-no-hits-text',
            'data-arrow-hint-text',
            'data-remove-chip-label',
            'data-chips-label',
        ];
    }

    connectedCallback(): void {
        this._instanceId = ++comboboxCounter;
        this._wire();
    }

    disconnectedCallback(): void {
        const input = this._input;
        if (input) {
            if (this._onInput) input.removeEventListener('input', this._onInput);
            if (this._onKeydown) input.removeEventListener('keydown', this._onKeydown);
        }
        if (this._onKeydown) this.removeEventListener('keydown', this._onKeydown);
        if (this._onFocusin) this.removeEventListener('focusin', this._onFocusin);
        if (this._onClick) this.removeEventListener('click', this._onClick);
        if (this._onDocPointer) document.removeEventListener('pointerdown', this._onDocPointer, true);
        this._removeRepositionListeners();
        this._optionObserver?.disconnect();
        if (this._announceTimer) {
            clearTimeout(this._announceTimer);
            this._announceTimer = null;
        }

        this._onInput = null;
        this._onKeydown = null;
        this._onFocusin = null;
        this._onClick = null;
        this._onDocPointer = null;
        this._onReposition = null;
        this._optionObserver = null;
        this._activeOption = null;
        this._arrowHint = null;
        this._results = null;
    }

    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
        if (!this.isConnected) return;
        if (name === 'disabled' || name === 'readonly') {
            this._syncControlState();
        } else if (name === 'multiple') {
            this._syncMultiState();
        } else if (name === 'name') {
            if (this._select) this._select.name = newValue ?? '';
        } else if (name === 'data-remove-chip-label' || name === 'data-arrow-hint-text') {
            this._syncChipLabels();
            this._syncArrowHint();
        } else if (name === 'data-chips-label') {
            this._syncChipsGroup();
        } else if (name === 'data-no-hits-text') {
            this._noHitsText = (newValue || '').trim();
            this._updateNoHits();
        }
    }

    // ── Egenskaper ──────────────────────────────────────────────────────────

    get multiple(): boolean {
        // Godta data-multiple="false" som falsk (React-vennlig), i tillegg til
        // fravær av attributtet.
        const attr = this.getAttribute('multiple');
        return attr !== null && attr !== 'false';
    }

    set multiple(value: boolean) {
        this.toggleAttribute('multiple', value);
    }

    private get _options(): HTMLElement[] {
        return this._listbox ? Array.from(this._listbox.querySelectorAll<HTMLElement>('.ix-combobox__option')) : [];
    }

    private get _visibleOptions(): HTMLElement[] {
        return this._options.filter((o) => !o.hidden && o.getAttribute('aria-disabled') !== 'true');
    }

    private get _isDisabled(): boolean {
        return this.hasAttribute('disabled') || this.hasAttribute('readonly');
    }

    // ── Oppkobling ────────────────────────────────────────────────────────────

    private _wire(): void {
        this._input = this.querySelector<HTMLInputElement>('.ix-text-field input, input.ix-text-field__input, input');
        this._listbox = this.querySelector<HTMLElement>('.ix-combobox__listbox');
        this._toggle = this.querySelector<HTMLButtonElement>('.ix-combobox__toggle');
        this._chips = this.querySelector<HTMLElement>('[data-field="chips"]');
        this._noHits = this.querySelector<HTMLElement>('.ix-combobox__no-hits');
        this._select = this.querySelector<HTMLSelectElement>('select[data-field="native"]');

        const input = this._input;
        const listbox = this._listbox;

        if (!input || !listbox) {
            if (import.meta.env.DEV) {
                console.warn('[ix-combobox] Mangler <input> eller .ix-combobox__listbox. Komponenten er ikke aktiv.');
            }
            return;
        }

        if (import.meta.env.DEV && this._options.length === 0) {
            console.warn('[ix-combobox] Fant ingen .ix-combobox__option. Lista er tom.');
        }
        if (import.meta.env.DEV && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby') && !input.id) {
            console.warn('[ix-combobox] Inputen mangler tilgjengelig navn. Pakk komponenten i <ix-field> med <label>, eller sett aria-label.');
        }

        // Opprett skjult select hvis forfatteren ikke la den til — kreves for
        // form-innsending uten React.
        if (!this._select) {
            const select = document.createElement('select');
            select.setAttribute('data-field', 'native');
            select.hidden = true;
            this.appendChild(select);
            this._select = select;
        }
        const nameAttr = this.getAttribute('name');
        if (nameAttr) this._select.name = nameAttr;

        // ── input-ARIA ──
        if (!input.id) input.id = `ix-combobox-input-${this._instanceId}`;
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('aria-expanded', 'false');

        // ── listbox-ARIA ──
        if (!listbox.id) listbox.id = `ix-combobox-listbox-${this._instanceId}`;
        listbox.setAttribute('role', 'listbox');
        listbox.hidden = true;
        input.setAttribute('aria-controls', listbox.id);

        // ── options-ARIA ──
        // Single: aria-selected settes KUN på valgt option (APG) — de øvrige har
        // ingen aria-selected, så skjermleser slipper å lese «ikke valgt» for hver.
        // Multi: options beholder true/false (listbox er aria-multiselectable).
        this._options.forEach((option, i) => {
            if (!option.id) option.id = `${listbox.id}-option-${i}`;
            option.setAttribute('role', 'option');
            if (this.multiple && !option.hasAttribute('aria-selected')) {
                option.setAttribute('aria-selected', 'false');
            }
        });
        if (!this.multiple) this._normalizeSelectedAria();

        // ── toggle-knapp ──
        if (this._toggle) {
            this._toggle.type = 'button';
            this._toggle.setAttribute('tabindex', '-1');
            // Ingen hardkodet fallback-tekst (i18n): konsumenten må sette et
            // tilgjengelig navn via aria-label (React: toggleLabel) — advar i DEV
            // hvis det mangler, slik at norsk bokmål ikke smitter over på andre språk.
            if (import.meta.env.DEV && !this._toggle.getAttribute('aria-label') && !this._toggle.getAttribute('aria-labelledby')) {
                console.warn('[ix-combobox] Toggle-knappen mangler tilgjengelig navn. Sett aria-label (React: toggleLabel) på riktig språk.');
            }
            // Skjul fra skjermleser på touch så swipe-navigasjon ikke lukker lista.
            if (IS_TOUCH) this._toggle.setAttribute('aria-hidden', 'true');
        }

        // ── no-hits ──
        // role="status" er en live region. Den må BLI i tilgjengelighetstreet —
        // vi styrer synlighet via tekstinnhold (tom = CSS :empty skjuler den),
        // ikke via hidden/display:none. Skjermlesere annonserer ikke endringer i
        // en region som var display:none da innholdet ble satt inn. Samme mønster
        // som [data-field="error"] i ix-field.
        if (this._noHits) {
            // Ta vare på forfatterens tekst, men start tom så ingenting annonseres
            // eller vises før filteret faktisk gir 0 treff.
            this._noHitsText = (this.getAttribute('data-no-hits-text') || this._noHits.textContent || '').trim();
            this._noHits.textContent = '';
            // Fjern eventuell hidden-attributt fra markup: live-regionen må BLI i
            // tilgjengelighetstreet. Synlighet styres av tekstinnhold (CSS :empty),
            // ikke hidden — ellers ville skjermleseren aldri fanget opp endringen.
            this._noHits.removeAttribute('hidden');
        }

        // Skjult live-region for treff-antall — må være i treet før filtrering
        // så skjermleseren fanger opp senere tekst-endringer.
        this._ensureResultsEl();

        this._syncMultiState();
        this._syncControlState();

        // Initial synk: bygg valgt-tilstand fra options som er markert selected i HTML.
        this._syncFromInitialSelection();

        // ── Event-lyttere ──
        this._onInput = () => this._handleInput();
        input.addEventListener('input', this._onInput);

        this._onKeydown = (e: KeyboardEvent) => this._handleKeydown(e);
        // Lytt på host (capture-fasen ikke nødvendig) så både input og chips fanges.
        this.addEventListener('keydown', this._onKeydown);

        this._onClick = (e: MouseEvent) => this._handleClick(e);
        this.addEventListener('click', this._onClick);

        this._onFocusin = () => {
            /* reservert for fremtidig bruk (åpne ved fokus) */
        };

        // Klikk utenfor lukker lista.
        this._onDocPointer = (e: Event) => {
            if (!this.contains(e.target as Node)) this._close();
        };
        document.addEventListener('pointerdown', this._onDocPointer, true);

        // Observer at options legges til/fjernes (React re-render) og re-wire ARIA.
        this._optionObserver = new MutationObserver(() => this._rewireOptions());
        this._optionObserver.observe(listbox, { childList: true, subtree: true });
    }

    // Re-kjør ARIA-oppsett på options etter DOM-endring (idempotent).
    private _rewireOptions(): void {
        const listbox = this._listbox;
        if (!listbox) return;
        this._options.forEach((option, i) => {
            if (!option.id) option.id = `${listbox.id}-option-${i}`;
            option.setAttribute('role', 'option');
            if (this.multiple && !option.hasAttribute('aria-selected')) {
                option.setAttribute('aria-selected', 'false');
            }
        });
        if (!this.multiple) this._normalizeSelectedAria();
        this._syncFromInitialSelection();
    }

    // Single (APG): behold aria-selected="true" kun der den er satt, fjern
    // attributtet der det ikke er «true» (inkl. en forfatter-satt "false") så
    // skjermleser ikke annonserer «ikke valgt» for hvert alternativ.
    private _normalizeSelectedAria(): void {
        for (const option of this._options) {
            if (option.getAttribute('aria-selected') !== 'true') {
                option.removeAttribute('aria-selected');
            }
        }
    }

    // ── Åpne / lukke ────────────────────────────────────────────────────────

    private get _isOpen(): boolean {
        return !!this._listbox && !this._listbox.hidden;
    }

    private _open(): void {
        if (this._isDisabled || this._isOpen || !this._listbox || !this._input) return;
        this._listbox.hidden = false;
        this._input.setAttribute('aria-expanded', 'true');
        this.setAttribute('data-open', '');
        this._position();
        this._addRepositionListeners();
        // Aktivt element: første valgte, ellers første synlige.
        const selected = this._visibleOptions.find((o) => o.getAttribute('aria-selected') === 'true');
        this._setActive(selected ?? this._visibleOptions[0] ?? null);
    }

    private _close(): void {
        if (!this._isOpen || !this._listbox || !this._input) return;
        this._listbox.hidden = true;
        this._input.setAttribute('aria-expanded', 'false');
        this.removeAttribute('data-open');
        this._setActive(null);
        this._removeRepositionListeners();
        this._updateNoHits(); // tøm live-regionen når lista lukkes
        this._resetResults(); // nullstill treff-annonsering så neste åpning re-annonserer
    }

    private _toggleOpen(): void {
        if (this._isOpen) this._close();
        else this._open();
    }

    // ── Posisjonering (getBoundingClientRect + clamp, jf. tooltip.ts) ─────────

    private _position(): void {
        const listbox = this._listbox;
        const field = this.querySelector<HTMLElement>('.ix-text-field') ?? this._input;
        if (!listbox || !field) return;

        const r = field.getBoundingClientRect();
        const vh = window.innerHeight || 0;
        const gap = 4;

        // Match bredde til feltet.
        listbox.style.width = `${r.width}px`;
        listbox.style.left = `${Math.max(8, r.left)}px`;

        // Mål panelet for flip-avgjørelse.
        const ph = listbox.offsetHeight;
        const spaceBelow = vh - r.bottom;
        const flipUp = ph > spaceBelow && r.top > spaceBelow;

        if (flipUp) {
            listbox.style.top = `${Math.max(8, r.top - ph - gap)}px`;
        } else {
            listbox.style.top = `${r.bottom + gap}px`;
        }
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

    // ── Filtrering ────────────────────────────────────────────────────────────

    private _handleInput(): void {
        if (this._isDisabled) return;
        const query = (this._input?.value ?? '').trim();
        // Åpne før filtrering: _updateNoHits() krever at lista er åpen for å vise
        // no-hits-teksten, ellers annonseres den aldri ved 0 treff.
        if (!this._isOpen) this._open();
        else this._position();
        this._filter(query);
        // Aktivt element til første synlige treff.
        this._setActive(this._visibleOptions[0] ?? null);
    }

    private _filter(query: string): void {
        const options = this._options;
        if (!query) {
            options.forEach((o) => (o.hidden = false));
        } else {
            for (const option of options) {
                // Søk i label, verdi og beskrivelse — treff i én av dem er nok.
                option.hidden = !this._searchTexts(option).some((text) => this._match(text, query));
            }
        }
        this._updateNoHits();
        this._announceResults();
    }

    // Tekstene et søk skal treffe: label, data-value og beskrivelse (2. linje).
    private _searchTexts(option: HTMLElement): string[] {
        return [this._optionLabelText(option), option.getAttribute('data-value') ?? '', this._optionDescriptionText(option)].filter(
            (text) => text.length > 0
        );
    }

    // Locale-bevisst substring-match (æøå, aksent-uavhengig).
    private _match(text: string, query: string): boolean {
        const l = text.length;
        const q = query.length;
        if (q === 0) return true;
        if (q > l) return false;
        for (let i = 0; i + q <= l; i++) {
            if (COLLATOR.compare(text.slice(i, i + q), query) === 0) return true;
        }
        return false;
    }

    private _updateNoHits(): void {
        if (!this._noHits) return;
        // Vis kun når lista er åpen og filteret gir 0 treff. Toggle tekst, ikke
        // synlighet, så live-regionen annonseres når teksten dukker opp.
        const show = this._isOpen && this._visibleOptions.length === 0;
        this._noHits.textContent = show ? this._noHitsText : '';
    }

    private _optionLabelText(option: HTMLElement): string {
        const labelEl = option.querySelector('.ix-combobox__option-label');
        return (labelEl?.textContent ?? option.textContent ?? '').trim();
    }

    private _optionDescriptionText(option: HTMLElement): string {
        const descEl = option.querySelector('.ix-combobox__option-description');
        return (descEl?.textContent ?? '').trim();
    }

    // ── Aktivt element (virtual focus) ─────────────────────────────────────────

    private _setActive(option: HTMLElement | null): void {
        if (this._activeOption && this._activeOption !== option) {
            this._activeOption.removeAttribute('data-active');
        }
        this._activeOption = option;
        if (option) {
            option.setAttribute('data-active', '');
            this._input?.setAttribute('aria-activedescendant', option.id);
            // scrollIntoView finnes ikke i jsdom (ingen layout); vær defensiv.
            option.scrollIntoView?.({ block: 'nearest' });
        } else {
            this._input?.removeAttribute('aria-activedescendant');
        }
    }

    private _moveActive(delta: number): void {
        const visible = this._visibleOptions;
        if (visible.length === 0) return;
        const current = this._activeOption ? visible.indexOf(this._activeOption) : -1;
        let next = current + delta;
        if (next < 0) next = 0;
        if (next >= visible.length) next = visible.length - 1;
        this._setActive(visible[next]);
    }

    // ── Tastatur ──────────────────────────────────────────────────────────────

    private _handleKeydown(e: KeyboardEvent): void {
        if (this._isDisabled) return;
        const target = e.target as HTMLElement;

        // Escape lukker lista uansett hvor fokus er (input, chip, toggle) — target
        // er ikke garantert å være inputen i nettleseren, så dette må stå FØR
        // input-sjekken under. Flytt fokus tilbake til input etter lukking.
        if (e.key === 'Escape' && this._isOpen) {
            e.preventDefault();
            this._close();
            this._input?.focus();
            return;
        }

        const isChip = target instanceof HTMLDataElement && target.classList.contains('ix-chip');
        if (isChip) {
            this._handleChipKeydown(e, target as HTMLDataElement);
            return;
        }
        if (target !== this._input) return;
        this._handleInputKeydown(e);
    }

    private _handleInputKeydown(e: KeyboardEvent): void {
        const input = this._input;
        if (!input) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!this._isOpen) this._open();
                else this._moveActive(1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!this._isOpen) this._open();
                else this._moveActive(-1);
                break;
            case 'Enter':
                if (this._isOpen && this._activeOption) {
                    e.preventDefault();
                    this._selectOption(this._activeOption);
                }
                break;
            // Escape håndteres i _handleKeydown (target-uavhengig).
            case 'ArrowLeft':
            case 'Backspace': {
                // Ved tom markør på start av input i multi: hopp til siste chip.
                if (this.multiple && input.selectionStart === 0 && input.selectionEnd === 0) {
                    const chips = this._chipElements();
                    const last = chips[chips.length - 1];
                    if (last) {
                        e.preventDefault();
                        last.focus();
                    }
                }
                break;
            }
        }
    }

    private _handleChipKeydown(e: KeyboardEvent, chip: HTMLDataElement): void {
        const chips = this._chipElements();
        const index = chips.indexOf(chip);

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                chips[index - 1]?.focus();
                break;
            case 'ArrowRight':
                e.preventDefault();
                (chips[index + 1] ?? this._input)?.focus();
                break;
            case 'Backspace':
            case 'Delete':
            case 'Enter':
            case ' ': {
                e.preventDefault();
                const value = chip.getAttribute('value') ?? '';
                // Flytt fokus fornuftig før fjerning.
                const next = chips[index + 1] ?? chips[index - 1] ?? this._input;
                this._deselectValue(value);
                next?.focus();
                break;
            }
        }
    }

    // ── Klikk ───────────────────────────────────────────────────────────────

    private _handleClick(e: MouseEvent): void {
        if (this._isDisabled) return;
        const target = e.target as HTMLElement;

        // Toggle-knapp
        if (this._toggle && this._toggle.contains(target)) {
            e.preventDefault();
            this._input?.focus();
            this._toggleOpen();
            return;
        }

        // Chip (eller dens ::after-kryss) → fjern
        const chip = target.closest<HTMLDataElement>('data.ix-chip');
        if (chip && this.contains(chip)) {
            e.preventDefault();
            this._deselectValue(chip.getAttribute('value') ?? '');
            this._input?.focus();
            return;
        }

        // Option → velg
        const option = target.closest<HTMLElement>('.ix-combobox__option');
        if (option && this._listbox?.contains(option)) {
            if (option.getAttribute('aria-disabled') === 'true') return;
            this._selectOption(option);
            return;
        }

        // Klikk i feltet åpner lista.
        if (this._input && (target === this._input || this.querySelector('.ix-text-field')?.contains(target))) {
            this._input.focus();
            if (!this._isOpen) this._open();
        }
    }

    // ── Valg ──────────────────────────────────────────────────────────────────

    private _selectOption(option: HTMLElement): void {
        const value = option.getAttribute('data-value') ?? '';
        const label = this._optionLabelText(option);

        if (this.multiple) {
            const isSelected = option.getAttribute('aria-selected') === 'true';
            if (isSelected) {
                this._deselectValue(value);
            } else {
                option.setAttribute('aria-selected', 'true');
                this._addChip(value, label);
                this._syncSelect();
                this._emitChange();
            }
            // Hold lista åpen, tøm input, la brukeren søke videre.
            if (this._input) this._input.value = '';
            this._filter('');
            this._setActive(option);
        } else {
            // Single (APG): marker denne, fjern aria-selected på øvrige (ikke
            // sett "false") så skjermleser ikke leser «ikke valgt» for hver.
            for (const o of this._options) {
                if (o === option) o.setAttribute('aria-selected', 'true');
                else o.removeAttribute('aria-selected');
            }
            if (this._input) this._input.value = label;
            this._syncSelect();
            this._emitChange();
            this._close();
        }
    }

    private _deselectValue(value: string): void {
        const option = this._options.find((o) => (o.getAttribute('data-value') ?? '') === value);
        option?.setAttribute('aria-selected', 'false');
        this._removeChip(value);
        this._syncSelect();
        this._emitChange();
    }

    // Bygg valgt-tilstand fra options som allerede har aria-selected="true" i HTML.
    private _syncFromInitialSelection(): void {
        const selected = this._options.filter((o) => o.getAttribute('aria-selected') === 'true');
        if (this.multiple) {
            // Rendre chips som mangler.
            for (const option of selected) {
                const value = option.getAttribute('data-value') ?? '';
                if (!this._chipElements().some((c) => c.getAttribute('value') === value)) {
                    this._addChip(value, this._optionLabelText(option));
                }
            }
        } else if (selected[0] && this._input && !this._input.value) {
            this._input.value = this._optionLabelText(selected[0]);
        }
        this._syncSelect();
    }

    // ── Chips (kun multi) ──────────────────────────────────────────────────────

    private _chipElements(): HTMLDataElement[] {
        return this._chips ? Array.from(this._chips.querySelectorAll<HTMLDataElement>('data.ix-chip')) : [];
    }

    private _addChip(value: string, label: string): void {
        if (!this._chips) return;
        if (this._chipElements().some((c) => c.getAttribute('value') === value)) return;
        const chip = document.createElement('data');
        chip.className = 'ix-chip';
        chip.setAttribute('data-removable', '');
        chip.setAttribute('value', value);
        // role="button": chipen ER fjern-handlingen (klikk/Enter/Space/Backspace/
        // Delete fjerner). role="option" ville vært ugyldig her — chips ligger i en
        // role="group"-wrapper, ikke i en listbox.
        chip.setAttribute('role', 'button');
        chip.setAttribute('tabindex', '-1');
        chip.textContent = label;
        chip.setAttribute('aria-label', this._chipLabel(label));
        this._chips.appendChild(chip);
    }

    private _removeChip(value: string): void {
        this._chipElements()
            .find((c) => c.getAttribute('value') === value)
            ?.remove();
    }

    private _chipLabel(label: string): string {
        // Ingen hardkodet fallback (i18n): mangler suffikset, beholder chip-en
        // bare label-teksten som tilgjengelig navn. _warnMissingChipLabel advarer
        // i DEV. Konsumenten sender data-remove-chip-label (React: removeChipLabel).
        const remove = this.getAttribute('data-remove-chip-label');
        return remove ? `${label}, ${remove}` : label;
    }

    private _syncChipLabels(): void {
        for (const chip of this._chipElements()) {
            chip.setAttribute('aria-label', this._chipLabel((chip.textContent ?? '').trim()));
        }
    }

    // ── Skjult select (form-synk) ───────────────────────────────────────────

    private _syncSelect(): void {
        const select = this._select;
        if (!select) return;
        select.toggleAttribute('multiple', this.multiple);

        const selectedOptions = this._options.filter((o) => o.getAttribute('aria-selected') === 'true');
        // Bygg options på nytt — enkelt og robust for både single og multi.
        select.textContent = '';
        for (const option of selectedOptions) {
            const value = option.getAttribute('data-value') ?? '';
            const opt = new Option(this._optionLabelText(option), value, true, true);
            select.add(opt);
        }
    }

    private _emitChange(): void {
        this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    }

    // ── Tilstand ──────────────────────────────────────────────────────────────

    private _syncControlState(): void {
        const input = this._input;
        if (!input) return;
        const disabled = this.hasAttribute('disabled');
        const readonly = this.hasAttribute('readonly');
        input.disabled = disabled;
        input.readOnly = readonly;
        this.toggleAttribute('data-disabled', disabled);
        this.toggleAttribute('data-readonly', readonly);
        if (disabled || readonly) this._close();
    }

    private _syncMultiState(): void {
        const multiple = this.multiple;
        if (this._listbox) {
            this._listbox.setAttribute('aria-multiselectable', multiple ? 'true' : 'false');
        }
        // i18n: chip-ens "fjern"-suffiks har ingen hardkodet fallback. Advar i DEV
        // hvis det mangler i multi, så skjermleser-teksten blir korrekt på språket.
        if (import.meta.env.DEV && multiple && !this.getAttribute('data-remove-chip-label')) {
            console.warn('[ix-combobox] Mangler data-remove-chip-label (React: removeChipLabel). Chips får ingen "fjern"-tekst for skjermleser.');
        }
        this._syncChipsGroup();
        this._syncArrowHint();
        this._syncSelect();
    }

    // Chips-wrapperen er en role="group" så chip-knappene har en gyldig, navngitt
    // gruppekontekst for skjermleser (i18n-navn fra data-chips-label). Kun multi —
    // wrapperen finnes ikke i single.
    private _syncChipsGroup(): void {
        const chips = this._chips;
        if (!chips) return;
        if (this.multiple) {
            chips.setAttribute('role', 'group');
            const label = this.getAttribute('data-chips-label');
            if (label) chips.setAttribute('aria-label', label);
            else chips.removeAttribute('aria-label');
            if (import.meta.env.DEV && !label) {
                console.warn('[ix-combobox] Mangler data-chips-label (React: chipsLabel). Chip-gruppen får ingen tilgjengelig gruppenavn for skjermleser.');
            }
        } else {
            chips.removeAttribute('role');
            chips.removeAttribute('aria-label');
        }
    }

    // Piltast-hint på input i multi-modus så skjermleser vet at chips nås med pil.
    // Bruker aria-describedby mot et skjult .ix-sr-only-element (bredt AT-støttet),
    // ikke aria-description (ujevn støtte). WC-en eier elementet, som den skjulte
    // <select>, så rene HTML-forfattere får hintet uten å skrive det selv.
    private _syncArrowHint(): void {
        const input = this._input;
        if (!input) return;
        const hint = this.getAttribute('data-arrow-hint-text');
        if (this.multiple && hint) {
            const el = this._ensureArrowHintEl();
            el.textContent = hint;
            this._addDescribedBy(el.id);
        } else if (this._arrowHint) {
            this._arrowHint.textContent = '';
            this._removeDescribedBy(this._arrowHint.id);
        }
    }

    private _ensureArrowHintEl(): HTMLElement {
        if (!this._arrowHint) {
            const el = document.createElement('span');
            el.className = 'ix-sr-only';
            el.id = `ix-combobox-arrow-hint-${this._instanceId}`;
            this.appendChild(el);
            this._arrowHint = el;
        }
        return this._arrowHint;
    }

    // ── aria-describedby (additiv merge) ────────────────────────────────────
    // ix-field skriver også aria-describedby på samme input (description/error).
    // Rekkefølgen på connectedCallback mellom de to custom elements er ikke
    // garantert, så vi MÅ merge additivt: aldri overskriv, kun legg til/fjern vår
    // egen id.
    private _addDescribedBy(id: string): void {
        const input = this._input;
        if (!input || !id) return;
        const tokens = (input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
        if (!tokens.includes(id)) {
            tokens.push(id);
            input.setAttribute('aria-describedby', tokens.join(' '));
        }
    }

    private _removeDescribedBy(id: string): void {
        const input = this._input;
        if (!input || !id) return;
        const tokens = (input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
        const next = tokens.filter((t) => t !== id);
        if (next.length) input.setAttribute('aria-describedby', next.join(' '));
        else input.removeAttribute('aria-describedby');
    }

    // ── Treff-annonsering (skjult live-region, debounced) ────────────────────
    // Separat fra .ix-combobox__no-hits (synlig, eier 0-treff). Denne er skjult
    // (.ix-sr-only) og annonserer antall treff (n>0) via en i18n-mal med {n}.
    // Debounced + kun-ved-endring så rask skriving ikke oversvømmer skjermleseren.
    private _ensureResultsEl(): HTMLElement {
        if (!this._results) {
            const el = document.createElement('div');
            el.className = 'ix-sr-only';
            el.setAttribute('role', 'status');
            el.id = `ix-combobox-results-${this._instanceId}`;
            this.appendChild(el);
            this._results = el;
        }
        return this._results;
    }

    private _announceResults(): void {
        const el = this._results;
        if (!el) return;
        const count = this._visibleOptions.length;
        // 0 treff eies av no-hits; annonser kun n>0 og kun når lista er åpen.
        if (!this._isOpen || count === 0) return;
        if (count === this._lastAnnouncedCount) return;
        const template = this.getAttribute('data-results-text');
        // Ingen hardkodet fallback (i18n) — uten mal er dette bare en stille no-op.
        if (!template) return;
        const text = template.replace('{n}', String(count));
        if (this._announceTimer) clearTimeout(this._announceTimer);
        this._announceTimer = setTimeout(() => {
            if (!this.isConnected) return;
            el.textContent = text;
            this._lastAnnouncedCount = count;
        }, 250);
    }

    private _resetResults(): void {
        if (this._announceTimer) {
            clearTimeout(this._announceTimer);
            this._announceTimer = null;
        }
        this._lastAnnouncedCount = -1;
        if (this._results) this._results.textContent = '';
    }
}
