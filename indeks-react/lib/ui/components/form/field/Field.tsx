import { forwardRef, type ReactNode } from 'react';

export type FieldProps = {
    className?: string;
    label?: string;
    children: ReactNode;
    inputId: string;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
    tooltip?: string;
    /** Standard: 'Mer informasjon' */
    tooltipLabel?: string;
    tooltipPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
};

export const Field = forwardRef<HTMLElement, FieldProps>(function Field({
    className,
    label,
    children,
    inputId,
    description,
    errorMessage,
    disabled,
    readOnly,
    tooltip,
    tooltipLabel,
    tooltipPlacement,
    ...restProps
}, ref) {
    return (
        <ix-field ref={ref} {...restProps} class={className} data-disabled={disabled || undefined} data-readonly={readOnly || undefined} tooltip={tooltip || undefined} tooltip-label={tooltipLabel || undefined} tooltip-placement={tooltipPlacement || undefined}>
            {label && <label htmlFor={inputId}>{label}</label>}
            <span data-field="description">{description}</span>
            {children}
            <span data-field="error">{errorMessage}</span>
        </ix-field>
    );
});
