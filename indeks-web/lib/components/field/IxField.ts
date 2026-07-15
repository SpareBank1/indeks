/**
 * IxField — tilgjengelighetslim mellom label, input og hjelpetekster.
 *
 * ## Designfilosofi
 *
 * Komponenten erstatter ingen native HTML-elementer. `<label>`, `<input>`,
 * `<select>`, `<textarea>` og hjelpetekster skrives som vanlig HTML inne i
 * `<ix-field>`. Komponenten sin eneste jobb er å sette opp ARIA-koblingene
 * mellom dem — arbeid som er kjedelig å gjøre manuelt og lett å gjøre feil.
 *
 * Denne tilnærmingen betyr at:
 *   - Native nettleser-atferd, validering og styling forblir intakt.
 *   - Alle form-attributter (`required`, `disabled`, `name`, `value`, osv.)
 *     settes direkte på native elementet — ikke som props til en wrapper.
 *   - Komponenten kan brukes med alle typer input uten kodeendringer.
 *
 * ## Hva komponenten gjør
 *
 * 1. Kobler `<label>` til input via `for`/`id`-paret.
 *    Genererer en stabil ID på input om den mangler en.
 *
 * 2. Setter `aria-describedby` på input med IDer til description og
 *    error-elementet, slik at skjermlesere leser dem opp etter label og verdi.
 *
 * 3. Setter `aria-live="polite"` på error-elementet.
 *    Error-elementet skal alltid ligge i DOM — tomt betyr ingen feil.
 *    Dette er et krav fra ARIA Live Regions: elementet må eksistere i DOM
 *    *før* innholdet settes inn for at skjermlesere skal fange opp endringen.
 *    Hadde vi injisert elementet dynamisk ville mange skjermlesere gått glipp
 *    av meldingen.
 *
 *    Vi bruker *ikke* `role="alert"` fordi det impliserer `aria-live="assertive"`
 *    som avbryter brukeren. Feilmeldinger i skjema er viktige, men ikke så
 *    kritiske at de bør avbryte — `polite` venter til skjermleseren er ferdig.
 *
 * 4. Bruker MutationObserver på error-elementet. Når innholdet endres:
 *    - Ikke-tomt → `aria-invalid="true"` på input (visuell og semantisk feil)
 *    - Tomt      → `aria-invalid` fjernes
 *    Applikasjonen styrer altså feilmelding ved å sette/tømme textContent —
 *    komponenten holder input-tilstanden synkronisert automatisk.
 *
 * ## Identifisering av delelementer
 *
 * Komponenten finner delelementer via:
 *   - `<label>`                       → første label-element
 *   - `input | select | textarea`     → første native form-kontroll
 *   - `[data-field="description"]`    → hjelpetekst
 *   - `[data-field="error"]`          → feilmelding (alltid til stede, kan være tom)
 *   - `[data-field="prefix"]`         → visuell prefix (skjules med aria-hidden)
 *   - `[data-field="suffix"]`         → visuell suffix (skjules med aria-hidden)
 *
 * `data-field` brukes fremfor `slot`-attributtet selv om Shadow DOM ikke er i
 * bruk. `slot` er et reservert nøkkelord knytt til Shadow DOM og ville vært
 * misvisende, samt kunne krasje om `<ix-field>` senere pakkes inn i en
 * komponent med Shadow DOM.
 *
 * ## Ingen Shadow DOM
 *
 * Komponenten bruker light DOM. Det betyr at CSS fra `@sb1/indeks-css` når
 * alle delelementer uten videre, og at ARIA-attributtene er fullt synlige i
 * den tilgjengelighetstreet nettleseren eksponerer til hjelpemiddelteknologi.
 *
 * @example Grunnleggende bruk
 * <ix-field>
 *   <label>E-postadresse</label>
 *   <span data-field="description">Vi sender kvittering til denne adressen</span>
 *   <input type="email" name="email" />
 *   <span data-field="error"></span>
 * </ix-field>
 *
 * @example Sett feilmelding programmatisk
 * const errorEl = document.querySelector('ix-field [data-field="error"]');
 * errorEl.textContent = 'Oppgi en gyldig e-postadresse';
 * // → input får automatisk aria-invalid="true"
 *
 * errorEl.textContent = '';
 * // → aria-invalid fjernes
 */

