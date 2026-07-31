import { forwardRef, type ReactNode, useCallback, useEffect, useId, useLayoutEffect, useRef } from 'react';
import { Field } from '../field/Field';
import type { IxField } from '@sb1/indeks-web';
import { createFieldEvent } from '../synthetic-events';
import type { FieldFormatter, FormatName } from './text-field-formats';

export type { FieldFormatter, FormatName, BuiltInFormatName } from './text-field-formats';

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
    format?: FormatName | FieldFormatter;
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
    { label, ariaLabel, className, id, name, prefix, suffix, description, errorMessage, tooltip, tooltipLabel, tooltipPlacement, disabled, readOnly, format, formatPattern, formatLive, value, defaultValue, onChange, onBlur, ...inputAttrs },
    ref
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    // Egen ref til <ix-field> for å sette formatter-property når `format` er et
    // objekt, og for å lese rå verdi / re-formatere. Attributt-varianten
    // (`data-format`/`data-format-pattern`) settes direkte på <input>.
    const fieldRef = useRef<IxField>(null);
    // Intern ref til <input> for å hekte native lyttere i formatter-modus.
    const inputRef = useRef<HTMLInputElement | null>(null);
    const formatIsObject = typeof format === 'object' && format !== null;
    const hasFormatter = format != null || formatPattern != null;
    const isControlled = value !== undefined;

    // I formatter-modus eier ix-field den synlige DOM-verdien (formatert), og den rå
    // verdien lever i en skjult mirror. RHF sin register() er ref-sentrisk: den leser
    // verdien via `ref.value` og skriver via `ref.value = rå`. Vi kan derfor ikke gi
    // RHF den native inputen (dens `.value` er formatert). I stedet videresender vi en
    // liten PROXY: `get value` gir rå, `set value` re-formaterer via ix-field, og
    // `focus()` delegerer til den synlige inputen (fokus-ved-feil). Slik bindes et
    // formatert felt med `{...register('felt')}` akkurat som et uformatert.
    const lastSeedRef = useRef<string | null>(null);
    const proxyRef = useRef<HTMLInputElement | null>(null);
    if (proxyRef.current === null) {
        const proxy = {
            name: '',
            focus(): void {
                inputRef.current?.focus();
            },
            get value(): string {
                return fieldRef.current?.rawValue ?? lastSeedRef.current ?? '';
            },
            set value(next: string | null) {
                const raw = next == null ? '' : String(next);
                lastSeedRef.current = raw;
                // fieldRef kan være null under mount (barn-ref committes før forelder);
                // finn ix-field via DOM i mellomtiden.
                const field = fieldRef.current ?? (inputRef.current?.closest('ix-field') as IxField | null);
                field?.refreshFormat(raw);
            },
        };
        proxyRef.current = proxy as unknown as HTMLInputElement;
    }
    proxyRef.current.name = name ?? '';

    // Videresend proxy i formatter-modus, ellers den native inputen. Sett
    // `inputRef.current` FØR `ref(...)`: RHF trigger `proxy.value = default` synkront i
    // sin ref-callback (mount-seed), og setteren trenger inputRef for å finne ix-field.
    // Memoisert så RHF ikke av/reregistrerer refen (og dermed re-kjører mount-seed
    // `proxy.value = default`) hver render — samme grep som mergedRef i Radio/Checkbox.
    // Deps: kun `ref` og `hasFormatter` styrer hva som videresendes; proxyRef/inputRef
    // er stabile useRef-objekter.
    const setInputRef = useCallback(
        (node: HTMLInputElement | null): void => {
            inputRef.current = node;
            const forwarded = hasFormatter && node ? proxyRef.current : node;
            if (typeof ref === 'function') ref(forwarded);
            else if (ref) ref.current = forwarded;
        },
        [ref, hasFormatter]
    );

    useEffect(() => {
        if (!fieldRef.current) return;
        fieldRef.current.formatter = formatIsObject ? (format as FieldFormatter) : null;
        // Objekt-formattere kobles her (post-commit), ikke ved connect. Ved mount-seed
        // var formatering derfor ikke aktiv og refreshFormat var no-op — reconcile den
        // lagrede rå-seeden nå. Idempotent (refreshFormat equality-guarder).
        if (hasFormatter && !isControlled && lastSeedRef.current != null) {
            fieldRef.current.refreshFormat(lastSeedRef.current);
        }
    }, [format, formatIsObject, hasFormatter, isControlled]);

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
    const onBlurRef = useRef(onBlur);
    onBlurRef.current = onBlur;
    useEffect(() => {
        const input = inputRef.current;
        if (!hasFormatter || !input) return;
        const emitChange = (event: Event): void => {
            const cb = onChangeRef.current;
            if (!cb) return;
            const raw = fieldRef.current?.rawValue ?? input.value;
            // Lever en React-lignende ChangeEvent der target.value er rå, i den delte
            // syntetiske formen (se ../synthetic-events). Vi kan ikke gi et ekte event:
            // ix-field har byttet den synlige inputens navn til `${name}_formatted`, så
            // vi bruker name-PROPPEN. `type` beholdes fra det native input-eventet.
            cb(
                createFieldEvent(event.type, { value: raw, name: name ?? input.name, id: input.id }, event) as unknown as React.ChangeEvent<HTMLInputElement>
            );
        };
        // Blur emitteres syntetisk (ikke spredt på inputen) fordi den synlige inputen
        // heter `${name}_formatted` etter ix-field sitt navnebytte — et ekte blur-event
        // ville hatt feil target.name, så RHF sitt feltoppslag bommer. Syntetisk blur
        // med opprinnelig navn + rå verdi oppdaterer touched-state korrekt.
        const emitBlur = (event: Event): void => {
            const cb = onBlurRef.current;
            if (!cb) return;
            const raw = fieldRef.current?.rawValue ?? input.value;
            cb(
                createFieldEvent('blur', { value: raw, name: name ?? input.name, id: input.id }, event) as unknown as React.FocusEvent<HTMLInputElement>
            );
        };
        input.addEventListener('input', emitChange);
        input.addEventListener('blur', emitBlur);
        return () => {
            input.removeEventListener('input', emitChange);
            input.removeEventListener('blur', emitBlur);
        };
    }, [hasFormatter, name]);

    // Når en formatter er aktiv eier ix-field den synlige input-verdien: den viser
    // formatert tekst (som React ikke kan regne ut for streng-varianter), mens den
    // rå verdien ligger i en skjult mirror-input. Derfor binder vi IKKE `value` til
    // DOM-inputen i formatter-modus — vi seeder rå verdi via `defaultValue` og lar
    // ix-field formatere. Controlled `value` reconciles via refreshFormat under.
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
                    name={name}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-label={ariaLabel}
                    data-format={typeof format === 'string' ? format : undefined}
                    data-format-pattern={formatPattern}
                    data-format-live={formatLive === undefined ? undefined : String(formatLive)}
                    // Formatter-modus: seed rå via defaultValue (native lyttere over
                    // leverer onChange/onBlur med rå verdi). Uten formatter: vanlig
                    // controlled/uncontrolled rett på inputen.
                    {...(hasFormatter
                        ? { defaultValue: (value ?? defaultValue ?? '') as string | number | readonly string[] }
                        : { value, defaultValue, onChange, onBlur })}
                />
                {suffix && <div data-field="suffix">{suffix}</div>}
            </div>
        </Field>
    );
});
