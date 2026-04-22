import { forwardRef, type ReactNode, useId } from 'react';
import { Field } from '../field/Field';

export type TextFieldProps = Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'prefix' | 'children'> & {
    label?: string;
    ariaLabel?: string;
    className?: string;
    inputId?: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField({ prefix, suffix, label, ariaLabel, inputProps, inputId, className, type, placeholder, description, errorMessage, disabled, readOnly, required, ...restProps }, ref) {
    const generatedId = useId();
    const id = inputId ?? generatedId;

    if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
        console.warn('[TextField] Feltet mangler label. Sett enten label (synlig) eller ariaLabel (skjult). Synlig label er anbefalt.');
    }

    return (
        <Field inputId={id} label={label} className={className} description={description} errorMessage={errorMessage} disabled={disabled} readOnly={readOnly} {...restProps}>
            <div className="ix-text-field">
                {prefix && <div data-field="prefix">{prefix}</div>}
                <input ref={ref} {...inputProps} type={type ?? inputProps?.type} placeholder={placeholder} id={id} disabled={disabled} readOnly={readOnly} required={required} aria-label={ariaLabel} />
                {suffix && <div data-field="suffix">{suffix}</div>}
            </div>
        </Field>
    );
});
