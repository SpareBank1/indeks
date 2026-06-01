import clsx from 'clsx';
import { type JSX, type ReactNode } from 'react';
import { ValidationMessage } from '../validation-message/ValidationMessage';
import { RadioGroupContext } from './RadioGroupContext';

export type RadioGroupProps = {
    legend: string;
    description?: string;
    errorMessage?: string;
    name?: string;
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    orientation?: 'vertical' | 'horizontal';
    hideLegend?: boolean;
    className?: string;
    children: ReactNode;
};

// React-laget er tynt: ix-radio-group (WC) eier id, name, htmlFor, aria-*-koblinger,
// aria-invalid, aria-required, og disabled-propagering til barn-inputs. React-laget
// eksponerer kun props-API, kontrollert state (value/onChange) og presentasjons-
// attributter (data-state/data-orientation/className).
export function RadioGroup({
    legend,
    description,
    errorMessage,
    name,
    value,
    onChange,
    required,
    disabled,
    readOnly,
    orientation,
    hideLegend,
    className,
    children,
}: RadioGroupProps): JSX.Element {
    const dataState = errorMessage ? 'error' : readOnly ? 'readonly' : disabled ? 'disabled' : undefined;

    return (
        <ix-radio-group
            class={clsx(className) || undefined}
            data-orientation={orientation !== 'vertical' ? orientation : undefined}
            data-state={dataState}
            disabled={disabled || undefined}
            readonly={readOnly || undefined}
            required={required || undefined}
        >
            <span
                data-field="legend"
                className={hideLegend ? 'ix-sr-only' : 'ix-radio-group__legend'}
            >
                {legend}
            </span>
            {description && (
                <p data-field="description" className="ix-radio-group__description">
                    {description}
                </p>
            )}
            <div className="ix-radio-group__items">
                <RadioGroupContext.Provider value={{ name, value, onChange }}>
                    {children}
                </RadioGroupContext.Provider>
            </div>
            <ValidationMessage>{errorMessage}</ValidationMessage>
        </ix-radio-group>
    );
}
