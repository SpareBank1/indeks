import { cn } from '@/cn';
import {
    forwardRef,
    useState,
    type ChangeEventHandler,
    type FocusEventHandler,
    type ReactNode,
} from 'react';
import { ValidationMessage } from '../validation-message/ValidationMessage';
import { CheckboxButton } from './CheckboxButton';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import { toggleValue } from './toggle-value';

export type CheckboxOption = {
    value: string;
    label: string;
};

export type CheckboxGroupProps = {
    legend: string;
    description?: string;
    errorMessage?: string;
    name?: string;
    value?: string[];
    defaultValue?: string[];
    /**
     * Event-basert change-handler. Får det native checkbox-change-eventet
     * (`event.target.value` = valgets verdi, `event.target.checked` = av/på), så
     * `{...register('felt')}` kan spres rett på komponenten og `<Controller>` binder
     * direkte. RHF samler de avmerkede verdiene til et `string[]`. I kontrollert bruk
     * (uten RHF) bygg selv neste array fra `event.target.value`/`.checked`.
     */
    onChange?: ChangeEventHandler<HTMLInputElement>;
    /** Kalles når fokus forlater en checkbox (RHF touched-state, `mode: 'onBlur'`). */
    onBlur?: FocusEventHandler<HTMLInputElement>;
    disabled?: boolean;
    readOnly?: boolean;
    hideLegend?: boolean;
    className?: string;
    options?: CheckboxOption[];
    children?: ReactNode;
    /** Visuell variant. `'chip'` styler hvert valg som en pill (chip). Standard er vanlig checkbox. */
    variant?: 'chip';
    /** Størrelse — kun relevant for `variant="chip"`. @default "md" */
    size?: 'sm' | 'md';
};

// React-laget er tynt: ix-checkbox-group (WC) eier id, htmlFor, aria-*-koblinger,
// aria-invalid og disabled-propagering til barn-inputs. React-laget eksponerer kun
// props-API, kontrollert array-state (value/onChange) og presentasjons-attributter
// (data-state/className).
//
// Forskjell fra RadioGroup: value er et array (flere kan velges samtidig). onChange
// videresender det ekte checkbox-eventet (ikke det oppdaterte arrayet), så RHF
// register()/Controller kobles likt — RHF leser checked+value fra alle inputs som
// deler name og bygger string[]. Ingen orientation — checkbox-grupper vises alltid
// som vertikal liste (chip-varianten wrapper på rad via CSS).
//
// Tre koblingsmodi (som RadioGroup). Standarden er RHF (register), men du skal kunne
// velge det bort med `value` eller `defaultValue`:
//  - Kontrollert: `value` satt → React styrer checked, `onChange` rapporterer endring.
//    Kontrollert VINNER over en ref: `value` er det eksplisitte «jeg styrer dette selv»-
//    signalet, så en ref (f.eks. for å scrolle til feltet) slår ikke på register-modus.
//  - Register (RHF): `ref` satt UTEN `value` (`{...register()}` spres). RHF eier checked
//    via de native refene; React setter ikke checked (uncontrolled i context).
//  - Ren uncontrolled: kun `defaultValue` (ingen ref) → intern array-state styrer checked.
// `ref != null && !isControlled` skiller register fra kontrollert/ren uncontrolled.
// Merk: `defaultValue` + en bar ref (uncontrolled + DOM-håndtak, uten RHF) leses fortsatt
// som register — en enslig ref er tvetydig. Sjeldent; dekket av dokumentasjon.
export const CheckboxGroup = forwardRef<HTMLInputElement, CheckboxGroupProps>(function CheckboxGroup(
    {
        legend,
        description,
        errorMessage,
        name,
        value: controlledValue,
        defaultValue,
        onChange,
        onBlur,
        disabled,
        readOnly,
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
    const isRegister = ref != null && !isControlled;
    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? []);
    const value = isControlled ? controlledValue : isRegister ? undefined : uncontrolledValue;

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!isControlled && !isRegister) {
            setUncontrolledValue((prev) => toggleValue(prev, event));
        }
        onChange?.(event);
    };

    const dataState = errorMessage ? 'error' : readOnly ? 'readonly' : disabled ? 'disabled' : undefined;
    const renderedChildren = options
        ? options.map((option) => (
              <CheckboxButton key={option.value} value={option.value} label={option.label} />
          ))
        : children;

    return (
        <ix-checkbox-group
            name={name}
            class={cn(className) || undefined}
            data-variant={variant}
            data-size={variant === 'chip' && size !== 'md' ? size : undefined}
            data-state={dataState}
            disabled={disabled || undefined}
            readonly={readOnly || undefined}
        >
            <span data-field="legend" className={hideLegend ? 'ix-sr-only' : undefined}>
                {readOnly && <ix-icon name="lock" />}
                {legend}
            </span>
            {description && <p data-field="description">{description}</p>}
            <div data-field="items">
                <CheckboxGroupContext.Provider
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
                </CheckboxGroupContext.Provider>
            </div>
            <ValidationMessage>{errorMessage}</ValidationMessage>
        </ix-checkbox-group>
    );
});
