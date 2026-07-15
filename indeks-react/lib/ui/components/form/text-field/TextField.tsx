import { forwardRef, type ReactNode, useEffect, useId, useLayoutEffect, useRef } from 'react';
import { Field } from '../field/Field';
import type { IxField } from '@sb1/indeks-web';

/**
 * Format/parse-par for input-formatering. Duplisert her (ikke importert fra
 * `@sb1/indeks-web`) fordi React-laget aldri importerer web-runtime — web lastes
 * fra CDN. Holdes i synk med `FieldFormatter` i indeks-web.
 */
export type FieldFormatter = {
    /** Rå verdi → visningsstreng. */
    format(raw: string): string;
    /** Visningsstreng → rå verdi. */
    parse(display: string): string;
};

type TextFieldOwnProps = {
    label?: string;
    ariaLabel?: string;
    /** CSS-klasse på wrapperen (`<ix-field>`). */
    className?: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
    description?: string;
    errorMessage?: string;
    tooltip?: string;
    tooltipLabel?: string;
    tooltipPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
    /**
     * Formaterer feltet på blur (og viser rå verdi på fokus). Enten navnet på en
     * registrert variant (`"phone"`, `"amount"`, `"account"`, `"orgnr"`, `"ssn"`,
     * `"date"`, eller egen via
     * `IxField.registerFormatter`), eller et `{ format, parse }`-objekt for egendefinert
     * logikk. Se `formatPattern` for enkle pattern-strenger uten kode.
     */
    format?: string | FieldFormatter;
    /**
     * Pattern-streng for formatering uten kode: `"000 00 000"` (`0`=siffer,
     * `a`=bokstav, `*`=hva som helst, resten = separatorer). Merk: dette er IKKE
     * det native `pattern`-attributtet (valideringsregex) — det sendes fortsatt
     * gjennom til input som vanlig.
     */
    formatPattern?: string;
};

export type TextFieldProps = TextFieldOwnProps &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof TextFieldOwnProps | 'size'>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
    { label, ariaLabel, className, id, prefix, suffix, description, errorMessage, tooltip, tooltipLabel, tooltipPlacement, disabled, readOnly, format, formatPattern, ...inputAttrs },
    ref
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    // Egen ref til <ix-field> for å sette formatter-property når `format` er et
    // objekt. Attributt-varianten (`data-format`/`data-format-pattern`) trenger ingen ref.
    const fieldRef = useRef<IxField>(null);
    const formatIsObject = typeof format === 'object' && format !== null;

    useEffect(() => {
        if (!fieldRef.current) return;
        fieldRef.current.formatter = formatIsObject ? (format as FieldFormatter) : null;
    }, [format, formatIsObject]);

    // Controlled-støtte: input.value holder alltid den rå verdien, og den
    // formaterte visningen er en overlay i ix-field. Når React skriver den rå
    // `value`-propen til input ved en re-render, fyres ikke input-eventet, så
    // overlayen må oppdateres eksplisitt. useLayoutEffect kjører etter commit
    // (før paint) og ber ix-field re-formatere overlayen. No-op når ingen
    // formatter er aktiv, så uncontrolled er upåvirket.
    const hasFormatter = format != null || formatPattern != null;
    useLayoutEffect(() => {
        if (hasFormatter) fieldRef.current?.refreshFormat();
    });

    return (
        <Field
            ref={fieldRef}
            inputId={inputId}
            label={label}
            className={className}
            description={description}
            errorMessage={errorMessage}
            tooltip={tooltip}
            tooltipLabel={tooltipLabel}
            tooltipPlacement={tooltipPlacement}
            disabled={disabled}
            readOnly={readOnly}
            data-format={typeof format === 'string' ? format : undefined}
            data-format-pattern={formatPattern}
        >
            <div className="ix-text-field">
                {prefix && <div data-field="prefix">{prefix}</div>}
                <input
                    ref={ref}
                    {...inputAttrs}
                    id={inputId}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-label={ariaLabel}
                />
                {suffix && <div data-field="suffix">{suffix}</div>}
            </div>
        </Field>
    );
});
