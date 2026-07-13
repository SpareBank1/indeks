import { forwardRef, useEffect, useId, useRef } from 'react';
import type { IxCombobox } from '@sb1/indeks-web';
import { Field } from '../field/Field';

export type ComboboxOption = {
    value: string;
    label: string;
    /** Valgfri andrelinje under label (f.eks. landkode). */
    description?: string;
    disabled?: boolean;
};

export type ComboboxProps = {
    /** Synlig label over feltet. Utelates hvis `ariaLabel` brukes i stedet. */
    label?: string;
    /** Tilgjengelig navn når det ikke finnes en synlig label. */
    ariaLabel?: string;
    /** Alternativer i lista. */
    options: ComboboxOption[];
    /** Navn på det skjulte <select>-feltet for form-innsending. */
    name?: string;
    /** Flervalg med chips. @default false */
    multiple?: boolean;
    /**
     * Kontrollert verdi. String i single, string[] i multi. Lar React eie
     * valgt-tilstanden; kombiner med `onChange`.
     */
    value?: string | string[];
    /** Ukontrollert startverdi. String i single, string[] i multi. */
    defaultValue?: string | string[];
    /** Kalles med ny verdi (string i single, string[] i multi) ved valg/fjerning. */
    onChange?: (value: string | string[]) => void;
    /** Placeholder i inputfeltet. */
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
    /** Tekst i lista når filteret gir 0 treff (i18n — konsumenten oversetter). */
    noHitsText: string;
    /** aria-label på chevron-knappen (i18n). */
    toggleLabel?: string;
    /** Suffiks på chip-ens aria-label, f.eks. "fjern" → "Norge, fjern" (i18n, multi). */
    removeChipLabel?: string;
    /** aria-label på chip-gruppen (role="group"), f.eks. "Valgte alternativer" (i18n, multi). */
    chipsLabel?: string;
    /** Skjult hint (aria-describedby) på input i multi som forklarer piltast-navigasjon i chips (i18n). */
    arrowHintText?: string;
    /**
     * Mal for skjermleser-annonsering av antall treff ved filtrering (i18n).
     * `{n}` byttes ut med antallet, f.eks. "{n} alternativer". Utelates → ingen annonsering.
     */
    resultsText?: string;
    /** aria-label på toggle-knappen. */
    id?: string;
};

function toValueArray(value: string | string[] | undefined): string[] {
    if (value === undefined) return [];
    return Array.isArray(value) ? value : value ? [value] : [];
}

// React-laget er tynt: ix-combobox (WC) eier all ARIA-kabling, tastatur,
// filtrering, virtual focus, chips, posisjonering og form-synk til skjult
// <select>. React eksponerer kun props-API, kontrollert/ukontrollert value og
// presentasjon. Valgt-tilstanden uttrykkes som aria-selected på options —
// samme kilde WC-en leser fra ved mount og MutationObserver-rewire.
export const Combobox = forwardRef<IxCombobox, ComboboxProps>(function Combobox(
    {
        label,
        ariaLabel,
        options,
        name,
        multiple,
        value: controlledValue,
        defaultValue,
        onChange,
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
        noHitsText,
        toggleLabel,
        removeChipLabel,
        chipsLabel,
        arrowHintText,
        resultsText,
        id,
    },
    ref
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hostRef = useRef<IxCombobox | null>(null);

    const isControlled = controlledValue !== undefined;
    // Ved førstegangsrender bruker vi controlled- eller default-verdien til å
    // markere aria-selected. Etterpå eier WC-en tilstanden (ukontrollert), eller
    // useEffect nedenfor synker den (kontrollert).
    const initialSelected = new Set(toValueArray(isControlled ? controlledValue : defaultValue));

    // Kontrollert modus: speil `value` inn i options' aria-selected når den endres.
    useEffect(() => {
        if (!isControlled) return;
        const host = hostRef.current;
        if (!host) return;
        const selected = new Set(toValueArray(controlledValue));
        for (const option of host.querySelectorAll<HTMLElement>('.ix-combobox__option')) {
            const optValue = option.getAttribute('data-value') ?? '';
            if (selected.has(optValue)) {
                option.setAttribute('aria-selected', 'true');
            } else if (multiple) {
                // Multi: listbox er aria-multiselectable, options beholder "false".
                option.setAttribute('aria-selected', 'false');
            } else {
                // Single (APG): fjern attributtet på uvalgte i stedet for "false".
                option.removeAttribute('aria-selected');
            }
        }
        // WC-en re-synker chips/input/skjult select via sin MutationObserver +
        // interne synk når aria-selected endres ved neste interaksjon; for
        // kontrollert visning holder det å sette attributtet før WC leser det.
    }, [isControlled, controlledValue, multiple]);

    // Lytt på WC-ens change-event og rapporter ny verdi til konsumenten.
    useEffect(() => {
        const host = hostRef.current;
        if (!host || !onChange) return;
        const handler = () => {
            const selected = Array.from(host.querySelectorAll<HTMLElement>('.ix-combobox__option'))
                .filter((o) => o.getAttribute('aria-selected') === 'true')
                .map((o) => o.getAttribute('data-value') ?? '');
            onChange(multiple ? selected : (selected[0] ?? ''));
        };
        host.addEventListener('change', handler);
        return () => host.removeEventListener('change', handler);
    }, [onChange, multiple]);

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
            <ix-combobox
                ref={(node: IxCombobox | null) => {
                    hostRef.current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) ref.current = node;
                }}
                class="ix-combobox"
                name={name}
                multiple={multiple || undefined}
                disabled={disabled || undefined}
                readonly={readOnly || undefined}
                data-state={dataState}
                data-no-hits-text={noHitsText}
                data-arrow-hint-text={arrowHintText}
                data-remove-chip-label={removeChipLabel}
                data-chips-label={chipsLabel}
                data-results-text={resultsText}
            >
                {multiple && <div className="ix-combobox__chips" data-field="chips" />}
                <div className="ix-text-field">
                    <input
                        id={inputId}
                        className="ix-text-field__input"
                        placeholder={placeholder}
                        aria-label={ariaLabel}
                        aria-invalid={errorMessage?.trim() ? 'true' : undefined}
                        required={required}
                    />
                    <button type="button" className="ix-combobox__toggle" aria-label={toggleLabel} />
                </div>
                <div className="ix-combobox__listbox" hidden>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="ix-combobox__option"
                            data-value={option.value}
                            // Single (APG): utelat aria-selected på uvalgte (ikke "false") så
                            // skjermleser ikke leser «ikke valgt» for hvert alternativ. Multi:
                            // listbox er aria-multiselectable, options bærer true/false.
                            aria-selected={
                                initialSelected.has(option.value) ? 'true' : multiple ? 'false' : undefined
                            }
                            aria-disabled={option.disabled ? 'true' : undefined}
                        >
                            <span className="ix-combobox__option-check" aria-hidden="true" />
                            <span className="ix-combobox__option-label">{option.label}</span>
                            {option.description && (
                                <span className="ix-combobox__option-description">{option.description}</span>
                            )}
                        </div>
                    ))}
                </div>
                {/*
                    role="status" er en live region og må BLI i tilgjengelighetstreet.
                    Den starter tom (skjult av CSS :empty) — WC-en fyller inn teksten
                    fra data-no-hits-text når filteret gir 0 treff, ikke via hidden.
                */}
                <div className="ix-combobox__no-hits" role="status" />
                <select data-field="native" name={name} hidden />
            </ix-combobox>
        </Field>
    );
});
