/**
 * IxDateField — datofelt: formatert tekst-input (dd.mm.åååå) + native OS-kalender.
 *
 * ## Designfilosofi
 *
 * Hybrid av to mønstre. `ix-date-field` ligger NØSTET inne i `ix-field` (som
 * `ix-combobox`), og `ix-field` gjør ARIA-limet: kobler label↔input,
 * aria-describedby, feilmelding, OG formateringen (`data-format="date"` →
 * live dd.mm.åååå). `ix-date-field` dupliserer ingenting av dette. Dens ENESTE
 * jobb er å gjøre feltet til et datofelt:
 *
 *   1. GENERERE to instrumentelle elementer inn i `.ix-text-field` (idempotent):
 *      - `.ix-date-field__toggle`  kalenderknapp (CSS gir ikonet)
 *      - `.ix-date-field__native`  overlagt gjennomsiktig `<input type="date">`
 *        som bærer ISO-verdien, gir min/max-validering og åpner OS-kalenderen
 *   2. To-veis synk mellom den synlige dd.mm.åååå-inputen og den native ISO-inputen.
 *   3. Speile min/max/disabled/readonly ned til den native inputen.
 *   4. Knapp-klikk → `native.showPicker?.()`; tap/klikk treffer uansett den
 *      gjennomsiktige native-inputen som ligger over knappen (mobil).
 *
 * ## Verdi-kontrakt
 *
 * Utad er verdien ISO (`åååå-mm-dd`): den native inputen bærer den, `change`
 * emitter den, og `name` settes på den native inputen så form-innsending gir ISO.
 * Den synlige inputen viser `dd.mm.åååå` og har bevisst INGEN `name` (ville
 * kollidert med ix-field sin formaterings-speiling ved innsending).
 *
 * ## Delelementer (light DOM)
 *   - .ix-text-field > input               → synlig dd.mm.åååå-input (forfatteren)
 *   - .ix-date-field__toggle               → kalenderknapp (WC genererer)
 *   - .ix-date-field__native (input[date]) → skjult ISO-input (WC genererer)
 *
 * @example
 * <ix-field>
 *   <label>Fødselsdato</label>
 *   <span data-field="description">dd.mm.åååå</span>
 *   <ix-date-field data-open-label="Åpne kalender" name="fodt">
 *     <div class="ix-text-field">
 *       <input inputmode="numeric" data-format="date" />
 *     </div>
 *   </ix-date-field>
 *   <span data-field="error"></span>
 * </ix-field>
 */

// Enkel touch-plattform-sniff (samme idé som ix-combobox): på touch skjuler vi
// kalenderknappen fra skjermleser — den gjennomsiktige native-inputen over
// knappen er primærmekanismen der, og en swipe skal ikke treffe to mål.
const IS_TOUCH = typeof navigator !== 'undefined' && /iphone|ipad|ipod|android/i.test(navigator.userAgent);

// ── Rene konverteringer mellom ISO (åååå-mm-dd) og siffer (ddmmyyyy) ─────────

// 8 siffer ddmmyyyy → ISO åååå-mm-dd. Alt annet (ufullstendig/ugyldig) → ''.
function isoFromDigits(digits: string): string {
    if (!/^\d{8}$/.test(digits)) return '';
    return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
}

// ISO åååå-mm-dd → 8 siffer ddmmyyyy. Alt annet → ''.
function digitsFromIso(iso: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!match) return '';
    const [, year, month, day] = match;
    return `${day}${month}${year}`;
}

// 8 siffer ddmmyyyy → visning dd.mm.åååå. Kun for komplette datoer.
function displayFromDigits(digits: string): string {
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
}

export class IxDateField extends HTMLElement {
    // Cachede delelementer
    private _input: HTMLInputElement | null = null;
    private _toggle: HTMLButtonElement | null = null;
    private _native: HTMLInputElement | null = null;

    // Guard mot event-løkke mellom synlig og native input.
    private _syncing = false;
    // Siste ISO-verdi vi emitterte, for å unngå duplikate 'change'.
    private _lastEmitted = '';

