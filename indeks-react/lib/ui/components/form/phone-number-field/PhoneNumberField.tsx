import { forwardRef, useId, type Ref } from 'react';
import type { IxPhoneNumberField as IxPhoneNumberFieldElement } from '@sb1/indeks-web';
import { TextField, type FieldFormatter } from '../text-field/TextField';
import { ValidationMessage } from '../validation-message/ValidationMessage';

/**
 * Én React Hook Form-registrering (`{...register('felt')}`). Struktur-type, så
 * pakka har ingen RHF-avhengighet. Spres rett på hvert delfelt: PhoneNumberField
 * er to uavhengige RHF-felt (landkode og nummer).
 *
 * `event: any` som i RHFs egen `ChangeHandler`, så samme registrering passer
 * både det vanlige landkodefeltet og nummerfeltet i formatter-modus.
 */
export type FieldRegistration = {
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (event: any) => unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onBlur?: (event: any) => unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref?: Ref<any>;
};

type CountryCodeProps =
    | {
          /** Tilgjengelig navn på landkodefeltet (i18n, f.eks. «Landkode»). */
          countryLabel: string;
          /**
           * RHF-registrering for landkoden: `countryField={register('landkode')}`.
           * Verdien er sifrene uten `+`, f.eks. `"47"`.
           */
          countryField?: FieldRegistration;
          /** Landkoden feltet starter med, uten `+`. @default "47" */
          defaultCountryCode?: string;
          /** Låser landkoden: feltet vises, men er skrivebeskyttet. */
          countryCodeReadOnly?: boolean;
          hideCountryCode?: false;
      }
    | {
          /**
           * Skjuler landkoden helt, så bare nummerfeltet vises. Landkoden
           * må da settes i koden som tar imot verdien.
           */
          hideCountryCode: true;
          countryLabel?: never;
          countryField?: never;
          defaultCountryCode?: never;
          countryCodeReadOnly?: never;
      };

type PhoneNumberFieldOwnProps = {
    /** Synlig felles label over feltene (f.eks. «Mobilnummer»). */
    label: string;
    /** Felles hjelpetekst under label. */
    description?: string;
    /**
     * Én valideringsmelding for hele gruppen. Tom gir ingen feil. Med to
     * RHF-felt velger du den viktigste, f.eks.
     * `errors.landkode?.message ?? errors.tlf?.message`.
     */
    errorMessage?: string;

    /** Tilgjengelig navn på nummerfeltet (i18n, f.eks. «Telefonnummer»). */
    numberLabel: string;
    /**
     * Placeholder i nummerfeltet. **Frarådes**: den forsvinner ved skriving og
     * har svak kontrast. Bruk `description` for format-hint.
     */
    placeholder?: string;

    /**
     * RHF-registrering for nummeret: `numberField={register('tlf')}`.
     * `event.target.value` er det rå nummeret, uten mellomrom.
     */
    numberField?: FieldRegistration;
    /** Ukontrollert start-nummer (rå verdi) når `numberField` ikke eier verdien. */
    defaultValue?: string;

    /**
     * Formaterer nummeret. @default `"phone"` (norsk 8-sifret `123 45 678`).
     * Formatet følger ikke landkoden; send eget format for andre land.
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
} & CountryCodeProps;

/**
 * Øvrige attributter spres på `<ix-phone-number-field>`, ikke på delfeltene.
 * Web componenten eier gruppe-ARIA.
 */
export type PhoneNumberFieldProps = PhoneNumberFieldOwnProps &
    Omit<React.HTMLAttributes<HTMLElement>, keyof PhoneNumberFieldOwnProps | 'children'>;

// Tynt lag: <ix-phone-number-field> eier gruppe-ARIA, aria-invalid, propagering
// av disabled/readonly/required, standardattributtene på inputene og at
// landkoden bare tar sifre. Feltene er vanlige <TextField>.
export const PhoneNumberField = forwardRef<IxPhoneNumberFieldElement, PhoneNumberFieldProps>(function PhoneNumberField(
    {
        label,
        description,
        errorMessage,
        countryLabel,
        countryField,
        defaultCountryCode = '47',
        countryCodeReadOnly,
        hideCountryCode,
        numberLabel,
        placeholder,
        numberField,
        defaultValue,
        numberFormat = 'phone',
        numberFormatPattern,
        numberFormatLive,
        disabled,
        readOnly,
        required,
        className,
        id,
        ...restProps
    },
    ref
) {
    const generatedId = useId();
    const groupId = id ?? generatedId;

    return (
        <ix-phone-number-field
            {...restProps}
            ref={ref}
            id={groupId}
            class={className}
            disabled={disabled || undefined}
            readonly={readOnly || undefined}
            required={required || undefined}
        >
            <span data-field="legend" id={`${groupId}-legend`}>
                {label}
            </span>
            {description && <span data-field="description">{description}</span>}
            <div data-field="items">
                {!hideCountryCode && (
                    <div data-field="country">
                        <TextField
                            ariaLabel={countryLabel}
                            prefix="+"
                            defaultValue={defaultCountryCode}
                            {...countryField}
                            disabled={disabled}
                            readOnly={readOnly || countryCodeReadOnly}
                        />
                    </div>
                )}
                <div data-field="number">
                    {/* format sendes herfra, så TextField holder seg i formatter-modus
                        og onChange gir rå nummer. */}
                    <TextField
                        ariaLabel={numberLabel}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        {...numberField}
                        format={numberFormat}
                        formatPattern={numberFormatPattern}
                        formatLive={numberFormatLive}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
            </div>
            <ValidationMessage>{errorMessage}</ValidationMessage>
        </ix-phone-number-field>
    );
});
