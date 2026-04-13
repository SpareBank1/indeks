import { forwardRef, type ReactNode } from 'react';

export type FieldProps = {
    className?: string;
    label: string;
    children: ReactNode;
    inputId: string;
    description?: string;
    errorMessage?: string;
};

export const Field = forwardRef<HTMLElement, FieldProps>(function Field({
    className,
    label,
    children,
    inputId,
    description,
    errorMessage,
    ...restProps
}, ref) {
    return (
        <ix-field ref={ref} {...restProps} class={className}>
            <label htmlFor={inputId} className='ix-label'>
                {label}
            </label>
            <span data-field="description">{description}</span>
            {children}
            <span data-field="error">{errorMessage}</span>
        </ix-field>
    );
});
