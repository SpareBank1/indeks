import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { Field } from '../field/Field';

export type FileUploadFieldProps = {
    /** Synlig label over feltet. */
    label?: string;
    /** Hjelpetekst under label — bruk til å forklare `accept`/`maxSize`-krav. */
    description?: string;
    /** Feilmelding. Ikke-tom → feltet får aria-invalid via ix-field. */
    errorMessage?: string;
    /**
     * Kompakt knapp (standard) eller dra-og-slipp-dropzone.
     * @default 'compact'
     */
    variant?: 'compact' | 'dropzone';
    /** Maks filstørrelse i bytes. Filer over avvises og gir `errorTooLarge`. */
    maxSize?: number;
    /** Tekst på velg-fil-knappen (i18n — konsumenten oversetter). */
    triggerLabel: string;
    /** Instruksjonstekst i dropzonen (i18n). Kun relevant for `dropzone`. */
    dropzoneLabel?: string;
    /** Suffiks på fjern-knappens aria-label, f.eks. «Fjern» → «Fjern rapport.pdf» (i18n). */
    removeLabel: string;
    /** Mal for live-annonsering ved lagt til fil, `{name}` byttes ut (i18n). */
    addedLabel?: string;
    /** Mal for live-annonsering ved fjernet fil, `{name}` byttes ut (i18n). */
    removedLabel?: string;
    /** Feiltekst når en fil er større enn `maxSize`, `{name}` byttes ut (i18n). */
    errorTooLarge?: string;
    className?: string;
    tooltip?: string;
    tooltipLabel?: string;
    tooltipPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;

// React-laget er tynt: ix-file-upload (WC) genererer trigger/dropzone, fil-liste
// og live-region, holder input.files synk ved fjerning/drop, håndhever maxSize og
// annonserer lagt til/fjernet. ix-field kabler label↔input↔feil. React eksponerer
// kun props og rendrer host + den native <input type="file"> (sannhetskilde for
// form-submit). Native attributter (name, accept, multiple, onChange, ref …)
// går rett på inputen.
export const FileUploadField = forwardRef<HTMLInputElement, FileUploadFieldProps>(function FileUploadField(
    {
        label,
        description,
        errorMessage,
        variant = 'compact',
        maxSize,
        triggerLabel,
        dropzoneLabel,
        removeLabel,
        addedLabel,
        removedLabel,
        errorTooLarge,
        className,
        tooltip,
        tooltipLabel,
        tooltipPlacement,
        id,
        disabled,
        ...inputProps
    },
    ref
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <Field
            inputId={inputId}
            label={label}
            className={className}
            description={description}
            errorMessage={errorMessage}
            disabled={disabled}
            tooltip={tooltip}
            tooltipLabel={tooltipLabel}
            tooltipPlacement={tooltipPlacement}
        >
            <ix-file-upload
                class="ix-file-upload"
                data-variant={variant === 'dropzone' ? 'dropzone' : undefined}
                data-max-size={maxSize}
                trigger-label={triggerLabel}
                dropzone-label={dropzoneLabel}
                remove-label={removeLabel}
                added-label={addedLabel}
                removed-label={removedLabel}
                error-too-large={errorTooLarge}
            >
                <input ref={ref} id={inputId} type="file" disabled={disabled} {...inputProps} />
            </ix-file-upload>
        </Field>
    );
});
