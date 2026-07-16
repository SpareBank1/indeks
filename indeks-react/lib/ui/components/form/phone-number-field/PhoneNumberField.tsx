import { forwardRef, useId, useMemo } from 'react';
import type { IxPhoneNumberField as IxPhoneNumberFieldElement } from '@sb1/indeks-web';
import { Combobox } from '../combobox/Combobox';
import { TextField, type FieldFormatter } from '../text-field/TextField';
import { ValidationMessage } from '../validation-message/ValidationMessage';
import { type CountryLocale, type CountryOption, getDefaultCountries } from './countries';

export type { CountryOption, CountryLocale };
export { getDefaultCountries };

export type PhoneNumberFieldProps = {
    /** Synlig felles label over begge feltene (f.eks. «Mobilnummer»). */
    label: string;
    /** Felles hjelpetekst under label. */
    description?: string;
    /** Felles valideringsmelding for hele komponenten. Tom → ingen feil. */
    errorMessage?: string;

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

    /** Kontrollert landkode (uten `+`, f.eks. `"47"`). */
    countryCode?: string;
    /** Ukontrollert start-landkode. */
    defaultCountryCode?: string;
    /** Kalles med ny landkode når bruker velger et land. */
    onCountryCodeChange?: (countryCode: string) => void;

    /** Kontrollert nummer (rå verdi uten separatorer). */
    value?: string;
    /** Ukontrollert start-nummer (rå verdi). */
    defaultValue?: string;
    /** Kalles med rå nummer-verdi (uten separatorer) når feltet endres. */
    onChange?: (value: string) => void;

    /**
     * Landliste. Utelates → innebygd standardliste (Norge → Norden → alfabetisk)
     * i språket fra `locale`. Send inn egen liste for å utvide/begrense.
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
    /** Navn på nummerfeltet ved form-innsending. */
    name?: string;
    /** Navn på landkode-feltet ved form-innsending. */
    countryName?: string;
    className?: string;
    id?: string;
};

// React-laget er tynt: <ix-phone-number-field> (WC) eier gruppe-ARIA (role=group,
// aria-labelledby/describedby, aria-invalid, disabled/readonly-propagering). De to
// feltene er de eksisterende <Combobox> og <TextField> — all deres ARIA, filtrering,
// virtual focus, formatering og form-synk gjenbrukes urørt. Denne komponenten legger
// kun til felles label/feilmelding og side-ved-side-layout.
export const PhoneNumberField = forwardRef<IxPhoneNumberFieldElement, PhoneNumberFieldProps>(function PhoneNumberField(
    {
        label,
        description,
        errorMessage,
        countryLabel,
        numberLabel,
        placeholder,
        noHitsText,
        toggleLabel,
        resultsText,
        countryCode,
        defaultCountryCode,
        onCountryCodeChange,
        value,
        defaultValue,
        onChange,
        countries,
        locale = 'nb',
        numberFormat = 'phone',
        numberFormatPattern,
        numberFormatLive,
        disabled,
        readOnly,
        required,
        name,
        countryName,
        className,
        id,
    },
    ref
) {
    const generatedId = useId();
    const groupId = id ?? generatedId;
    const legendId = `${groupId}-legend`;

    const options = useMemo(
        () => countries ?? getDefaultCountries(locale),
        [countries, locale]
    );

    const dataState = errorMessage ? 'error' : readOnly ? 'readonly' : disabled ? 'disabled' : undefined;

    return (
        <ix-phone-number-field
            ref={ref}
            id={groupId}
            class={className}
            data-state={dataState}
            disabled={disabled || undefined}
            readonly={readOnly || undefined}
        >
            <span data-field="legend" id={legendId}>
                {label}
            </span>
            {description && <span data-field="description">{description}</span>}
            <div data-field="items">
                <div data-field="country">
                    <Combobox
                        ariaLabel={countryLabel}
                        options={options}
                        name={countryName}
                        value={countryCode}
                        defaultValue={defaultCountryCode}
                        onChange={(v) => onCountryCodeChange?.(Array.isArray(v) ? (v[0] ?? '') : v)}
                        noHitsText={noHitsText}
                        toggleLabel={toggleLabel}
                        resultsText={resultsText}
                        required={required}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                <div data-field="number">
                    <TextField
                        ariaLabel={numberLabel}
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder={placeholder}
                        name={name}
                        value={value}
                        defaultValue={defaultValue}
                        onChange={(e) => onChange?.(e.target.value)}
                        format={numberFormat}
                        formatPattern={numberFormatPattern}
                        formatLive={numberFormatLive}
                        disabled={disabled}
                        readOnly={readOnly}
                        required={required}
                    />
                </div>
            </div>
            <ValidationMessage>{errorMessage}</ValidationMessage>
        </ix-phone-number-field>
    );
});
