import type { ComponentPropsWithoutRef, JSX } from 'react';
import clsx from 'clsx';

export type ProgressBarState = 'active' | 'success' | 'error';

export type ProgressBarProps = {
    /**
     * Fremdrift i prosent (0–100). Verdier utenfor klampes av web componenten
     * (< 0 → 0, > 100 → 100, ikke-numerisk → 0). I `success`/`error` ignoreres
     * verdien visuelt (baren er ferdigstilt/avbrutt).
     */
    value?: number;
    /**
     * Tilstand for prosessen.
     * - `active`: pågående — eksponeres som `role="progressbar"`.
     * - `success`: fullført — viser suksessikon, ikke lenger en progressbar.
     * - `error`: feilet — viser feilikon, ikke lenger en progressbar.
     * @default "active"
     */
    state?: ProgressBarState;
    /**
     * Synlig label som beskriver hva fremdriften gjelder. Kobles programmatisk
     * til baren. i18n: må sendes inn oversatt av konsumenten.
     */
    label?: string;
    /**
     * Valgfri støttetekst under baren. I `error` bør den forklare hva som gikk
     * galt og evt. neste steg. i18n: sendes inn oversatt av konsumenten.
     */
    supportText?: string;
    /** Vis prosentverdien («25 %») i label-raden. Kun relevant i `active`. */
    showValue?: boolean;
    /**
     * Lokalisert skjermlesertekst for verdien (→ `aria-valuetext`), f.eks.
     * «25 av 100». i18n: sendes inn oversatt av konsumenten.
     */
    valueText?: string;
    className?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/**
 * ProgressBar viser fremdrift i én sammenhengende prosess (opplasting,
 * validering, onboarding). Rent informativ og ikke-interaktiv.
 *
 * Tynn wrapper: `<ix-progress-bar>` (web componenten) eier klamping, ARIA-rolle
 * og statusikon. React eksponerer kun props-API-et — ingen logikk dupliseres.
 */
export function ProgressBar({
    value,
    state = 'active',
    label,
    supportText,
    showValue,
    valueText,
    className,
    ...rest
}: ProgressBarProps): JSX.Element {
    return (
        <ix-progress-bar
            class={clsx('ix-progress-bar', className)}
            value={value}
            data-state={state !== 'active' ? state : undefined}
            label={label}
            data-support-text={supportText}
            data-show-value={showValue ? '' : undefined}
            data-value-text={valueText}
            // rest er typet mot <div> (aria-*/data-*/style/event-handlere), mens
            // det intrinsiske elementet typer event-handlere mot IxProgressBar.
            // Verdiene er identiske i praksis — cast for å bygge bro.
            {...(rest as Record<string, unknown>)}
        />
    );
}
