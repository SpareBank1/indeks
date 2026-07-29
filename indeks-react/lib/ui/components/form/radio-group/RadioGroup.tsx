import clsx from 'clsx';
import {
    forwardRef,
    useState,
    type ChangeEventHandler,
    type FocusEventHandler,
    type ReactNode,
} from 'react';
import { ValidationMessage } from '../validation-message/ValidationMessage';
import { RadioButton } from './RadioButton';
import { RadioGroupContext } from './RadioGroupContext';

export type RadioOption = {
    value: string;
    label: string;
};

export type RadioGroupProps = {
    legend: string;
    description?: string;
    errorMessage?: string;
    name?: string;
    value?: string;
    defaultValue?: string;
    /**
     * Event-basert change-handler. Får det native radio-change-eventet
     * (`event.target.value` = valgt verdi), så `{...register('felt')}` kan spres
     * rett på komponenten og `<Controller>` binder `field.onChange` direkte.
     */
    onChange?: ChangeEventHandler<HTMLInputElement>;
    /** Kalles når fokus forlater en radio (RHF touched-state, `mode: 'onBlur'`). */
    onBlur?: FocusEventHandler<HTMLInputElement>;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    orientation?: 'vertical' | 'horizontal';
    hideLegend?: boolean;
    className?: string;
    options?: RadioOption[];
    children?: ReactNode;
    /** Visuell variant. `'chip'` styler hvert valg som en pill (chip). Standard er vanlig radioknapp. */
    variant?: 'chip';
    /** Størrelse — kun relevant for `variant="chip"`. @default "md" */
    size?: 'sm' | 'md';
};

// React-laget er tynt: ix-radio-group (WC) eier id, name, htmlFor, aria-*-koblinger,
// aria-invalid, aria-required, og disabled-propagering til barn-inputs. React-laget
// eksponerer kun props-API, kontrollert state (value/onChange) og presentasjons-
// attributter (data-state/data-orientation/className).
//
// Tre koblingsmodi. Standarden er RHF (register) — `{...register()}` skal virke uten
// ekstra props — men du skal kunne velge det bort med `value` eller `defaultValue`:
//  - Kontrollert: `value` satt → React styrer checked, `onChange` rapporterer endring.
//    Kontrollert VINNER over en ref: `value` er det eksplisitte «jeg styrer dette selv»-
//    signalet, så en ref (f.eks. for å scrolle til feltet) slår ikke på register-modus.
//  - Register (RHF): `ref` satt UTEN `value` (`{...register()}` spres). RHF eier checked
//    via de native radio-refene; React setter ikke checked (uncontrolled i context).
//  - Ren uncontrolled: kun `defaultValue` (ingen ref) → intern state styrer checked.
// `ref != null && !isControlled` skiller register fra kontrollert/ren uncontrolled.
// Merk: `defaultValue` + en bar ref (uncontrolled + DOM-håndtak, uten RHF) leses fortsatt
// som register — en enslig ref er tvetydig. Sjeldent; dekket av dokumentasjon.
export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(function RadioGroup(
    {
        legend,
        description,
        errorMessage,
        name,
        value: controlledValue,
        defaultValue,
        onChange,
        onBlur,
        required,
        disabled,
        readOnly,
        orientation,
        hideLegend,
        className,
        options,
        children,
        variant,
        size = 'md',
    },
    ref
) {
    const isControlled = controlledValue !== undefined;
    // Kontrollert vinner over ref: `value` er det eksplisitte opt-out-signalet, så en
    // ref alene slår ikke på register-modus når konsumenten styrer verdien selv.
    const isRegister = ref != null && !isControlled;
    // Intern state kun for ren uncontrolled bruk (defaultValue uten RHF). I
    // register-modus eier RHF/native checked, så vi holder ingen React-state.
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const value = isControlled ? controlledValue : isRegister ? undefined : uncontrolledValue;

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!isControlled && !isRegister) {
            setUncontrolledValue(event.target.value);
        }
        onChange?.(event);
    };

    const dataState = errorMessage ? 'error' : readOnly ? 'readonly' : disabled ? 'disabled' : undefined;
    const renderedChildren = options
        ? options.map((option) => (
              <RadioButton key={option.value} value={option.value} label={option.label} />
          ))
        : children;

    return (
        <ix-radio-group
            name={name}
            class={clsx(className) || undefined}
            data-variant={variant}
            data-size={variant === 'chip' && size !== 'md' ? size : undefined}
            data-orientation={orientation !== 'vertical' ? orientation : undefined}
            data-state={dataState}
            disabled={disabled || undefined}
            readonly={readOnly || undefined}
            required={required || undefined}
        >
            <span data-field="legend" className={hideLegend ? 'ix-sr-only' : undefined}>
                {readOnly && <ix-icon name="lock" />}
                {legend}
            </span>
            {description && <p data-field="description">{description}</p>}
            <div data-field="items">
                <RadioGroupContext.Provider
                    value={{
                        name,
                        value,
                        onChange: handleChange,
                        onBlur,
                        inputRef: ref,
                        uncontrolled: isRegister,
                    }}
                >
                    {renderedChildren}
                </RadioGroupContext.Provider>
            </div>
            <ValidationMessage>{errorMessage}</ValidationMessage>
        </ix-radio-group>
    );
});