import { createPatternFormatter, registerFormat, resolveFormat, type FieldFormatter } from './formats.js';

type NativeControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type TextControl = HTMLInputElement | HTMLTextAreaElement;

// Globalt teller for å garantere unike IDer på tvers av alle ix-field-instanser
// på siden. Enkel og deterministisk — ingen UUID-avhengighet nødvendig.
let fieldCounter = 0;

const ICON_URL = 'https://cdn.sparebank1.no/icons/info.svg';

export class IxField extends HTMLElement {
    // MutationObserver holdes som instansvariabel slik at den kan kobles fra
    // i disconnectedCallback og ikke lekke minne når elementet fjernes fra DOM.
    private _observer: MutationObserver | null = null;
    private _stateObserver: MutationObserver | null = null;
    private _charCountListener: (() => void) | null = null;
    private _charCountControl: TextControl | null = null;

    // ── Formatering (opt-in) ────────────────────────────────────────────────
    // Aktiv formatter og opprydding for overlay/lyttere. Null når ingen formatter
    // er satt — da oppfører ix-field seg nøyaktig som før.
    private _formatterProp: FieldFormatter | null = null;
    private _formatTeardown: (() => void) | null = null;
    // Aktiv formatter/kontroll/overlay mens formatering er kablet — brukes av
    // _updateOverlay() og den public refreshFormat()/rawValue.
    private _activeFormatter: FieldFormatter | null = null;
    private _activeControl: HTMLInputElement | null = null;
    private _formatOverlay: HTMLElement | null = null;

    /**
     * Registrer en navngitt formatter globalt. Brukes deretter via
     * `data-format="<navn>"` på et hvilket som helst ix-field.
     *
     * @example
     * IxField.registerFormatter('orgnr', { format, parse });
     * // <ix-field data-format="orgnr"><input …></ix-field>
     */
    static registerFormatter = registerFormat;

    /**
     * Sett en formatter direkte på instansen (høyest presedens). Lar konsumenten
     * gi vilkårlig format/parse-logikk som ikke kan uttrykkes som attributt.
     */
    set formatter(value: FieldFormatter | null) {
        this._formatterProp = value;
        if (this.isConnected) this._wireFormatting();
    }

    get formatter(): FieldFormatter | null {
        return this._formatterProp;
    }

    /**
     * Den rå (uformaterte) verdien til feltet. Fordi `<input>` alltid holder rå
     * verdi (formateringen er en visuell overlay), er dette bare input-verdien.
     * Tom streng når ingen formatter er aktiv eller det ikke finnes noe input.
     *
     * Praktisk for ren JS/HTML: `document.querySelector('ix-field').rawValue`.
     * Merk at `<form>`-innsending og `new FormData(form)` også gir rå verdi
     * automatisk, siden `input.value` aldri muteres.
     */
    get rawValue(): string {
        return this._activeControl?.value ?? '';
    }

    static get observedAttributes(): string[] {
        return ['tooltip', 'tooltip-label', 'tooltip-placement', 'data-format', 'data-format-pattern'];
    }

    connectedCallback(): void {
        this._wire();
        this._syncTooltip();
        this._wireFormatting();
    }

    disconnectedCallback(): void {
        // Koble fra observer når elementet fjernes fra DOM for å unngå minnelekkasje.
        this._observer?.disconnect();
        this._observer = null;
        this._stateObserver?.disconnect();
        this._stateObserver = null;
        this._teardownCharCount();
        this._teardownFormatting();
    }

