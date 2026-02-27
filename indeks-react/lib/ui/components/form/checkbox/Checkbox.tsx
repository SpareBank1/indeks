import clsx from 'clsx';
import { useId, type JSX } from 'react';
import { useFocus } from '../../../../hooks/useFocus';
import { extractComponentSizeClassname, type ComponentSize } from '../../../../types/types';

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

    const { componentSizeClassName } = extractComponentSizeClassname('ix-checkbox', size);

    const { ref, getFocusClasses } = useFocus<HTMLInputElement>();

    return (
        <>
            <input
                type="checkbox"
                id={id}
                ref={ref}
                className={clsx('ix-checkbox__input', componentSizeClassName)}
                {...inputProps}
            />
            <label
                htmlFor={id}
                className={clsx('ix-checkbox', componentSizeClassName, className, getFocusClasses('form'))}
                {...restProps}
            >
                {label}
            </label>
        </>
    );
}
