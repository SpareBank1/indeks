import { forwardRef, type ReactNode } from 'react';
import type { IxField } from '@sb1/indeks-web';

export type FieldProps = {
    className?: string;
    label?: string;
    children: ReactNode;
    inputId: string;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
};

export const Field = forwardRef<IxField, FieldProps>(function Field({
    className,
    label,
    children,
    inputId,
    description,
    errorMessage,
    disabled,
    readOnly,
    ...restProps
}, ref) {

    return (
        <ix-field ref={ref} {...restProps} class={className} data-disabled={disabled || undefined} data-readonly={readOnly || undefined}>
            {label && <label htmlFor={inputId}>{label}</label>}
            <span data-field="description">{description}</span>
            {children}
            <span data-field="error">{errorMessage}</span>
        </ix-field>
    );
});