    attributeChangedCallback(name: string, _oldValue: string | null, _newValue: string | null): void {
        if (name === 'tooltip' || name === 'tooltip-label' || name === 'tooltip-placement') {
            if (this.isConnected) this._syncTooltip();
        }
        if (name === 'data-format' || name === 'data-format-pattern') {
            if (this.isConnected) this._wireFormatting();
        }
    }

    // ── Kobling ───────────────────────────────────────────────────────────────

    private _wire(): void {
        const control = this.querySelector<NativeControl>('input, select, textarea');
        const label = this.querySelector<HTMLLabelElement>('label');
        const description = this.querySelector<HTMLElement>('[data-field="description"]');
        const error = this.querySelector<HTMLElement>('[data-field="error"]');

        // Uten en native kontroll er det ingenting å koble.
        if (!control) {
            console.info('[ix-field] Fant ingen <input>, <select> eller <textarea>. ARIA-koblinger ble ikke satt opp.');
            return;
        }

        // Synkroniser disabled/readonly-tilstand fra kontroll til ix-field-host slik at
        // CSS-reglene [data-disabled] og [data-readonly] virker uten React.
        // Overvåker også maxlength/minlength: React setter attributtene etter at
        // connectedCallback har kjørt, så tegnteller kan ikke settes opp i _wire() alene.
        this._syncControlState(control);
        this._stateObserver = new MutationObserver((mutations) => {
            this._syncControlState(control);
            const affectsCharCount = mutations.some((m) => m.attributeName === 'maxlength' || m.attributeName === 'minlength');
            if (affectsCharCount && (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) {
                this._teardownCharCount();
                const charCountEl = this._setupCharCount(control);
                if (charCountEl) {
                    const existing = control.getAttribute('aria-describedby') ?? '';
                    const ids = existing ? existing.split(' ') : [];
                    if (!ids.includes(charCountEl.id)) {
                        ids.push(charCountEl.id);
                        control.setAttribute('aria-describedby', ids.join(' '));
                    }
                }
            }
        });
        this._stateObserver.observe(control, { attributes: true, attributeFilter: ['disabled', 'readonly', 'maxlength', 'minlength'] });

        if (import.meta.env.DEV && control instanceof HTMLInputElement && control.type === 'number') {
            console.warn('[ix-field] Unngå type="number" — bruk inputMode="numeric" i stedet.');
        }

        // Gi input en stabil ID hvis den mangler en. ID-en er grunnlaget for
        // alle de øvrige koblingene (label[for], aria-describedby).
        if (!control.id) {
            control.id = `ix-field-${++fieldCounter}`;
        }

        // Wrap label i label-row om den ikke allerede er wrappet.
        // label-row er alltid til stede slik at tooltip-knappen kan injiseres uten
        // å endre DOM-strukturen rundt labelen.
        if (label && !label.closest('.ix-field__label-row')) {
            const labelRow = document.createElement('div');
            labelRow.className = 'ix-field__label-row';
            label.parentNode!.insertBefore(labelRow, label);
            labelRow.appendChild(label);
        }

        // Koble label til input. Sjekker at label ikke allerede har en eksplisitt
        // for-kobling — respekter hva utvikleren har satt manuelt.
        if (label && !label.htmlFor) {
            label.htmlFor = control.id;
        }

        // Et felt uten tilgjengelig navn er ikke operabelt for skjermleserbrukere.
        if (import.meta.env.DEV && !label && !control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
            console.warn('[ix-field] Kontrollen mangler tilgjengelig navn. Legg til <label>, aria-label eller aria-labelledby. Synlig label er anbefalt.');
        }

        // Samle IDer til alle elementer som beskriver input-feltet.
        // Rekkefølgen i aria-describedby er meningsfull: skjermlesere leser dem
        // i rekkefølge, så description (generell hjelpetekst) kommer før error
        // (situasjonsavhengig feil).
        const describedBy: string[] = [];

        if (description) {
            if (!description.id) {
                description.id = `${control.id}-description`;
            }
            describedBy.push(description.id);
        }

        if (error) {
            if (!error.id) {
                error.id = `${control.id}-error`;
            }

            // aria-live="polite" settes av komponenten, ikke av forfatteren.
            // "polite" venter til skjermleseren er ferdig med å lese — i motsetning
            // til role="alert" som impliserer "assertive" og avbryter brukeren.
            error.setAttribute('aria-live', 'polite');
            describedBy.push(error.id);

            // Observer fanger opp alle måter textContent kan endre seg på:
            //   - childList: tekstnoder legges til eller fjernes
            //   - characterData + subtree: eksisterende tekstnoder endres
            this._observer = new MutationObserver(() => {
                this._syncInvalid(control, error);
            });
            this._observer.observe(error, {
                childList: true,
                characterData: true,
                subtree: true,
            });

            // Sett initial aria-invalid-tilstand i tilfelle feilmelding allerede
            // er satt i HTML (f.eks. server-side rendering med valideringsfeil).
            this._syncInvalid(control, error);
        }

        // Sett opp tegnteller hvis kontrollen er et tekstfelt med minlength/maxlength.
        // Merk: React setter attributtene etter connectedCallback, så _stateObserver
        // fanger opp og kjører _setupCharCount på nytt om attributtene mangler her.
        if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) {
            const charCountEl = this._setupCharCount(control);
            if (charCountEl) {
                describedBy.push(charCountEl.id);
            }
        }

        if (describedBy.length > 0) {
            control.setAttribute('aria-describedby', describedBy.join(' '));
        }

        // Prefix og suffix er rent visuelle — skjul dem fra skjermlesere.
        // Konteksten skal ligge i labelteksten.
        const prefix = this.querySelector('[data-field="prefix"]');
        const suffix = this.querySelector('[data-field="suffix"]');

        prefix?.setAttribute('aria-hidden', 'true');
        suffix?.setAttribute('aria-hidden', 'true');

        // Sett data-has-prefix/suffix på .ix-text-field slik at CSS kan fjerne
        // radius på input der prefix/suffix støter inntil.
        const textField = this.querySelector('.ix-text-field');
        if (textField) {
            textField.toggleAttribute('data-has-prefix', !!prefix);
            textField.toggleAttribute('data-has-suffix', !!suffix);
        }
    }

