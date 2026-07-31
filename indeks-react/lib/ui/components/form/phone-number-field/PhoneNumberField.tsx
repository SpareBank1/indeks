import { forwardRef, useId, type Ref } from 'react';
import type { IxPhoneNumberField as IxPhoneNumberFieldElement } from '@sb1/indeks-web';
import { Combobox } from '../combobox/Combobox';
import { TextField, type FieldFormatter } from '../text-field/TextField';

/**
 * Én React Hook Form-registrering (`{...register('felt')}`). Struktur-type — pakka
 * har INGEN RHF-avhengighet; alt som matcher formen (name/onChange/onBlur/ref)
 * fungerer, også en manuell `<Controller>`-kobling eller egne handlers. Spres rett
 * på hvert delfelt: PhoneNumberField er to uavhengige RHF-felt (landkode + nummer).
 *
 * `onChange`/`onBlur` bruker `event: any` med vilje — akkurat som RHFs egen
 * `ChangeHandler` — slik at én registrering kan spres på BÅDE den indre Combobox
 * (som sender et syntetisk `ComboboxChangeEvent`) og den indre TextField (native
 * event). En konkret `ChangeEvent<HTMLInputElement>`-signatur ville kollidert med
 * Combobox' event-type under `strictFunctionTypes`.
 */
export type FieldRegistration = {
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (event: any) => unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onBlur?: (event: any) => unknown;
    // `ref` treffer host-elementet i hvert delfelt (IxCombobox / HTMLInputElement-proxy).
    // Løst typet (som RHFs egen `RefCallBack`) så samme registrering kan spres på begge.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref?: Ref<any>;
};

/**
 * Landvalg for PhoneNumberField. `value` er landkoden (uten `+`), `label` er
 * kalle-koden (`+47`, primærtekst) og `description` er landnavnet (sekundær).
 * Utelates → web-komponenten fyller inn sin innebygde, lokaliserbare landliste.
 */
export type CountryOption = {
    value: string;
    label: string;
    description?: string;
};

/** Språk for den innebygde landlista i web-komponenten. */
export type CountryLocale = 'nb' | 'nn' | 'en';

export type PhoneNumberFieldProps = {
    /** Synlig felles label over begge feltene (f.eks. «Mobilnummer»). */
    label: string;
    /** Felles hjelpetekst under label. */
    description?: string;
    /**
     * Valideringsmelding for NUMMER-feltet. Tom → ingen feil. De to delfeltene er
     * uavhengige RHF-felt, så feil vises per felt: `errorMessage` under nummeret,
     * `countryErrorMessage` under landvelgeren. Bruk `errors.tlf?.message` her.
     */
    errorMessage?: string;
    /**
     * Valideringsmelding for LANDKODE-feltet. Tom → ingen feil. Vises under
     * landvelgeren, uavhengig av nummer-feltets `errorMessage`. Bruk
     * `errors.landkode?.message` her.
     */
    countryErrorMessage?: string;

    /** Tilgjengelig navn på landvelgeren (i18n, f.eks. «Landkode»). */
    countryLabel: string;
    /** Tilgjengelig navn på nummerfeltet (i18n, f.eks. «Telefonnummer»). */
    numberLabel: string;
    /**
     * Placeholder i nummerfeltet. **Frarådes** — placeholder er et a11y-antimønster
     * (forsvinner ved skriving, svak kontrast, ingen labelerstatning). Bruk
     * `description` for hjelpetekst/format-hint i stedet.
     */
    placeholder?: string;
    /** Tekst i landlista når filteret gir 0 treff (i18n — konsumenten oversetter). */
    noHitsText: string;
    /** aria-label på landvelgerens chevron-knapp (i18n). */
    toggleLabel?: string;
    /** Mal for skjermleser-annonsering av antall treff i landlista (i18n), `{n}` = antall. */
    resultsText?: string;

    /**
     * RHF-registrering for LANDKODE-feltet: `countryField={register('landkode')}`.
     * Spres på den indre landvelgeren (Combobox), som er register-kompatibel.
     * `onChange` får et syntetisk change-event med landkoden (uten `+`) i
     * `event.target.value`. Utelates → feltet er ukontrollert (bruk
     * `defaultCountryCode` for forhåndsvalg).
     */
    countryField?: FieldRegistration;
    /** Forhåndsvalgt landkode (uten `+`, f.eks. `"47"`) når `countryField` ikke eier verdien. */
    defaultCountryCode?: string;

    /**
     * RHF-registrering for NUMMER-feltet: `numberField={register('tlf')}`. Spres på
     * det indre nummer-feltet (TextField i formatter-modus), som er register-kompatibelt.
     * `onChange` får et syntetisk change-event med RÅ nummer (uten separatorer) i
     * `event.target.value`. Utelates → feltet er ukontrollert (bruk `defaultValue`).
     */
    numberField?: FieldRegistration;
    /** Ukontrollert start-nummer (rå verdi) når `numberField` ikke eier verdien. */
    defaultValue?: string;

    /**
     * Landliste. Utelates → web-komponenten fyller inn sin innebygde standardliste
     * (Norge → Norden → alfabetisk) i språket fra `locale`. Send inn egen liste
     * for å utvide/begrense (serialiseres til `data-countries` på web-komponenten).
     */
    countries?: CountryOption[];
    /** Språk for den innebygde standard-landlista. @default 'nb' */
    locale?: CountryLocale;

    /**
     * Formaterer nummeret. @default `"phone"` (norsk 8-sifret `123 45 678`).
     * Formatet er norsk-spesifikt; per-land-formatering er utenfor v1-scope —
     * send eget format/pattern for andre land. Endring av landkode reformaterer
     * ikke nummeret (formatet er uavhengig av valgt land).
     */
    numberFormat?: string | FieldFormatter;
    /** Pattern-streng for nummer-formatering (`0`=siffer). Alternativ til `numberFormat`. */
    numberFormatPattern?: string;
    /** Overstyrer nummer-formatterens live-modus. */
    numberFormatLive?: boolean;

    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    className?: string;
    id?: string;
};

