import { createContext, useContext, type ChangeEventHandler, type FocusEventHandler, type Ref } from 'react';

export type RadioGroupContextValue = {
    name?: string;
    /** Kontrollert valgt verdi. Utelates i uncontrolled/register-modus. */
    value?: string;
    /**
     * Event-basert change-handler som rutes til hver native radio-input. Får det
     * ekte change-eventet (`event.target.value` = valgt verdi), så React Hook Form
     * `register()` og `<Controller>` binder likt via `event.target.value`.
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
     * Når true setter RadioButton IKKE `checked` — RHF/native eier DOM-checked
     * (register-modus). Kontrollert modus (value satt) setter checked som før.
     */
    uncontrolled?: boolean;
};

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext(): RadioGroupContextValue | null {
    return useContext(RadioGroupContext);
}
