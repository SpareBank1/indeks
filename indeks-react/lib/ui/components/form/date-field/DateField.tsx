import { forwardRef, useCallback, useEffect, useId, useRef, type ChangeEventHandler, type FocusEventHandler } from 'react';
import type { IxDateField } from '@sb1/indeks-web';
import { Field } from '../field/Field';
import { createFieldEvent } from '../synthetic-events';

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
    /**
     * Event-basert change-handler. Får et syntetisk change-event der ISO-verdien
     * (`åååå-mm-dd`, tom streng når ufullstendig) ligger i `event.target.value`, så
     * `{...register('felt')}` kan spres rett på komponenten; med `<Controller>`
     * binder du `field.onChange` direkte.
     */
    onChange?: ChangeEventHandler<HTMLInputElement>;
    /** Kalles når fokus forlater feltet (RHF touched-state, `mode: 'onBlur'`). */
    onBlur?: FocusEventHandler<HTMLInputElement>;
    /**
     * Tidligste valgbare dato i ISO-format (`åååå-mm-dd`). Sperrer i kalenderen.
     * `number` aksepteres for å være spreadbar med `{...register()}` (RHF-typen), men
     * bruk ISO-streng.
     */
    min?: string | number;
    /**
     * Seneste valgbare dato i ISO-format (`åååå-mm-dd`). Sperrer i kalenderen.
     * `number` aksepteres for å være spreadbar med `{...register()}` (RHF-typen), men
     * bruk ISO-streng.
     */
    max?: string | number;
    /** aria-label på kalenderknappen (i18n — konsumenten oversetter). */
    openLabel: string;
    /**
     * Lar et tapp hvor som helst i feltet åpne enhetens innebygde datovelger.
     * Kun aktivt på touch-enheter; på desktop har flagget ingen effekt. Standard
     * `false` — der fokuserer et tapp feltet for manuell tasting, og kalenderen
     * åpnes via knappen.
     */
    nativePickerOnMobile?: boolean;
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
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(function DateField(
    {
        label,
        ariaLabel,
        name,
        value: controlledValue,
        defaultValue,
        onChange,
        onBlur,
        min,
        max,
        openLabel,
        nativePickerOnMobile,
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

    // Les ISO fra den native date-inputen (kilden for ISO-verdien utad). Returnerer
    // `null` når den native inputen ennå ikke er generert (under mount), så vi kan
    // skille «feltet er tomt» (`''`) fra «WC-en har ikke seedet enda» (fall tilbake til
    // siste seed). Til event-payload brukes `?? ''`.
    const readIso = useCallback(
        (): string | null => hostRef.current?.querySelector<HTMLInputElement>('input.ix-date-field__native')?.value ?? null,
        []
    );

    // I register-modus er ix-date-field ISO-verdien eid av WC-en: den synlige
    // dd.mm.åååå-inputen er formatert og den native <input type="date"> (generert
    // etter mount, aria-hidden + tabindex=-1) bærer ISO. RHF sin register() er
    // ref-sentrisk (leser `ref.value`, skriver `ref.value = iso`, `ref.focus()` ved
    // feil), så vi kan ikke gi den verken host-elementet (ingen `value`-property) eller
    // den native inputen (finnes ikke ved ref-callback, og er skjult). I stedet
    // videresender vi en PROXY (samme grep som TextField formatter-modus): `get value`
    // leser ISO fra native, `set value` skriver ISO til host-ens value-attributt (WC-en
    // observerer det og seeder både synlig + native via _seedFromIso), og `focus()`
    // delegerer til den synlige inputen. Slik bindes DateField med `{...register('felt')}`.
    const lastSeedRef = useRef<string | null>(null);
    const proxyRef = useRef<HTMLInputElement | null>(null);
    if (proxyRef.current === null) {
        const proxy = {
            name: '',
            focus(): void {
                hostRef.current
                    ?.querySelector<HTMLInputElement>('.ix-text-field input:not(.ix-date-field__native)')
                    ?.focus();
            },
            get value(): string {
                // `null` = native input finnes ikke enda (mount): fall tilbake til siste
                // seed. `''` = feltet er reelt tomt (bruker slettet): respekter det.
                const iso = readIso();
                return iso ?? lastSeedRef.current ?? '';
            },
            set value(next: string | null) {
                const iso = next == null ? '' : String(next);
                lastSeedRef.current = iso;
                // WC-en observerer `value`-attributtet og seeder synlig + native ISO.
                hostRef.current?.setAttribute('value', iso);
            },
        };
        proxyRef.current = proxy as unknown as HTMLInputElement;
    }
    proxyRef.current.name = name ?? '';

    // Videresend proxy-en til `ref`. Sett `hostRef.current` FØR forwarding: RHF kan
    // trigge `proxy.value = default` synkront i sin ref-callback (mount-seed), og
    // setteren trenger host-en for å skrive value-attributtet. Memoisert (kun `ref`
    // i deps) så RHF ikke av/re-registrerer refen hver render.
    const setHostRef = useCallback(
        (node: IxDateField | null): void => {
            hostRef.current = node;
            const forwarded = proxyRef.current;
            if (typeof ref === 'function') ref(forwarded);
            else if (ref) ref.current = forwarded;
        },
        [ref]
    );

    // Lytt på WC-ens change-event og emit et syntetisk change-event med ISO i
    // target.value (delt form med de andre felt-komponentene, se ../synthetic-events),
    // så både register() og <Controller> leser verdien likt.
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        const handler = (event: Event) => {
            const cb = onChangeRef.current;
            if (!cb) return;
            cb(createFieldEvent(event.type, { name: name ?? '', value: readIso() ?? '' }, event) as unknown as React.ChangeEvent<HTMLInputElement>);
        };
        host.addEventListener('change', handler);
        return () => host.removeEventListener('change', handler);
    }, [name, readIso]);

    // Rapporter blur når fokus forlater HELE feltet — ikke ved intern flytting mellom
    // synlig input, kalenderknapp og native input (focusout bobler, relatedTarget
    // innenfor host betyr fortsatt fokusert). RHF bruker dette til touched-state.
    const onBlurRef = useRef(onBlur);
    onBlurRef.current = onBlur;
    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        const handler = (event: FocusEvent) => {
            const cb = onBlurRef.current;
            if (!cb) return;
            const next = event.relatedTarget as Node | null;
            if (next && host.contains(next)) return;
            cb(createFieldEvent('blur', { name: name ?? '', value: readIso() ?? '' }, event) as unknown as React.FocusEvent<HTMLInputElement>);
        };
        host.addEventListener('focusout', handler);
        return () => host.removeEventListener('focusout', handler);
    }, [name, readIso]);

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
                ref={setHostRef}
                class="ix-date-field"
                name={name}
                min={min == null ? undefined : String(min)}
                max={max == null ? undefined : String(max)}
                // Kontrollert: sett value-attributtet (ISO) → WC seeder native +
                // synlig. Ukontrollert: WC leser startverdien fra defaultValue via
                // value-attributtet ved mount, deretter eier den tilstanden.
                value={isControlled ? (controlledValue ?? '') : defaultValue}
                disabled={disabled || undefined}
                readonly={readOnly || undefined}
                data-state={dataState}
                data-open-label={openLabel}
                data-native-picker-mobile={nativePickerOnMobile || undefined}
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
