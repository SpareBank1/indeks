import clsx from 'clsx';
import { type JSX, type ReactNode, useId } from 'react';

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
        <InputWrapper inputId={id} label={label} className={className} description={description} errorMessage={errorMessage} disabled={disabled} readOnly={readOnly} {...restProps}>
            <div className={clsx('ix-text-field')}>
                {prefix && <div className="ix-text-field__prefix">{prefix}</div>}
                <input className="ix-text-field__input" placeholder={placeholder} id={id} disabled={disabled} readOnly={readOnly} {...inputProps} />
                {suffix && <div className="ix-text-field__suffix">{suffix}</div>}
            </div>
        </InputWrapper>
    );
}

export const InputWrapper = ({
    className,
    label,
    children,
    inputId,
    description,
    errorMessage,
    disabled,
    readOnly,
    ...restProps
}: {
    className?: string;
    label: string;
    children: ReactNode;
    inputId: string;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
}): JSX.Element => {
    return (
        <div {...restProps} className={clsx('ix-field', { 'ix-field--disabled' : disabled, 'ix-field--read-only' : readOnly }, className)}>
            <label htmlFor={inputId} className='ix-text-field__label'>{label}</label>
            {description && <span className="ix-text-field__description">{description}</span>}
            {children}
            {errorMessage && <span className="ix-text-field__error-message">{errorMessage}</span>}
        </div>
    );
};
