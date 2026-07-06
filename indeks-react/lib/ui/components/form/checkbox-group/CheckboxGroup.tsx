import clsx from 'clsx';
import { type JSX, type ReactNode, useState } from 'react';
import { ValidationMessage } from '../validation-message/ValidationMessage';
import { CheckboxButton } from './CheckboxButton';
import { CheckboxGroupContext } from './CheckboxGroupContext';

export type CheckboxOption = {
    value: string;
    label: string;
};

export type CheckboxGroupProps = {
    legend: string;
    description?: string;
    errorMessage?: string;
    name?: string;
    value?: string[];
    defaultValue?: string[];
    onChange?: (values: string[]) => void;
    disabled?: boolean;
    readOnly?: boolean;
    hideLegend?: boolean;
    className?: string;
    options?: CheckboxOption[];
    children?: ReactNode;
    /** Visuell variant. `'chip'` styler hvert valg som en pill — brukes av CheckboxChipGroup. Standard er vanlig checkbox. */
    variant?: 'chip';
    /** Størrelse — kun relevant for `variant="chip"`. @default "md" */
    size?: 'sm' | 'md';
};

// React-laget er tynt: ix-checkbox-group (WC) eier id, htmlFor, aria-*-koblinger,
// aria-invalid og disabled-propagering til barn-inputs. React-laget eksponerer kun
// props-API, kontrollert array-state (value/onChange) og presentasjons-attributter
// (data-state/className).
//
// Forskjell fra RadioGroup: value er et array (flere kan velges samtidig), og
// onChange kalles med hele det oppdaterte arrayet. Ingen orientation — checkbox-
// grupper vises alltid som vertikal liste (chip-varianten wrapper på rad via CSS).
export function CheckboxGroup({
    legend,
    description,
    errorMessage,
    name,
    value: controlledValue,
    defaultValue,
    onChange,
    disabled,
    readOnly,
    hideLegend,
    className,
    options,
    children,
    variant,
    size = 'md',
}: CheckboxGroupProps): JSX.Element {
    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? []);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    function handleChange(changedValue: string, checked: boolean) {
        const next = checked
            ? [...value, changedValue]
            : value.filter((v) => v !== changedValue);
        if (!isControlled) {
            setUncontrolledValue(next);
        }
        onChange?.(next);
    }

    const dataState = errorMessage ? 'error' : readOnly ? 'readonly' : disabled ? 'disabled' : undefined;
    const renderedChildren = options
        ? options.map((option) => (
              <CheckboxButton key={option.value} value={option.value} label={option.label} />
          ))
        : children;

    return (
        <ix-checkbox-group
            name={name}
            class={clsx(className) || undefined}
            data-variant={variant}
            data-size={variant === 'chip' && size !== 'md' ? size : undefined}
            data-state={dataState}
            disabled={disabled || undefined}
            readonly={readOnly || undefined}
        >
            <span data-field="legend" className={hideLegend ? 'ix-sr-only' : undefined}>
                {readOnly && <ix-icon name="lock" />}
                {legend}
            </span>
            {description && <p data-field="description">{description}</p>}
            <div data-field="items">
                <CheckboxGroupContext.Provider value={{ name, value, onChange: handleChange }}>
                    {renderedChildren}
                </CheckboxGroupContext.Provider>
            </div>
            <ValidationMessage>{errorMessage}</ValidationMessage>
        </ix-checkbox-group>
    );
}
