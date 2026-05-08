import { forwardRef, type ReactNode, useId } from 'react';
import { Field } from '../field/Field';

type TextFieldOwnProps = {
    label?: string;
    ariaLabel?: string;
    /** CSS-klasse på wrapperen (`<ix-field>`). */
    className?: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
    description?: string;
    errorMessage?: string;
};

export type TextFieldProps = TextFieldOwnProps &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof TextFieldOwnProps | 'size'>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
    { label, ariaLabel, className, id, prefix, suffix, description, errorMessage, disabled, readOnly, ...inputAttrs },
    ref
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <Field
            inputId={inputId}
            label={label}
            className={className}
            description={description}
            errorMessage={errorMessage}
            disabled={disabled}
            readOnly={readOnly}
        >
            <div className="ix-text-field">
                {prefix && <div data-field="prefix">{prefix}</div>}
                <input
                    ref={ref}
                    {...inputAttrs}
                    id={inputId}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-label={ariaLabel}
                />
                {suffix && <div data-field="suffix">{suffix}</div>}
            </div>
        </Field>
    );
});