// React-laget er tynt: <ix-phone-number-field> (WC) eier alt innholds-relatert —
// gruppe-ARIA (role=group, aria-labelledby/describedby, aria-invalid), propagering
// av disabled/readonly/required, landlista (injiseres i den tomme <Combobox>),
// forhåndsvalg, nummer-feltets standardattributter (type=tel, inputmode, autocomplete,
// data-format) og data-state. React videresender kun config: i18n-tekster, verdier og
// data-*-attributter. De to feltene er de eksisterende <Combobox> og <TextField> — all
// deres ARIA, filtrering, virtual focus, formatering og form-synk gjenbrukes urørt.
export const PhoneNumberField = forwardRef<IxPhoneNumberFieldElement, PhoneNumberFieldProps>(function PhoneNumberField(
    {
        label,
        description,
        errorMessage,
        countryErrorMessage,
        countryLabel,
        numberLabel,
        placeholder,
        noHitsText,
        toggleLabel,
        resultsText,
        countryField,
        defaultCountryCode,
        numberField,
        defaultValue,
        countries,
        locale = 'nb',
        numberFormat = 'phone',
        numberFormatPattern,
        numberFormatLive,
        disabled,
        readOnly,
        required,
        className,
        id,
    },
    ref
) {
    const generatedId = useId();
    const groupId = id ?? generatedId;
    const legendId = `${groupId}-legend`;

    return (
        <ix-phone-number-field
            ref={ref}
            id={groupId}
            class={className}
            disabled={disabled || undefined}
            readonly={readOnly || undefined}
            required={required || undefined}
            data-locale={locale}
            data-default-country-code={defaultCountryCode}
            data-countries={countries ? JSON.stringify(countries) : undefined}
        >
            <span data-field="legend" id={legendId}>
                {label}
            </span>
            {description && <span data-field="description">{description}</span>}
            <div data-field="items">
                <div data-field="country">
                    {/* Tom options-liste: web-komponenten injiserer landlista og
                        forhåndsvalg (fra data-default-country-code på host).
                        `{...countryField}` spres for RHF-binding (name/onChange/onBlur/ref)
                        — Combobox er register-kompatibel, så ingen adapter trengs. */}
                    <Combobox
                        ariaLabel={countryLabel}
                        options={[]}
                        defaultValue={defaultCountryCode}
                        {...countryField}
                        errorMessage={countryErrorMessage}
                        noHitsText={noHitsText}
                        toggleLabel={toggleLabel}
                        resultsText={resultsText}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                <div data-field="number">
                    {/* type/inputmode/autocomplete/data-format stampes av web-komponenten.
                        format sendes fra React så TextFields formatter-modus (proxy-ref +
                        rå-mirror) beholdes. `{...numberField}` spres for RHF-binding —
                        onChange/ref gir RÅ nummer. */}
                    <TextField
                        ariaLabel={numberLabel}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        {...numberField}
                        errorMessage={errorMessage}
                        format={numberFormat}
                        formatPattern={numberFormatPattern}
                        formatLive={numberFormatLive}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
            </div>
        </ix-phone-number-field>
    );
});
