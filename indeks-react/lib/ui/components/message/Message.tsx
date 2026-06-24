import clsx from 'clsx';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { JSX, ReactNode } from 'react';
import { useMessageRegion } from '../message-region/MessageRegionContext';
import type { IconName } from '../../icons/icon-types';

export type MessageStatus = 'info' | 'success' | 'warning' | 'danger';

export type MessageProps = {
    /** Status; styrer farge og ikon. Settes som `data-status` slik at
     *  fargevariablene (`--ix-color-status-*`) kobles automatisk. */
    status: MessageStatus;
    /** Valgfri overskrift over budskapet. */
    title?: string;
    /** Budskapet — alltid påkrevd. Lenker skrives som children med Indeks-lenken
     *  `LinkText`. */
    children: ReactNode;
    /** aria-label på lukkeknappen. Lukkeknappen vises kun når denne er satt. */
    closeLabel?: string;
    /** Kalles når brukeren klikker på lukkeknappen, etter at meldingen er skjult. */
    onClose?: () => void;
    /**
     * Full bredde: meldingen strekker seg til full bredde av forelderen i
     * stedet for å krympe til innholdsbredden (f.eks. i en vertikal `VStack`/
     * `ix-stack`). Settes som `data-full-width`. @default false
     */
    fullWidth?: boolean;
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
     * teksten (tittel + brødtekst). Bruk denne for å lese opp noe kortere enn
     * det som vises, f.eks. når innholdet er rikt (liste, lenker).
     */
    announceText?: string;
    className?: string;
};

/** Semantisk ikonnavn per status (sendes til badge-ikonet). */
const STATUS_ICON: Record<MessageStatus, IconName> = {
    info: 'info',
    success: 'hake',
    warning: 'utropstegn',
    danger: 'utropstegn',
};

export const Message = forwardRef<HTMLDivElement, MessageProps>(function Message(
    {
        status,
        title,
        children,
        closeLabel,
        onClose,
        fullWidth = false,
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
        region.announce(text, announceOnPageLoad);
    }, [region, status, announceOnPageLoad, announceText, title, children, closed]);

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
            className={clsx('ix-message', className)}
            data-status={status}
            data-full-width={fullWidth ? '' : undefined}
        >
            {/* Dekorativt statusikon — sirkel (status-`fill` via CSS) +
                glyf (semantisk navn per status). */}
            <ix-icon data-badge="" name={STATUS_ICON[status]} aria-hidden="true" />
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