    // Oppretter og kobler tegnteller-element hvis kontrollen har minlength/maxlength.
    // Returnerer elementet slik at kallstedet kan inkludere ID-en i aria-describedby.
    private _setupCharCount(control: TextControl): HTMLElement | null {
        const min = control.getAttribute('minlength');
        const max = control.getAttribute('maxlength');
        if (!min && !max) return null;

        const el = document.createElement('span');
        el.id = `${control.id}-char-count`;
        el.setAttribute('data-field', 'char-count');
        el.setAttribute('aria-live', 'off');

        this._updateCharCount(el, control, min, max);

        // Plasser etter error-elementet, eller sist i ix-field om error mangler.
        const error = this.querySelector('[data-field="error"]');
        if (error?.parentNode) {
            error.parentNode.insertBefore(el, error.nextSibling);
        } else {
            this.appendChild(el);
        }

        this._charCountControl = control;
        this._charCountListener = () => this._updateCharCount(el, control, min, max);
        control.addEventListener('input', this._charCountListener);

        return el;
    }

    private _teardownCharCount(): void {
        if (this._charCountListener && this._charCountControl) {
            this._charCountControl.removeEventListener('input', this._charCountListener);
        }
        this._charCountListener = null;
        this._charCountControl = null;
        this.querySelector('[data-field="char-count"]')?.remove();
    }

    private _updateCharCount(el: HTMLElement, control: TextControl, min: string | null, max: string | null): void {
        const current = control.value.length;
        if (max) {
            el.textContent = `${current}/${max}`;
        } else if (min) {
            el.textContent = `${current} tegn (minimum ${min})`;
        }
    }

