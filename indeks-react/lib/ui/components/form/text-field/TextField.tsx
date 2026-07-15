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
    /** Visningsstreng → rå verdi (tapsfri: fjerner kun separatorer). */
    parse(display: string): string;
    /** Formater mens brukeren skriver. Standard false = format-on-blur. */
    live?: boolean;
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
     * Formaterer verdien. Enten navnet på en registrert variant (`"phone"`,
     * `"amount"`, `"account"`, `"orgnr"`, `"ssn"`, `"date"`, eller egen via
     * `IxField.registerFormatter`), eller et `{ format, parse }`-objekt for
     * egendefinert logikk. Se `formatPattern` for enkle pattern-strenger uten kode.
     *
     * De innebygde variantene formaterer **live** (separatorene dukker opp mens man
     * skriver). Egne pattern-strenger og `{format,parse}`-objekter formateres **på
     * blur** (viser rå verdi ved fokus for fri redigering) med mindre de setter
     * `live: true`. Uansett modus vises alt brukeren skriver — feil fanges av
     * validering, ikke ved å droppe tegn. `onChange` og form-innsending gir alltid
     * den rå verdien (uten separatorer).
     */
    format?: string | FieldFormatter;
    /**
     * Pattern-streng for formatering uten kode: `"000 00 000"` (`0`=siffer,
     * `a`=bokstav, `*`=hva som helst, resten = separatorer). Merk: dette er IKKE
     * det native `pattern`-attributtet (valideringsregex) — det sendes fortsatt
     * gjennom til input som vanlig.
     */
    formatPattern?: string;
    /**
     * Overstyrer formatterens live-modus for dette feltet. Utelatt = formatterens
     * egen default (innebygde varianter er live, egne pattern/objekt er blur).
     * `true` tvinger live (separatorer mens man skriver), `false` tvinger blur
     * (formateres når feltet mister fokus).
     */
    formatLive?: boolean;
};

export type TextFieldProps = TextFieldOwnProps &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof TextFieldOwnProps | 'size'>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
    { label, ariaLabel, className, id, prefix, suffix, description, errorMessage, tooltip, tooltipLabel, tooltipPlacement, disabled, readOnly, format, formatPattern, formatLive, value, defaultValue, onChange, ...inputAttrs },
    ref
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    // Egen ref til <ix-field> for å sette formatter-property når `format` er et
    // objekt, og for å lese rå verdi / re-formatere. Attributt-varianten
    // (`data-format`/`data-format-pattern`) settes direkte på <input>.
    const fieldRef = useRef<IxField>(null);
    // Intern ref til <input> for å hekte en native input-lytter i formatter-modus.
    // Slås sammen med den forwardede `ref` slik at konsumenten fortsatt får inputen.
    const inputRef = useRef<HTMLInputElement | null>(null);
    const setInputRef = (node: HTMLInputElement | null): void => {
        inputRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
    };
    const formatIsObject = typeof format === 'object' && format !== null;
    const hasFormatter = format != null || formatPattern != null;

    useEffect(() => {
        if (!fieldRef.current) return;
        fieldRef.current.formatter = formatIsObject ? (format as FieldFormatter) : null;
    }, [format, formatIsObject]);

    // onChange skal alltid levere RÅ verdi til konsumenten, uansett modus. I
    // formatter-modus eier ix-field den synlige input-verdien (formatert), så vi
    // kan ikke bruke Reacts syntetiske onChange: React sporer input.value og ser
    // ingen netto endring når ix-field skriver formatert verdi via den patchede
    // setteren, og undertrykker da onChange. Vi hekter derfor en egen native
    // input-lytter — den kjører etter ix-field sin (registrert i connectedCallback,
    // før denne effekten), så mirror/rawValue er oppdatert — og kaller onChange med
    // rå verdi. Vi holder onChange i en ref så lytteren ikke må re-hektes.
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    useEffect(() => {
        const input = inputRef.current;
        if (!hasFormatter || !input) return;
        const listener = (event: Event): void => {
            const cb = onChangeRef.current;
            if (!cb) return;
            const raw = fieldRef.current?.rawValue ?? input.value;
            // Lever en React-lignende ChangeEvent der target.value er rå. Vi bruker
            // en lettvekts stand-in (ikke Object.create(input) — det ville brutt
            // jsdom/React sin brand-sjekk på HTMLInputElement) som eksponerer det
            // konsumenten faktisk leser: value, name og elementet selv.
            const target = { value: raw, name: input.name, id: input.id };
            cb({ ...event, target, currentTarget: target, nativeEvent: event } as unknown as React.ChangeEvent<HTMLInputElement>);
        };
        input.addEventListener('input', listener);
        return () => input.removeEventListener('input', listener);
    }, [hasFormatter]);

    // Når en formatter er aktiv eier ix-field den synlige input-verdien: den viser
    // formatert tekst (som React ikke kan regne ut for streng-varianter), mens den
    // rå verdien ligger i en skjult mirror-input. Derfor binder vi IKKE `value` til
    // DOM-inputen i formatter-modus — vi seeder rå verdi via `defaultValue` og lar
    // ix-field formatere. Controlled `value` reconciles via refreshFormat under.
    const isControlled = value !== undefined;
    useLayoutEffect(() => {
        if (hasFormatter && isControlled) fieldRef.current?.refreshFormat(value == null ? '' : String(value));
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
        >
            <div className="ix-text-field">
                {prefix && <div data-field="prefix">{prefix}</div>}
                <input
                    ref={setInputRef}
                    {...inputAttrs}
                    id={inputId}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-label={ariaLabel}
                    data-format={typeof format === 'string' ? format : undefined}
                    data-format-pattern={formatPattern}
                    data-format-live={formatLive === undefined ? undefined : String(formatLive)}
                    // I formatter-modus eier ix-field DOM-verdien → seed rå via
                    // defaultValue (uncontrolled på DOM-nivå), reconcile via effekt,
                    // og onChange leveres av den native lytteren over (rå verdi).
                    // Uten formatter: vanlig controlled/uncontrolled onChange som før.
                    {...(hasFormatter
                        ? { defaultValue: (value ?? defaultValue ?? '') as string | number | readonly string[] }
                        : { value, defaultValue, onChange })}
                />
                {suffix && <div data-field="suffix">{suffix}</div>}
            </div>
        </Field>
    );
});
