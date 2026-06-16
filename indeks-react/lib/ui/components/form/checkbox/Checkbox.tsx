import { forwardRef, useId, useEffect, useRef, type ReactNode } from 'react';
import { Field } from '../field/Field';

type CheckboxOwnProps = {
    label: ReactNode;
    ariaLabel?: string;
    className?: string;
    description?: string;
    errorMessage?: string;
    indeterminate?: boolean;
    tooltip?: string;
    tooltipLabel?: string;
    tooltipPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
};

export type CheckboxProps = CheckboxOwnProps &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof CheckboxOwnProps | 'type'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    {
        label,
        ariaLabel,
        className,
        id,
        description,
        errorMessage,
        indeterminate,
        disabled,
        tooltip,
        tooltipLabel,
        tooltipPlacement,
        ...inputAttrs
    },
    forwardedRef
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (forwardedRef ?? internalRef) as React.RefObject<HTMLInputElement>;

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate ?? false;
        }
    }, [indeterminate, inputRef]);

    const hasFieldWrapper = description || errorMessage || tooltip;

    const modifierClasses = disabled ? 'ix-checkbox--disabled' : '';

    const checkboxContent = (
        <label className={`ix-checkbox${modifierClasses ? ` ${modifierClasses}` : ''}`}>
            <input
                ref={inputRef}
                {...inputAttrs}
                type="checkbox"
                id={inputId}
                className="ix-checkbox__input"
                disabled={disabled}
                aria-label={ariaLabel}
                aria-invalid={errorMessage?.trim() ? 'true' : undefined}
            />
            <span className="ix-checkbox__box" />
            <span className="ix-checkbox__label">{label}</span>
        </label>
    );

    if (hasFieldWrapper) {
        return (
            <Field
                inputId={inputId}
                className={className}
                description={description}
                errorMessage={errorMessage}
                disabled={disabled}
                tooltip={tooltip}
                tooltipLabel={tooltipLabel}
                tooltipPlacement={tooltipPlacement}
            >
                {checkboxContent}
            </Field>
        );
    }

    return checkboxContent;
});
