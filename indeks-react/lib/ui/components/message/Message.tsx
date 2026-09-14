import { cn } from '../../../cn';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { useMessageRegion } from '../message-region/MessageRegionContext';
import { InteractiveIcon } from '../interactive-icon/InteractiveIcon';
import type { IconName } from '../../icons/icon-types';

export type MessageStatus = 'info' | 'success' | 'warning' | 'danger';

// Flat interface som extender HTMLAttributes — ikke type-alias med `&`, som
// bryter react-docgen-typescript (tom Storybook Controls). Arven gir `id`,
// `tabIndex`, `data-*`, `aria-*` og resten av div-attributtene: uten dem kunne
// meldingen ikke gjøres til et fokus- eller ankermål, og mønstre som en
// feiloppsummering måtte pakke <Message> i en ekstra <div role="group">.
export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
    /** Status; styrer farge og ikon. Settes som `data-status` slik at
     *  fargevariablene (`--ix-color-status-*`) kobles automatisk. */
    status: MessageStatus;
    /**
     * Valgfri overskrift over budskapet.
     *
     * Merk at denne OVERSTYRER HTML-attributtet `title` (nettleserens tooltip):
     * teksten rendres som en synlig overskrift og settes ikke på `<div>`-en.
     */
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
    /**
     * Sett `false` for å ikke annonsere meldingen i det hele tatt. Bruk det når
     * noe ANNET allerede gjør at meldingen leses opp — typisk at du flytter
     * fokus til den eller til en forelder. Uten dette blir meldingen lest to
     * ganger: én gang av fokusflyttingen og én gang av live-regionen.
     * @default true
     */
    announce?: boolean;
}

/** Semantisk ikonnavn per status (sendes til badge-ikonet). */
const STATUS_ICON: Record<MessageStatus, IconName> = {
    info: 'info_i',
    success: 'check',
    warning: 'priority_high',
    danger: 'priority_high',
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
        announce = true,
        className,
        ...rest
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
        if (closed || !announce) {
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
    }, [region, status, announce, announceOnPageLoad, announceText, title, children, closed]);

    if (closed) {
        return null;
    }

    function handleClose(): void {
        setClosed(true);
        onClose?.();
    }

    return (
        // `rest` spres FØRST: attributtene komponenten eier selv (data-status,
        // data-full-width) skal ikke kunne overskrives utenfra — de er utledet av
        // props, og en `data-status` som ikke matcher `status` gir farge og ikon
        // som spriker.
        <div
            ref={ref}
            {...rest}
            className={cn('ix-message', className)}
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
                <InteractiveIcon
                    className="ix-message__close"
                    name="close"
                    size="md"
                    aria-label={closeLabel}
                    onClick={handleClose}
                />
            )}
        </div>
    );
});
