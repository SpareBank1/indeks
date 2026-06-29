import clsx from 'clsx';
import { type JSX, type ReactNode, useState } from 'react';
import { ValidationMessage } from '../validation-message/ValidationMessage';
import { RadioButton } from './RadioButton';
import { RadioGroupContext } from './RadioGroupContext';

export type RadioOption = {
    value: string;
    label: string;
};

export type RadioGroupProps = {
    legend: string;
    description?: string;
    errorMessage?: string;
    name?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    orientation?: 'vertical' | 'horizontal';
    hideLegend?: boolean;
    className?: string;
    options?: RadioOption[];
    children?: ReactNode;
    /** Visuell variant. `'chip'` styler hvert valg som en pill — brukes av RadioChipGroup. Standard er vanlig radioknapp. */
    variant?: 'chip';
    /** Størrelse — kun relevant for `variant="chip"`. @default "md" */
    size?: 'sm' | 'md';
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
    value: controlledValue,
    defaultValue,
    onChange,
    required,
    disabled,
    readOnly,
    orientation,
    hideLegend,
    className,
    options,
    children,
    variant,
    size = 'md',
}: RadioGroupProps): JSX.Element {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    function handleChange(newValue: string) {
        if (!isControlled) {
            setUncontrolledValue(newValue);
        }
        onChange?.(newValue);
    }

    const dataState = errorMessage ? 'error' : readOnly ? 'readonly' : disabled ? 'disabled' : undefined;
    const renderedChildren = options
        ? options.map((option) => (
              <RadioButton key={option.value} value={option.value} label={option.label} />
          ))
        : children;

    return (
        <ix-radio-group
            name={name}
            class={clsx(className) || undefined}
            data-variant={variant}
            data-size={variant === 'chip' && size !== 'md' ? size : undefined}
            data-orientation={orientation !== 'vertical' ? orientation : undefined}
            data-state={dataState}
            disabled={disabled || undefined}
            readonly={readOnly || undefined}
            required={required || undefined}
        >
            <span data-field="legend" className={hideLegend ? 'ix-sr-only' : undefined}>
                {readOnly && <ix-icon materialdesignname="lock" />}
                {legend}
            </span>
            {description && <p data-field="description">{description}</p>}
            <div data-field="items">
                <RadioGroupContext.Provider value={{ name, value, onChange: handleChange }}>
                    {renderedChildren}
                </RadioGroupContext.Provider>
            </div>
            <ValidationMessage>{errorMessage}</ValidationMessage>
        </ix-radio-group>
    );
}
