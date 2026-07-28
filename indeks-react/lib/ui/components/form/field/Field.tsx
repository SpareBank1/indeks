import { forwardRef, type ReactNode } from 'react';
import { Label } from '../label/Label';
import { ValidationMessage } from '../validation-message/ValidationMessage';
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
    tooltip?: string;
    tooltipLabel?: string;
    tooltipPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
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
    tooltip,
    tooltipLabel,
    tooltipPlacement,
    ...restProps
}, ref) {
    return (
        <ix-field ref={ref} {...restProps} class={className} data-disabled={disabled || undefined} data-readonly={readOnly || undefined} tooltip={tooltip || undefined} tooltip-label={tooltipLabel || undefined} tooltip-placement={tooltipPlacement || undefined}>
            {label && <Label htmlFor={inputId}>{label}</Label>}
            <span data-field="description">{description}</span>
            {children}
            <ValidationMessage>{errorMessage}</ValidationMessage>
        </ix-field>
    );
});
