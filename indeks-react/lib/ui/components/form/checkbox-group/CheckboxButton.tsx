import { forwardRef, useCallback, type InputHTMLAttributes, type JSX, type Ref } from 'react';
import { useCheckboxGroupContext } from './CheckboxGroupContext';

// Setter samme node på flere refs. Brukes for å gi både CheckboxButtons egen
// forwardRef og gruppens register-ref (ctx.inputRef) tilgang til inputen.
function setRef<T>(ref: Ref<T> | undefined, node: T): void {
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
}

export type CheckboxButtonProps = {
    value: string;
    label: string;
    disabled?: boolean;
    className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'size' | 'children' | 'onChange'>;

// React-wrapper for én checkbox i en gruppe. Rendrer .ix-checkbox-strukturen
// (input + label som søsken; indikatoren tegnes som pseudo-element på label av
// checkbox.css). WC (ix-checkbox-group) eier id-generering, htmlFor-kobling og
// name-propagering fra host.
//
// Flere kan velges samtidig: checked leses fra gruppens value-array (medlemskap).
// onChange videresender det EKTE change-eventet til context, så RHF register/
// Controller leser value+checked nativt.
//
// Per-knapp `disabled` settes direkte som HTML-attributt og bevares av WC
// gjennom group disable-toggle (se IxCheckboxGroup._ownDisabled).
export const CheckboxButton = forwardRef<HTMLInputElement, CheckboxButtonProps>(function CheckboxButton(
    { value, label, disabled, className, id, ...restInputAttrs },
    ref
): JSX.Element {
    const ctx = useCheckboxGroupContext();
    const name = ctx?.name;
    // I register-modus (uncontrolled) eier RHF/native checked — ikke sett den fra
    // React, ellers slåss React-propen mot RHF sine DOM-skrivinger. Kontrollert
    // modus (value satt) setter checked via medlemskap i value-arrayet.
    const isChecked = ctx?.uncontrolled ? undefined : ctx?.value !== undefined ? ctx.value.includes(value) : undefined;

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
        <div className={`ix-checkbox${disabled ? ' ix-checkbox--disabled' : ''}${className ? ` ${className}` : ''}`}>
            <input
                ref={mergedRef}
                type="checkbox"
                id={id}
                value={value}
                name={name}
                disabled={disabled}
                checked={isChecked}
                onChange={ctx?.onChange}
                onBlur={ctx?.onBlur}
                {...restInputAttrs}
            />
            <label>{label}</label>
        </div>
    );
});
