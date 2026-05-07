import clsx from 'clsx';
import { useId, type JSX } from 'react';
import { useFocus } from '../../../../hooks/useFocus';
import type { ComponentSize } from '../../../../types/types';

export type CheckboxProps = {
    className?: string;
    size?: ComponentSize;
    label: string;
    inputId?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export function Checkbox(props: CheckboxProps): JSX.Element {
    const { size, className, inputId, label, inputProps, ...restProps } = {
        ...props,
    };
    const generatedId = useId();
    const id = inputId ?? generatedId;

    const { ref, getFocusClasses } = useFocus<HTMLInputElement>();

    return (
        <>
            <input
                type="checkbox"
                id={id}
                ref={ref}
                className="ix-checkbox__input"
                {...inputProps}
            />
            <label
                htmlFor={id}
                data-size={size}
                className={clsx('ix-checkbox', className, getFocusClasses('form'))}
                {...restProps}
            >
                {label}
            </label>
        </>
    );
}