    // ── Formatering (opt-in) ─────────────────────────────────────────────────
    //
    // Overlay-basert format-on-blur, IKKE live tegn-maske og IKKE value-swap.
    // Prinsippet:
    //   - `<input>` holder ALLTID den rå verdien og muteres aldri for formatering.
    //     Vi wrapper input i `.ix-text-field__format` og legger et aria-hidden
    //     overlay-span (`.ix-text-field__format-display`) oppå med den formaterte
    //     teksten.
    //   - Ren CSS (`:focus-within`) bytter synlighet: ufokusert vises overlay
    //     (input-tekst gjort gjennomsiktig), fokusert vises rå input-tekst og
    //     overlay skjules. Ingen JS rører verdien.
    //
    // Konsekvens: rå verdi er tilgjengelig gratis overalt — `input.value`,
    // `<form>`-submit, `new FormData(form)` og React `value`/`onChange` gir alt
    // den rå verdien uten separatorer. Ingen caret-hopp, ingen stille avvisning
    // av tastetrykk.

    // Løser opp aktiv formatter etter presedens: property → data-format → data-format-pattern.
    private _resolveFormatter(): FieldFormatter | null {
        if (this._formatterProp) return this._formatterProp;

        const name = this.getAttribute('data-format');
        if (name) {
            const named = resolveFormat(name);
            if (named) return named;
            if (import.meta.env.DEV) {
                console.warn(`[ix-field] Ukjent data-format="${name}". Registrer den med IxField.registerFormatter("${name}", …) eller bruk data-format-pattern.`);
            }
        }

        const pattern = this.getAttribute('data-format-pattern');
        if (pattern) return createPatternFormatter(pattern);

        return null;
    }

    private _wireFormatting(): void {
        this._teardownFormatting();

        const formatter = this._resolveFormatter();
        if (!formatter) return;

        // Kun <input> støttes for formatering (ikke textarea/select).
        const control = this.querySelector<HTMLInputElement>('input');
        if (!control) return;

        this._activeFormatter = formatter;
        this._activeControl = control;

        // Wrap input i .ix-text-field__format (samme mønster som label-row i _wire)
        // om den ikke allerede er wrappet, og legg overlay-spanet etter input.
        let wrapper = control.closest<HTMLElement>('.ix-text-field__format');
        if (!wrapper) {
            wrapper = document.createElement('span');
            wrapper.className = 'ix-text-field__format';
            control.parentNode!.insertBefore(wrapper, control);
            wrapper.appendChild(control);
        }

        const overlay = document.createElement('span');
        overlay.className = 'ix-text-field__format-display';
        overlay.setAttribute('aria-hidden', 'true');
        wrapper.appendChild(overlay);
        this._formatOverlay = overlay;

        // Hold overlay i synk med input-verdien mens brukeren skriver, slik at den
        // formaterte visningen er klar i det feltet mister fokus.
        const onInput = (): void => this._updateOverlay();
        control.addEventListener('input', onInput);

        this._formatTeardown = (): void => {
            control.removeEventListener('input', onInput);
            overlay.remove();
            // Unwrap input: flytt det tilbake ut av wrapperen og fjern wrapperen.
            if (wrapper.parentNode) {
                wrapper.parentNode.insertBefore(control, wrapper);
                wrapper.remove();
            }
            this._activeFormatter = null;
            this._activeControl = null;
            this._formatOverlay = null;
        };

        // Formater eventuell startverdi.
        this._updateOverlay();
    }

    // Skriver den formaterte visningen til overlay-spanet. Input.value er alltid
    // rå, så vi formaterer den direkte. Idempotent — trygg å kalle flere ganger.
    private _updateOverlay(): void {
        const formatter = this._activeFormatter;
        const control = this._activeControl;
        const overlay = this._formatOverlay;
        if (!formatter || !control || !overlay) return;
        overlay.textContent = formatter.format(control.value);
    }

