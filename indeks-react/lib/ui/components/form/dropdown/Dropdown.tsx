import clsx from 'clsx';
import { type JSX, useId } from 'react';
import { Field } from '../field/Field';

export type DropdownProps = {
    className?: string;
    label: string;
    inputId?: string;
    placeholder?: string;
    inputProps?: React.HTMLAttributes<HTMLSelectElement>;
};

export function Dropdown(props: DropdownProps): JSX.Element {
    const { className, label, placeholder, inputProps, inputId, ...restProps } = {
        ...props,
    };

    const generatedId = useId();
    const id = inputId ?? generatedId;

    const { className: inputClassName, ...restInputProps } = inputProps ?? {};

    return (
        <Field label={label} inputId={id}>
            <select
                id={id}
                {...restProps}
                className={clsx('ix-dropdown', className, inputClassName)}
                {...restInputProps}
            >
                {[
                    { value: '', label: placeholder },
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                    { value: 'option3', label: 'Option 3' },
                ].map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </Field>
    );
}
