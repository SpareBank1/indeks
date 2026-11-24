import { forwardRef, useId, type ReactNode } from 'react';

type ToggleSwitchName =
    | {
          /** Synlig label. Beskriv tilstanden som slås av eller på, f.eks. «Motta varsler». */
          label: ReactNode;
          /** Tilgjengelig navn når labelen ikke er synlig. */
          ariaLabel?: string;
      }
    | {
          label?: never;
          ariaLabel: string;
      };

type ToggleSwitchOwnProps = {
    /** CSS-klasse på rot-elementet (`<ix-field>` når `description` er satt). */
    className?: string;
    /** Hjelpetekst under labelen. */
    description?: string;
    /** Hvilken side av switchen labelen står på. @default "left" */
    labelPlacement?: 'left' | 'right';
};

export type ToggleSwitchProps = ToggleSwitchName &
    ToggleSwitchOwnProps &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof ToggleSwitchOwnProps | 'label' | 'type' | 'role' | 'size'>;

export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(function ToggleSwitch(
    { label, ariaLabel, className, id, description, labelPlacement = 'left', disabled, ...inputAttrs },
    ref
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const toggleSwitch = (
        <div
            className={`ix-toggle-switch${className && !description ? ` ${className}` : ''}`}
            data-label-placement={labelPlacement === 'right' ? 'right' : undefined}
        >
            <input
                ref={ref}
                {...inputAttrs}
                type="checkbox"
                role="switch"
                id={inputId}
                disabled={disabled}
                aria-label={ariaLabel}
            />
            <label htmlFor={inputId}>{label}</label>
            {description && <span data-field="description">{description}</span>}
        </div>
    );

    if (description) {
        return (
            <ix-field class={className} data-disabled={disabled || undefined}>
                {toggleSwitch}
            </ix-field>
        );
    }

    return toggleSwitch;
});
