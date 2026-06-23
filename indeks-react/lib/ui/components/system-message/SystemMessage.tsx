import clsx from 'clsx';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { JSX, ReactNode } from 'react';
import type { Status } from '../../../types/types';
import { useMessageRegion } from '../message-region/MessageRegionContext';

/** Status/alvorlighetsgrad — delt på tvers av komponenter. @see {@link Status} */
export type SystemMessageStatus = Status;

export type SystemMessageProps = {
    /** Status; styrer farge og ikon (alvorlighetsgrad). Settes som `data-status`
     *  slik at fargevariablene (`--ix-color-status-*`) kobles automatisk. Velg
     *  alltid lavest mulig alvorlighetsgrad som dekker behovet. */
    status: SystemMessageStatus;
    /** Meldingsteksten. Hold den kort — helst på én linje, maks to setninger.
     *  SystemMessage har bevisst ingen tittel; den skal være enklere enn
     *  `Message`. En valgfri enkelt lenke/handling skrives som children med
     *  Indeks-lenken `LinkText`. */
    children?: ReactNode;
    /**
     * Plassering. `'inline'` (standard) er et avrundet kort i innholdet;
     * `'top'` er en full-bredde banner flush øverst på en side eller seksjon.
     * @default 'inline'
     */
    placement?: 'inline' | 'top';
    /** aria-label på lukkeknappen. Lukkeknappen vises kun når denne er satt
     *  (avbrytbar melding). En systemkritisk melding bør være ikke-avbrytbar. */
    closeLabel?: string;
    /** Kalles når brukeren klikker på lukkeknappen, etter at meldingen er skjult.
     *  Konsumenten er ansvarlig for at en lukket melding ikke dukker opp igjen
     *  unødvendig i samme kontekst (f.eks. via lagret tilstand). */
    onClose?: () => void;
    /**
     * Systemkritisk melding som skal annonseres umiddelbart. Setter
     * `role="alert"` (assertiv) på det synlige elementet slik at skjermlesere
     * avbryter pågående opplesning. Flytter ikke fokus. Bruk kun for kritisk
     * informasjon (f.eks. nedetid) — ikke-kritiske meldinger annonseres høflig
     * via `<MessageRegion>`. @default false
     */
    critical?: boolean;
    /**
     * Annonser meldingen for skjermlesere også når den er til stede ved første
     * sidelast. Normalt annonseres kun meldinger som settes inn *etter* at siden
     * er ferdig lastet. Krever at meldingen ligger i en `<MessageRegion>`.
     * Ignoreres når `critical` er satt (da annonseres meldingen via
     * `role="alert"`). @default false
     */
    announceOnPageLoad?: boolean;
    /**
     * Overstyr teksten som leses opp av skjermlesere. Standard er den synlige
     * teksten (tittel + brødtekst).
     */
    announceText?: string;
    className?: string;
};

/** Material Design-ikon per status (sendes til badge-ikonet). */
const STATUS_ICON: Record<SystemMessageStatus, string> = {
    info: 'info_i',
    success: 'check',
    warning: 'priority_high',
    danger: 'priority_high',
};

/**
 * SystemMessage formidler viktig informasjon om systemstatus, endringer,
 * bekreftelser, advarsler eller feil — på system-/flate-nivå. Den deler base-
 * stylingen med `Message`, men er et eget, distinkt konsept: ikke utvidbar, kan
 * plasseres som toppbanner, og kan være systemkritisk (assertiv annonsering).
 *
 * Ikke-kritiske meldinger annonseres høflig (køet) via nærmeste
 * `<MessageRegion>`, akkurat som `Message`. Kritiske meldinger (`critical`) får
 * `role="alert"` på det synlige elementet og annonseres umiddelbart uten å
 * stjele fokus.
 */
export const SystemMessage = forwardRef<HTMLDivElement, SystemMessageProps>(function SystemMessage(
    {
        status,
        children,
        placement = 'inline',
        closeLabel,
        onClose,
        critical = false,
        announceOnPageLoad = false,
        announceText,
        className,
    },
    ref,
): JSX.Element | null {
    const [closed, setClosed] = useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);
    const region = useMessageRegion();

    // Ikke-kritiske meldinger annonseres via den stabile polite-regionen i
    // <MessageRegion>. Kritiske meldinger har role="alert" på selve elementet og
    // annonseres assertivt av nettleseren — da skal vi ikke også skrive til
    // regionen (det ville gitt dobbel opplesning), og <MessageRegion> er ikke
    // påkrevd.
    useEffect(() => {
        if (closed || critical) {
            return;
        }
        if (!region) {
            if (import.meta.env.DEV) {
                console.warn(
                    '<SystemMessage> bør ligge i en <MessageRegion> for at meldingen skal annonseres for skjermlesere (eller settes som `critical`).',
                );
            }
            return;
        }
        const text = announceText ?? bodyRef.current?.textContent ?? '';
        region.announce(text, announceOnPageLoad);
    }, [region, status, critical, announceOnPageLoad, announceText, children, closed]);

    if (closed) {
        return null;
    }

    function handleClose(): void {
        setClosed(true);
        onClose?.();
    }

    return (
        <div
            ref={ref}
            className={clsx('ix-system-message', className)}
            data-status={status}
            data-placement={placement}
            // role="alert" impliserer aria-live="assertive": dynamisk innsatte
            // meldinger avbryter og leses umiddelbart. Settes kun når critical.
            role={critical ? 'alert' : undefined}
        >
            {/* Dekorativt statusikon — sirkel (status-`fill` via CSS) +
                glyf (materialdesignname per status). */}
            <ix-icon data-badge="" materialdesignname={STATUS_ICON[status]} aria-hidden="true" />
            <div ref={bodyRef} className="ix-system-message__body">
                {children}
            </div>
            {closeLabel && (
                <button
                    className="ix-system-message__close"
                    type="button"
                    aria-label={closeLabel}
                    onClick={handleClose}
                />
            )}
        </div>
    );
});
