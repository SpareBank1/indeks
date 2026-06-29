import { forwardRef, type InputHTMLAttributes, type JSX } from 'react';
import { useCheckboxGroupContext } from './CheckboxGroupContext';

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
// Flere kan velges samtidig: checked leses fra gruppens value-array, og
// onChange toggler denne verdien inn/ut av arrayet via context.
//
// Per-knapp `disabled` settes direkte som HTML-attributt og bevares av WC
// gjennom group disable-toggle (se IxCheckboxGroup._ownDisabled).
export const CheckboxButton = forwardRef<HTMLInputElement, CheckboxButtonProps>(function CheckboxButton(
    { value, label, disabled, className, id, ...restInputAttrs },
    ref
): JSX.Element {
    const ctx = useCheckboxGroupContext();
    const name = ctx?.name;
    const isChecked = ctx?.value !== undefined ? ctx.value.includes(value) : undefined;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        ctx?.onChange?.(value, event.target.checked);
    }

    return (
        <div className={`ix-checkbox${disabled ? ' ix-checkbox--disabled' : ''}${className ? ` ${className}` : ''}`}>
            <input
                ref={ref}
                type="checkbox"
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
