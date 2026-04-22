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

type NativeControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type TextControl = HTMLInputElement | HTMLTextAreaElement;

// Globalt teller for å garantere unike IDer på tvers av alle ix-field-instanser
// på siden. Enkel og deterministisk — ingen UUID-avhengighet nødvendig.
let fieldCounter = 0;

export class IxField extends HTMLElement {
    // MutationObserver holdes som instansvariabel slik at den kan kobles fra
    // i disconnectedCallback og ikke lekke minne når elementet fjernes fra DOM.
    private _observer: MutationObserver | null = null;
    private _stateObserver: MutationObserver | null = null;
    private _charCountListener: (() => void) | null = null;
    private _charCountControl: TextControl | null = null;

    connectedCallback(): void {
        this._wire();
    }

    disconnectedCallback(): void {
        // Koble fra observer når elementet fjernes fra DOM for å unngå minnelekkasje.
        this._observer?.disconnect();
        this._observer = null;
        this._stateObserver?.disconnect();
        this._stateObserver = null;
        this._teardownCharCount();
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

        if (control instanceof HTMLInputElement && control.type === 'number') {
            console.warn('[ix-field] Unngå type="number" — bruk inputMode="numeric" i stedet.');
        }

        // Gi input en stabil ID hvis den mangler en. ID-en er grunnlaget for
        // alle de øvrige koblingene (label[for], aria-describedby).
        if (!control.id) {
            control.id = `ix-field-${++fieldCounter}`;
        }

        // Koble label til input. Sjekker at label ikke allerede har en eksplisitt
        // for-kobling — respekter hva utvikleren har satt manuelt.
        if (label && !label.htmlFor) {
            label.htmlFor = control.id;
        }

        // Et felt uten tilgjengelig navn er ikke operabelt for skjermleserbrukere.
        if (!label && !control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
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
}
