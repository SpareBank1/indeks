import clsx from 'clsx';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { JSX, ReactNode } from 'react';
import { useMessageRegion } from '../message-region/MessageRegionContext';

export type MessageStatus = 'info' | 'success' | 'warning' | 'danger';

export type MessageProps = {
    /** Status; styrer farge, ikon og hvilken live-region meldingen annonseres i
     *  (info/success → polite, warning/danger → assertive). Settes som
     *  `data-status` slik at fargevariablene (`--ix-color-status-*`) kobles
     *  automatisk. */
    status: MessageStatus;
    /** Valgfri tittel. */
    title?: string;
    /** Body-tekst (ikke-expandable) / ekspandert innhold (expandable). Lenker
     *  skrives som children med Indeks-lenken `LinkText`. */
    children?: ReactNode;
    /** aria-label på lukkeknappen. Lukkeknappen vises kun når denne er satt, og
     *  kun i ikke-utvidbar modus (utvidbar Message har ingen lukkeknapp). */
    closeLabel?: string;
    /** Kalles når brukeren klikker på lukkeknappen, etter at meldingen er skjult. */
    onClose?: () => void;
    /** Aktiverer expandable-modus (native `<details>`). */
    expandable?: boolean;
    /** Alltid synlig sammendrag. Brukes kun når `expandable`. */
    summary?: string;
    /** Start ekspandert. Brukes kun når `expandable`. @default false */
    defaultOpen?: boolean;
    /**
     * Annonser meldingen for skjermlesere også når den er til stede ved første
     * sidelast. Normalt annonseres kun meldinger som settes inn *etter* at siden
     * er ferdig lastet (slik at en side full av meldinger ikke leser seg selv
     * opp). Sett `true` for f.eks. SSR-rendret success/feil etter en redirect.
     * Krever at meldingen ligger i en `<MessageRegion>`. @default false
     */
    announceOnPageLoad?: boolean;
    /**
     * Overstyr teksten som leses opp av skjermlesere. Standard er den synlige
     * teksten (tittel + sammendrag/brødtekst). Bruk denne for å lese opp noe
     * kortere enn det som vises, f.eks. når innholdet er rikt (liste, lenker).
     */
    announceText?: string;
    className?: string;
};

/** Material Design-ikon per status (sendes til badge-ikonet). */
const STATUS_ICON: Record<MessageStatus, string> = {
    info: 'info_i',
    success: 'check',
    warning: 'priority_high',
    danger: 'priority_high',
};

export const Message = forwardRef<HTMLElement, MessageProps>(function Message(
    {
        status,
        title,
        children,
        closeLabel,
        onClose,
        expandable = false,
        summary,
        defaultOpen = false,
        announceOnPageLoad = false,
        announceText,
        className,
    },
    ref,
): JSX.Element | null {
    const [closed, setClosed] = useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);
    const region = useMessageRegion();

    // Annonser via den stabile live-regionen i <MessageRegion>. Selve det synlige
    // elementet har bevisst ingen role/aria-live — en region som settes inn samtidig
    // med innholdet annonseres upålitelig (se MessageRegion).
    useEffect(() => {
        if (closed) {
            return;
        }
        if (!region) {
            if (import.meta.env.DEV) {
                console.warn(
                    '<Message> bør ligge i en <MessageRegion> for at meldingen skal annonseres for skjermlesere.',
                );
            }
            return;
        }
        const text = announceText ?? bodyRef.current?.textContent ?? '';
        region.announce(text, status, announceOnPageLoad);
    }, [region, status, announceOnPageLoad, announceText, title, summary, children, closed]);

    if (closed) {
        return null;
    }

    function handleClose(): void {
        setClosed(true);
        onClose?.();
    }

    if (expandable) {
        return (
            <details
                ref={ref as React.Ref<HTMLDetailsElement>}
                className={clsx('ix-message', className)}
                data-status={status}
                data-expandable=""
                open={defaultOpen || undefined}
            >
                <summary className="ix-message__summary">
                    {/* Dekorativt statusikon — sirkel (status-`fill` via CSS) +
                        glyf (materialdesignname per status). */}
                    <ix-icon data-badge="" materialdesignname={STATUS_ICON[status]} aria-hidden="true" />
                    <div ref={bodyRef} className="ix-message__body">
                        {title && <strong className="ix-message__title">{title}</strong>}
                        {summary && <p>{summary}</p>}
                    </div>
                </summary>
                <div className="ix-message__expanded">{children}</div>
            </details>
        );
    }

    return (
        <div
            ref={ref as React.Ref<HTMLDivElement>}
            className={clsx('ix-message', className)}
            data-status={status}
        >
            {/* Dekorativt statusikon — sirkel (status-`fill` via CSS) +
                glyf (materialdesignname per status). */}
            <ix-icon data-badge="" materialdesignname={STATUS_ICON[status]} aria-hidden="true" />
            <div ref={bodyRef} className="ix-message__body">
                {title && <strong className="ix-message__title">{title}</strong>}
                {children}
            </div>
            {closeLabel && (
                <button
                    className="ix-message__close"
                    type="button"
                    aria-label={closeLabel}
                    onClick={handleClose}
                />
            )}
        </div>
    );
});
