import { forwardRef, useId } from 'react';
import { Field } from '../field/Field';

export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

export type SelectOptionGroup = {
    label: string;
    options: SelectOption[];
};

type SelectOwnProps = {
    label?: string;
    ariaLabel?: string;
    className?: string;
    description?: string;
    errorMessage?: string;
    placeholder?: string;
    options?: (SelectOption | SelectOptionGroup)[];
    tooltip?: string;
    tooltipLabel?: string;
    tooltipPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
};

export type SelectProps = SelectOwnProps &
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, keyof SelectOwnProps | 'size'>;

function isOptionGroup(option: SelectOption | SelectOptionGroup): option is SelectOptionGroup {
    return 'options' in option;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
    {
        label,
        ariaLabel,
        className,
        id,
        description,
        errorMessage,
        placeholder,
        options = [],
        disabled,
        tooltip,
        tooltipLabel,
        tooltipPlacement,
        ...selectAttrs
    },
    ref
) {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
        <Field
            inputId={selectId}
            label={label}
            className={className}
            description={description}
            errorMessage={errorMessage}
            disabled={disabled}
            tooltip={tooltip}
            tooltipLabel={tooltipLabel}
            tooltipPlacement={tooltipPlacement}
        >
            <select
                ref={ref}
                {...selectAttrs}
                id={selectId}
                className="ix-select"
                disabled={disabled}
                aria-invalid={errorMessage?.trim() ? 'true' : undefined}
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) =>
                    isOptionGroup(option) ? (
                        <optgroup key={option.label} label={option.label}>
                            {option.options.map((opt) => (
                                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                                    {opt.label}
                                </option>
                            ))}
                        </optgroup>
                    ) : (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    )
                )}
            </select>
        </Field>
    );
});