    // Cleanup-referanser
    private _onVisibleInput: (() => void) | null = null;
    private _onNativeInput: ((e: Event) => void) | null = null;
    private _onToggleClick: (() => void) | null = null;

    static get observedAttributes(): string[] {
        return ['min', 'max', 'disabled', 'readonly', 'value', 'name', 'data-open-label'];
    }

    connectedCallback(): void {
        this._wire();
    }

    disconnectedCallback(): void {
        if (this._input && this._onVisibleInput) this._input.removeEventListener('input', this._onVisibleInput);
        if (this._native && this._onNativeInput) {
            this._native.removeEventListener('input', this._onNativeInput);
            this._native.removeEventListener('change', this._onNativeInput);
        }
        if (this._toggle && this._onToggleClick) this._toggle.removeEventListener('click', this._onToggleClick);

        this._onVisibleInput = null;
        this._onNativeInput = null;
        this._onToggleClick = null;
        this._input = null;
        this._toggle = null;
        this._native = null;
    }

    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
        if (!this.isConnected) return;
        if (name === 'min' || name === 'max' || name === 'disabled' || name === 'readonly') {
            this._syncControlState();
        } else if (name === 'name') {
            if (this._native) this._native.name = newValue ?? '';
        } else if (name === 'data-open-label') {
            this._syncToggleLabel();
        } else if (name === 'value') {
            this._seedFromIso(newValue ?? '');
        }
    }

    // ── Oppkobling ────────────────────────────────────────────────────────────

    private _wire(): void {
        const field = this.querySelector<HTMLElement>('.ix-text-field');
        if (!field) {
            if (import.meta.env.DEV) {
                console.warn('[ix-date-field] Mangler .ix-text-field med <input>. Komponenten er ikke aktiv.');
            }
            return;
        }

        // Synlig input = første input i feltet som IKKE er vår genererte native.
        this._input = field.querySelector<HTMLInputElement>('input:not(.ix-date-field__native)');
        if (!this._input) {
            if (import.meta.env.DEV) {
                console.warn('[ix-date-field] Fant ingen synlig <input> i .ix-text-field. Komponenten er ikke aktiv.');
            }
            return;
        }

        // ── Generer native ISO-input (idempotent) ──
        this._native = field.querySelector<HTMLInputElement>('input.ix-date-field__native');
        if (!this._native) {
            const native = document.createElement('input');
            native.type = 'date';
            native.className = 'ix-date-field__native';
            native.tabIndex = -1;
            native.setAttribute('aria-hidden', 'true');
            field.appendChild(native);
            this._native = native;
        }

        // ── Generer kalenderknapp (idempotent) ──
        this._toggle = field.querySelector<HTMLButtonElement>('button.ix-date-field__toggle');
        if (!this._toggle) {
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'ix-date-field__toggle';
            toggle.tabIndex = -1;
            // Sett inn FØR native slik at native (høyere z-index) overlapper knappen
            // og fanger tap på mobil.
            field.insertBefore(toggle, this._native);
            this._toggle = toggle;
        }

        // Form-innsending går via native (ISO). Les name fra host; flytt et
        // eventuelt name fra den synlige inputen til native og fjern det fra
        // synlig, så vi ikke sender dd.mm.åååå ved innsending.
        const hostName = this.getAttribute('name');
        const visibleName = this._input.getAttribute('name');
        const name = hostName ?? visibleName ?? '';
        if (name) this._native.name = name;
        if (visibleName) this._input.removeAttribute('name');

        this._syncToggleLabel();
        this._syncControlState();

        // ── Event-lyttere ──
        this._onVisibleInput = () => this._handleVisibleInput();
        this._input.addEventListener('input', this._onVisibleInput);

        this._onNativeInput = (e: Event) => this._handleNativeInput(e);
        this._native.addEventListener('input', this._onNativeInput);
        this._native.addEventListener('change', this._onNativeInput);

        this._onToggleClick = () => this._openPicker();
        this._toggle.addEventListener('click', this._onToggleClick);

        // ── Initial seed ──
        const initialIso = this.getAttribute('value');
        if (initialIso) {
            this._seedFromIso(initialIso);
        } else if (this._input.value) {
            // Synlig felt hadde en verdi i markup — utled ISO til native.
            const raw = this._input.value.replace(/\D/g, '');
            this._syncing = true;
            this._native.value = isoFromDigits(raw);
            this._syncing = false;
        }
        this._lastEmitted = this._native.value;
    }

    // ── Synk: synlig (dd.mm.åååå) → native (ISO) ────────────────────────────
    private _handleVisibleInput(): void {
        if (this._syncing || !this._input || !this._native) return;
        const raw = this._input.value.replace(/\D/g, '');
        this._syncing = true;
        this._native.value = isoFromDigits(raw);
        this._syncing = false;
        this._emitIfChanged();
    }

    // ── Synk: native (ISO) → synlig (dd.mm.åååå) ────────────────────────────
    private _handleNativeInput(e: Event): void {
        // Den native inputens egen change/input bobler til host. Stopp den, så
        // host kun emitter vår normaliserte CustomEvent('change') med ISO.
        e.stopPropagation();
        if (this._syncing || !this._input || !this._native) return;
        const digits = digitsFromIso(this._native.value);
        this._syncing = true;
        this._input.value = digits ? displayFromDigits(digits) : '';
        // La ix-field sin live-formatter og React sin input-lytter reagere.
        // Guardet av _syncing, så vår egen synlige input-lytter løper ikke.
        this._input.dispatchEvent(new Event('input', { bubbles: true }));
        this._syncing = false;
        this._emitIfChanged();
    }

    private _emitIfChanged(): void {
        const iso = this._native?.value ?? '';
        if (iso === this._lastEmitted) return;
        this._lastEmitted = iso;
        this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    }

    // Sett ISO på native og speil til synlig (guardet). Emitter ved endring.
    private _seedFromIso(iso: string): void {
        if (!this._native || !this._input) return;
        this._syncing = true;
        this._native.value = iso;
        const digits = digitsFromIso(this._native.value);
        this._input.value = digits ? displayFromDigits(digits) : '';
        this._syncing = false;
        this._emitIfChanged();
    }

    private _openPicker(): void {
        // showPicker() finnes ikke på hele browserslist (Safari 15.4 / Firefox 100).
        // Der den mangler ligger den gjennomsiktige native-inputen uansett over
        // knappen, så et tap/klikk åpner OS-kalenderen direkte.
        try {
            this._native?.showPicker();
        } catch {
            /* showPicker ikke støttet — native overlay dekker peker-interaksjon */
        }
    }

    // ── Tilstand ──────────────────────────────────────────────────────────────

    private _syncControlState(): void {
        if (!this._native) return;
        this._native.min = this.getAttribute('min') ?? '';
        this._native.max = this.getAttribute('max') ?? '';
        this._native.disabled = this.hasAttribute('disabled');
        this._native.readOnly = this.hasAttribute('readonly');
    }

    private _syncToggleLabel(): void {
        if (!this._toggle) return;
        const label = this.getAttribute('data-open-label');
        if (label) {
            this._toggle.setAttribute('aria-label', label);
        } else {
            this._toggle.removeAttribute('aria-label');
            // i18n: ingen hardkodet fallback — konsumenten må sende inn tekst på
            // riktig språk. Advar i DEV, som ix-combobox sin toggle-advarsel.
            if (import.meta.env.DEV) {
                console.warn('[ix-date-field] Kalenderknappen mangler tilgjengelig navn. Sett data-open-label (React: openLabel) på riktig språk.');
            }
        }
        // Skjul knappen fra skjermleser på touch — native-tap er primær der.
        if (IS_TOUCH) this._toggle.setAttribute('aria-hidden', 'true');
    }
}
