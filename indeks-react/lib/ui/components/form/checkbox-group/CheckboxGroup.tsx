import { cn } from '../../../../cn';
import {
    forwardRef,
    useEffect,
    useState,
    type ChangeEventHandler,
    type FocusEventHandler,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import { ValidationMessage } from '../validation-message/ValidationMessage';
import { CheckboxButton } from './CheckboxButton';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import { toggleValue } from './toggle-value';

export type CheckboxOption = {
    value: string;
    label: string;
    /**
     * Eget `name` på denne checkboxen, for skjemaer der hvert valg er sitt eget
     * felt (`nettbank=on`) framfor flere verdier under ett navn. Utelates når
     * gruppen har `name` — se forklaringen på `name` der.
     *
     * `value` må fortsatt være unik per valg utenfor register-modus: kontrollert
     * og ukontrollert modus sporer avkryssing på `value`, så to valg med samme
     * verdi toggler i takt.
     */
    name?: string;
};

/*
 * Extender HTMLAttributes så host-elementet kan få `id`, `tabIndex`, `data-*`
 * og `aria-*` som alle andre elementer — se den samme forklaringen i
 * RadioGroup.tsx. `onChange`/`onBlur` er utelatt fra arven fordi de har
 * snevrere signatur her (input-eventer, ikke generiske element-eventer), og
 * `defaultValue` fordi den er et `string[]` (flere valg) og ikke DOM-ens streng.
 *
 * `aria-describedby` kommer ikke gjennom — web-komponenten eier den. Bruk
 * `description`. Se RadioGroup.tsx.
 */
export interface CheckboxGroupProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'onBlur' | 'defaultValue'> {
    legend: string;
    description?: string;
    errorMessage?: string;
    /**
     * Felles `name` for alle valgene, så de sendes inn som flere verdier under
     * ett felt. Skal hvert valg være sitt eget felt i stedet, dropp denne og sett
     * `name` per option. Setter du begge, vinner denne.
     */
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
    options?: CheckboxOption[];
    children?: ReactNode;
    /** Visuell variant. `'chip'` styler hvert valg som en pill (chip). Standard er vanlig checkbox. */
    variant?: 'chip';
    /** Størrelse — kun relevant for `variant="chip"`. @default "md" */
    size?: 'sm' | 'md';
}

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
        ...rest
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

    // De to name-modellene utelukker hverandre: har gruppen `name`, overskriver
    // web-komponenten alle input-navn med den ved mount, så per-valg-navnene blir
    // borte uten spor. Si det i dev framfor å la utvikleren lete.
    const hasOptionName = options?.some((option) => option.name) ?? false;
    // Kontrollert og ren uncontrolled modus sporer avkryssing på `value` (medlemskap
    // i arrayet). Deler to valg verdi, slår de av og på i takt. Per-valg-`name`
    // frister til `value="on"` overalt, så si det her framfor å la utvikleren feilsøke
    // to checkboxer som følger hverandre.
    const hasDuplicateValue = options ? new Set(options.map((option) => option.value)).size < options.length : false;
    useEffect(() => {
        if (!import.meta.env.DEV) return;
        if (name && hasOptionName) {
            console.warn(
                `<CheckboxGroup name="${name}"> har også name på enkeltvalg. Gruppens name overskriver dem — velg én av modellene.`
            );
        }
        if (hasDuplicateValue && !isRegister) {
            console.warn(
                '<CheckboxGroup> har flere options med samme value. Kontrollert og ukontrollert modus sporer avkryssing på value, så de toggler i takt. Gi hvert valg egen value, eller koble gruppen med register().'
            );
        }
    }, [name, hasOptionName, hasDuplicateValue, isRegister]);

    const dataState = errorMessage ? 'error' : readOnly ? 'readonly' : disabled ? 'disabled' : undefined;
    const renderedChildren = options
        ? options.map((option) => (
              // Nøkkelen er navnet når valget har eget: i den modellen deler valgene
              // typisk `value="on"`, så `value` alene er ikke unik.
              <CheckboxButton
                  key={option.name ?? option.value}
                  value={option.value}
                  label={option.label}
                  name={option.name}
              />
          ))
        : children;

    return (
        // `rest` spres FØRST — se forklaringen i RadioGroup.tsx.
        <ix-checkbox-group
            {...rest}
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
