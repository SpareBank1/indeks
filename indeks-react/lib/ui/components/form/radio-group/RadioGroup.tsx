import clsx from 'clsx';
import { Fragment, useId, type JSX } from 'react';
import { useFocus } from '../../../../hooks/useFocus';

export type RadioGroupProps = {
    className?: string;
    legend: string;
    description?: string;
    inputprops?: React.InputHTMLAttributes<HTMLInputElement>;
    options: { value: string; label: string }[];
};

export function RadioGroup(props: RadioGroupProps): JSX.Element {
    const { className, legend, inputprops, description, options, ...restProps } = {
        ...props,
    };

    const generatedId = useId();
    const idOrName = inputprops?.name ?? generatedId;

    const { ref, getFocusClasses } = useFocus<HTMLInputElement>();

    return (
        <fieldset className={clsx('ix-radio-group', className)} {...restProps}>
            <legend>{legend}</legend>
            <p>{description}</p>
            {options.map((option) => (
                <Fragment key={option.value}>
                    <input
                        id={`${idOrName}-${option.value}`}
                        type="radio"
                        name={idOrName}
                        value={option.value}
                        className="ix-radio__input"
                        ref={ref}
                        {...inputprops}
                    />
                    <label
                        className={clsx('ix-radio__label', getFocusClasses('form'))}
                        htmlFor={`${idOrName}-${option.value}`}
                    >
                        {option.label}
                    </label>
                </Fragment>
            ))}
        </fieldset>
    );
}
