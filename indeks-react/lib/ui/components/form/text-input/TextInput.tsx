import clsx from 'clsx';
import { type JSX, type ReactNode, useId } from 'react';

export type TextInputProps = {
    label: string;
    className?: string;
    inputId?: string;
    prefix?: ReactNode | string;
    postfix?: ReactNode | string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    placeholder?: string;
    description?: string;
};

export function TextInput(props: TextInputProps): JSX.Element {
    const { prefix, postfix, label, inputProps, inputId, className, placeholder, description, ...restProps } = {
        ...props,
    };
    const generatedId = useId();
    const id = inputId ?? generatedId;

    return (
        <InputWrapper inputId={id} label={label} className={className} description={description} {...restProps}>
            <div className={clsx('ix-text-input')}>
                {prefix}
                <input placeholder={placeholder} id={id} {...inputProps} />
                {postfix}
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
    ...restProps
}: {
    className?: string;
    label: string;
    children: ReactNode;
    inputId: string;
    description?: string;
}): JSX.Element => {
    return (
        <div {...restProps} className={clsx('ix-input-wrapper', className)}>
            <label htmlFor={inputId}>{label}</label>
            {description && <span className="ix-input-description">{description}</span>}
            {children}
        </div>
    );
};
