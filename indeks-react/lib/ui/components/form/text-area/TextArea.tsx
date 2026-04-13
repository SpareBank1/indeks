import { forwardRef, useId } from 'react';
import { Field } from '../field/Field';

export type TextAreaProps = {
    label: string;
    className?: string;
    inputId?: string;
    inputProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    placeholder?: string;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    { label, inputProps, inputId, className, placeholder, description, errorMessage, disabled, readOnly, required, ...restProps },
    ref
) {
    const generatedId = useId();
    const id = inputId ?? generatedId;

    return (
        <Field inputId={id} label={label} className={className} description={description} errorMessage={errorMessage} {...restProps}>
            <div className="ix-text-area">
                <textarea ref={ref} {...inputProps} className={inputProps?.className} placeholder={placeholder} id={id} disabled={disabled} readOnly={readOnly} required={required} />
            </div>
        </Field>
    );
});
