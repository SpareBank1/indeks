import clsx from 'clsx';
import { type JSX, type ReactNode, useId } from 'react';
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
};

export function TextField(props: TextFieldProps): JSX.Element {
    const { prefix, suffix, label, inputProps, inputId, className, placeholder, description, errorMessage, disabled, readOnly, ...restProps } = {
        ...props,
    };
    const generatedId = useId();
    const id = inputId ?? generatedId;

    return (
        <Field inputId={id} label={label} className={className} description={description} errorMessage={errorMessage} disabled={disabled} readOnly={readOnly} {...restProps}>
            <div className={clsx('ix-text-field')}>
                {prefix && <div className="ix-text-field__prefix">{prefix}</div>}
                <input className="ix-text-field__input" {...inputProps} placeholder={placeholder} id={id} disabled={disabled} readOnly={readOnly} />
                {suffix && <div className="ix-text-field__suffix">{suffix}</div>}
            </div>
        </Field>
    );
}
