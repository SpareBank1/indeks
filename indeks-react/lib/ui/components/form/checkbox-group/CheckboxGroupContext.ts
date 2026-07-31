import { createContext, useContext, type ChangeEventHandler, type FocusEventHandler, type Ref } from 'react';

export type CheckboxGroupContextValue = {
    name?: string;
    /** Kontrollert valgt array. Utelates i uncontrolled/register-modus. */
    value?: string[];
    /**
     * Event-basert change-handler som rutes til hver native checkbox-input. Får det
     * ekte change-eventet (`event.target.value` = valgets verdi, `event.target.checked`
     * = av/på), så React Hook Form `register()` og `<Controller>` binder likt. RHF
     * samler de avmerkede verdiene til et `string[]` ved å lese `checked`+`value` fra
     * alle inputs som deler `name`.
     */
    onChange?: ChangeEventHandler<HTMLInputElement>;
    /** RHF sin onBlur (touched-state), videresendt til hver input. */
    onBlur?: FocusEventHandler<HTMLInputElement>;
    /**
     * RHF sin ref fra `register()`. Samme ref-objekt settes på alle inputs i
     * gruppen; RHF akkumulerer dem til `_f.refs` og leser checked derfra.
     */
    inputRef?: Ref<HTMLInputElement>;
    /**
     * Når true setter CheckboxButton IKKE `checked` — RHF/native eier DOM-checked
     * (register-modus). Kontrollert modus (value satt) setter checked som før.
     */
    uncontrolled?: boolean;
};

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroupContext(): CheckboxGroupContextValue | null {
    return useContext(CheckboxGroupContext);
}