    /**
     * Re-anvender den formaterte overlay-visningen.
     *
     * Nyttig for controlled React: når React skriver den rå prop-verdien til
     * `input.value` ved en re-render, fyres ikke `input`-eventet, så overlay må
     * oppdateres eksplisitt. Kall denne etter commit (f.eks. i `useLayoutEffect`).
     * No-op når ingen formatter er aktiv.
     */
    refreshFormat(): void {
        this._updateOverlay();
    }

    private _teardownFormatting(): void {
        this._formatTeardown?.();
        this._formatTeardown = null;
    }

    // Holder aria-invalid på input synkronisert med om error-elementet har
    // innhold. Kalles både ved initialisering og av MutationObserver ved
    // hver endring. Synkroniserer også data-invalid til .ix-dropdown-container
    // hvis kontrollen er en select inne i en dropdown.
    private _syncInvalid(control: NativeControl, error: HTMLElement): void {
        const hasError = !!error.textContent?.trim();
        if (hasError) {
            control.setAttribute('aria-invalid', 'true');
        } else {
            control.removeAttribute('aria-invalid');
        }
        control.closest('.ix-dropdown')?.toggleAttribute('data-invalid', hasError);
    }

    // Speiler disabled/readonly-tilstanden fra native kontroll til ix-field-host
    // slik at CSS-reglene [data-disabled] og [data-readonly] virker uten React.
    private _syncControlState(control: NativeControl): void {
        this.toggleAttribute('data-disabled', control.disabled);
        const readOnly = 'readOnly' in control ? (control as HTMLInputElement | HTMLTextAreaElement).readOnly : false;
        this.toggleAttribute('data-readonly', readOnly);
    }

    // Synkroniserer tooltip-knappen med tooltip/tooltip-label-attributtene.
    // Kalt fra connectedCallback og attributeChangedCallback.
    private _syncTooltip(): void {
        const content = this.getAttribute('tooltip');
        if (content) {
            this._setupTooltipBtn(content);
        } else {
            this._teardownTooltipBtn();
        }
    }

    // Injiserer info-ikon-knapp i label-row når tooltip-attributt er satt.
    // label-row er alltid til stede etter _wire(), så her er det bare knappen som endres.
    private _setupTooltipBtn(content: string): void {
        const tooltipLabel = this.getAttribute('tooltip-label');
        if (import.meta.env.DEV && !tooltipLabel) {
            console.warn('[ix-field] tooltip er satt uten tooltip-label. Knappen mangler tilgjengelig navn på riktig språk (WCAG 4.1.2). Sett tooltip-label="Mer informasjon" (bokmål), "Meir informasjon" (nynorsk) eller "More information" (engelsk).');
        }

        // Oppdater eksisterende knapp om den allerede finnes
        const existingBtn = this.querySelector<HTMLButtonElement>('.ix-field__tooltip-btn');
        if (existingBtn) {
            existingBtn.setAttribute('data-tooltip', content);
            existingBtn.setAttribute('data-tooltip-placement', this.getAttribute('tooltip-placement') ?? 'top');
            if (tooltipLabel) existingBtn.setAttribute('aria-label', tooltipLabel);
            else existingBtn.removeAttribute('aria-label');
            return;
        }

        const labelRow = this.querySelector<HTMLElement>('.ix-field__label-row');
        if (!labelRow) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ix-field__tooltip-btn';
        btn.setAttribute('data-tooltip', content);
        btn.setAttribute('data-tooltip-placement', this.getAttribute('tooltip-placement') ?? 'top');
        if (tooltipLabel) btn.setAttribute('aria-label', tooltipLabel);

        const icon = document.createElement('span');
        icon.className = 'ix-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.style.maskImage = `url(${ICON_URL})`;
        btn.appendChild(icon);

        labelRow.appendChild(btn);
    }

    // Fjerner kun tooltip-knappen — label-row beholdes.
    private _teardownTooltipBtn(): void {
        this.querySelector('.ix-field__tooltip-btn')?.remove();
    }
}
