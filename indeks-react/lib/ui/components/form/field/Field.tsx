import clsx from 'clsx';
import { type JSX, type ReactNode } from 'react';

export type FieldProps = {
    className?: string;
    label: string;
    children: ReactNode;
    inputId: string;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
};

export function Field({
    className,
    label,
    children,
    inputId,
    description,
    errorMessage,
    disabled,
    readOnly,
    ...restProps
}: FieldProps): JSX.Element {
    return (
        <ix-field {...restProps} class={clsx({ 'ix-field--disabled' : disabled, 'ix-field--read-only' : readOnly }, className)}>
            <label htmlFor={inputId} className='ix-label'>{label}</label>
            <span data-field="description">{description}</span>
            {children}
            <span data-field="error">{errorMessage}</span>
        </ix-field>
    );
}
