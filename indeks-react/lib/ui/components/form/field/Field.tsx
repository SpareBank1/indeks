import { forwardRef, type ReactNode } from 'react';

export type FieldProps = {
    className?: string;
    label?: string;
    ariaLabel?: string;
    children: ReactNode;
    inputId: string;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
};

export const Field = forwardRef<HTMLElement, FieldProps>(function Field({
    className,
    label,
    ariaLabel,
    children,
    inputId,
    description,
    errorMessage,
    disabled,
    readOnly,
    ...restProps
}, ref) {
    if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
        console.warn('[Field] Feltet mangler label. Sett enten label (synlig) eller ariaLabel (skjult). Synlig label er anbefalt.');
    }

    return (
        <ix-field ref={ref} {...restProps} class={className} data-disabled={disabled || undefined} data-readonly={readOnly || undefined}>
            {label && <label htmlFor={inputId}>{label}</label>}
            <span data-field="description">{description}</span>
            {children}
            <span data-field="error">{errorMessage}</span>
        </ix-field>
    );
});
