import { forwardRef, useCallback, type InputHTMLAttributes, type JSX, type Ref } from 'react';
import { useRadioGroupContext } from './RadioGroupContext';

// Setter samme node på flere refs. Brukes for å gi både RadioButtons egen
// forwardRef og gruppens register-ref (ctx.inputRef) tilgang til inputen.
function setRef<T>(ref: Ref<T> | undefined, node: T): void {
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
}

export type RadioButtonProps = {
    value: string;
    label: string;
    disabled?: boolean;
    className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'size' | 'children' | 'onChange'>;

// React-wrapper for én radio-knapp. WC (ix-radio-group) eier:
//  - id-generering på input + htmlFor på label (når komponenten brukes inni en gruppe)
//  - name-synkronisering (når name ikke er satt)
//  - aria-invalid/aria-required (på host)
//  - disabled-propagering fra group-level disabled
//
// Per-knapp `disabled` settes direkte som HTML-attributt og bevares av WC
// gjennom group disable-toggle (se IxRadioGroup._ownDisabled).
//
// readOnly og required håndteres av <ix-radio-group> på gruppenivå:
//  - readOnly er en no-op på input[type="radio"] — WC blokkerer tastatur i stedet
//  - required settes på første input av WC; aria-required på host
export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(function RadioButton(
    { value, label, disabled, className, id, ...restInputAttrs },
    ref
): JSX.Element {
    const ctx = useRadioGroupContext();
    const name = ctx?.name;
    // I register-modus (uncontrolled) eier RHF/native checked — ikke sett den fra
    // React, ellers slåss React-propen mot RHF sine DOM-skrivinger. Kontrollert
    // modus (value satt) setter checked som før.
    const isChecked = ctx?.uncontrolled ? undefined : ctx?.value !== undefined ? ctx.value === value : undefined;

    // Memoisert så RHF ikke av/reregistrerer refen (churn i _f.refs) hver render.
    const ctxInputRef = ctx?.inputRef;
    const mergedRef = useCallback(
        (node: HTMLInputElement | null) => {
            setRef(ref, node);
            setRef(ctxInputRef, node);
        },
        [ref, ctxInputRef]
    );

    return (
        <div className={className}>
            <input
                // Både RadioButtons egen ref og gruppens register-ref må få noden.
                ref={mergedRef}
                type="radio"
                id={id}
                value={value}
                name={name}
                disabled={disabled}
                checked={isChecked}
                // Videresend det EKTE change-eventet: event.target.value = value, så
                // RHF register/Controller leser verdien nativt.
                onChange={ctx?.onChange}
                onBlur={ctx?.onBlur}
                {...restInputAttrs}
            />
            <label>{label}</label>
        </div>
    );
});
