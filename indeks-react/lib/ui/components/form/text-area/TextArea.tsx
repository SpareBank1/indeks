import { forwardRef, useId } from 'react';
import { Field } from '../field/Field';

export type TextAreaProps = Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children'> & {
    label?: string;
    ariaLabel?: string;
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
    { label, ariaLabel, inputProps, inputId, className, placeholder, description, errorMessage, disabled, readOnly, required, ...restProps },
    ref
) {
    const generatedId = useId();
    const id = inputId ?? generatedId;

    if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
        console.warn('[TextArea] Feltet mangler label. Sett enten label (synlig) eller ariaLabel (skjult). Synlig label er anbefalt.');
    }

    return (
        <Field inputId={id} label={label} className={className} description={description} errorMessage={errorMessage} disabled={disabled} readOnly={readOnly} {...restProps}>
            <div className="ix-text-area">
                <textarea ref={ref} {...inputProps} placeholder={placeholder} id={id} disabled={disabled} readOnly={readOnly} required={required} aria-label={ariaLabel} />
            </div>
        </Field>
    );
});
