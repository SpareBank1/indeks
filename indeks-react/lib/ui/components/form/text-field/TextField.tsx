import clsx from 'clsx';
import { forwardRef, type ReactNode, useId } from 'react';
import { Field } from '../field/Field';

export type TextFieldProps = {
    label: string;
    className?: string;
    inputId?: string;
    prefix?: ReactNode | string;
    suffix?: ReactNode | string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    placeholder?: string;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField({ prefix, suffix, label, inputProps, inputId, className, placeholder, description, errorMessage, disabled, readOnly, required, ...restProps }, ref) {
    const generatedId = useId();
    const id = inputId ?? generatedId;

    return (
        <Field inputId={id} label={label} className={className} description={description} errorMessage={errorMessage} disabled={disabled} readOnly={readOnly} {...restProps}>
            <div className={clsx('ix-text-field')}>
                {prefix && <div data-field="prefix">{prefix}</div>}
                <input ref={ref} {...inputProps} className={inputProps?.className} placeholder={placeholder} id={id} disabled={disabled} readOnly={readOnly} required={required} />
                {suffix && <div data-field="suffix">{suffix}</div>}
            </div>
        </Field>
    );
});
