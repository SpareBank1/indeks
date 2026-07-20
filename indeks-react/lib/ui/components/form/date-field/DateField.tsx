import { forwardRef, useEffect, useId, useRef } from 'react';
import type { IxDateField } from '@sb1/indeks-web';
import { Field } from '../field/Field';

export type DateFieldProps = {
    /** Synlig label over feltet. Utelates hvis `ariaLabel` brukes i stedet. */
    label?: string;
    /** Tilgjengelig navn når det ikke finnes en synlig label. */
    ariaLabel?: string;
    /** Navn på det innsendte feltet. Verdien som sendes inn er ISO (åååå-mm-dd). */
    name?: string;
    /**
     * Kontrollert verdi i ISO-format (`åååå-mm-dd`). Feltet viser den som
     * `dd.mm.åååå`. Kombiner med `onChange`.
     */
    value?: string;
    /** Ukontrollert startverdi i ISO-format (`åååå-mm-dd`). */
    defaultValue?: string;
    /** Kalles med ny verdi i ISO-format (`åååå-mm-dd`, tom streng når ufullstendig). */
    onChange?: (value: string) => void;
    /** Tidligste valgbare dato i ISO-format (`åååå-mm-dd`). Sperrer i kalenderen. */
    min?: string;
    /** Seneste valgbare dato i ISO-format (`åååå-mm-dd`). Sperrer i kalenderen. */
    max?: string;
    /** aria-label på kalenderknappen (i18n — konsumenten oversetter). */
    openLabel: string;
    placeholder?: string;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    className?: string;
    tooltip?: string;
    tooltipLabel?: string;
    tooltipPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
    id?: string;
};

// React-laget er tynt: ix-date-field (WC) genererer kalenderknappen og den
// overlagte native date-inputen, kabler formatering via ix-field, og synker
// dd.mm.åååå ↔ ISO. React eksponerer kun props-API og kontrollert/ukontrollert
// value. Den synlige inputen bruker data-format="date" så ix-field formaterer
// live; WC-en flytter `name` til den native inputen så innsending gir ISO.
export const DateField = forwardRef<IxDateField, DateFieldProps>(function DateField(
    {
        label,
        ariaLabel,
        name,
        value: controlledValue,
        defaultValue,
        onChange,
        min,
        max,
        openLabel,
        placeholder,
        description,
        errorMessage,
        disabled,
        readOnly,
        required,
        className,
        tooltip,
        tooltipLabel,
        tooltipPlacement,
        id,
    },
    ref
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hostRef = useRef<IxDateField | null>(null);

    const isControlled = controlledValue !== undefined;

    // Lytt på WC-ens change-event og rapporter ny ISO-verdi til konsumenten.
    // WC-en emitter change når den native ISO-inputen endres; vi leser verdien
    // fra den native inputen (kilden for ISO).
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        const handler = () => {
            const cb = onChangeRef.current;
            if (!cb) return;
            const native = host.querySelector<HTMLInputElement>('input.ix-date-field__native');
            cb(native?.value ?? '');
        };
        host.addEventListener('change', handler);
        return () => host.removeEventListener('change', handler);
    }, []);

    const dataState = errorMessage ? 'error' : readOnly ? 'readonly' : disabled ? 'disabled' : undefined;

    return (
        <Field
            inputId={inputId}
            label={label}
            className={className}
            description={description}
            errorMessage={errorMessage}
            disabled={disabled}
            readOnly={readOnly}
            tooltip={tooltip}
            tooltipLabel={tooltipLabel}
            tooltipPlacement={tooltipPlacement}
        >
            <ix-date-field
                ref={(node: IxDateField | null) => {
                    hostRef.current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) ref.current = node;
                }}
                class="ix-date-field"
                name={name}
                min={min}
                max={max}
                // Kontrollert: sett value-attributtet (ISO) → WC seeder native +
                // synlig. Ukontrollert: WC leser startverdien fra defaultValue via
                // value-attributtet ved mount, deretter eier den tilstanden.
                value={isControlled ? (controlledValue ?? '') : defaultValue}
                disabled={disabled || undefined}
                readonly={readOnly || undefined}
                data-state={dataState}
                data-open-label={openLabel}
            >
                <div className="ix-text-field">
                    <input
                        id={inputId}
                        inputMode="numeric"
                        data-format="date"
                        placeholder={placeholder}
                        aria-label={ariaLabel}
                        aria-invalid={errorMessage?.trim() ? 'true' : undefined}
                        disabled={disabled}
                        readOnly={readOnly}
                        required={required}
                    />
                </div>
            </ix-date-field>
        </Field>
    );
});
