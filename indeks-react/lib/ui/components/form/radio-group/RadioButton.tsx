import { forwardRef, type InputHTMLAttributes, type JSX } from 'react';
import { useRadioGroupContext } from './RadioGroupContext';

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
    const isChecked = ctx?.value !== undefined ? ctx.value === value : undefined;

    function handleChange() {
        ctx?.onChange?.(value);
    }

    return (
        <div className={className}>
            <input
                ref={ref}
                type="radio"
                id={id}
                value={value}
                name={name}
                disabled={disabled}
                checked={isChecked}
                onChange={ctx ? handleChange : undefined}
                {...restInputAttrs}
            />
            <label>{label}</label>
        </div>
    );
});
