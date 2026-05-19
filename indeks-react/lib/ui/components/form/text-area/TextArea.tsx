import { forwardRef, useId } from 'react';
import { Field } from '../field/Field';

type TextAreaOwnProps = {
    label?: string;
    ariaLabel?: string;
    /** CSS-klasse på wrapperen (`<ix-field>`). */
    className?: string;
    description?: string;
    errorMessage?: string;
    tooltip?: string;
    tooltipLabel?: string;
    tooltipPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
};

export type TextAreaProps = TextAreaOwnProps &
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof TextAreaOwnProps>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    { label, ariaLabel, className, id, description, errorMessage, tooltip, tooltipLabel, tooltipPlacement, disabled, readOnly, ...inputAttrs },
    ref
) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
        <Field
            inputId={textareaId}
            label={label}
            className={className}
            description={description}
            errorMessage={errorMessage}
            tooltip={tooltip}
            tooltipLabel={tooltipLabel}
            tooltipPlacement={tooltipPlacement}
            disabled={disabled}
            readOnly={readOnly}
        >
            <div className="ix-text-area">
                <textarea
                    ref={ref}
                    {...inputAttrs}
                    id={textareaId}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-label={ariaLabel}
                />
            </div>
        </Field>
    );
});
