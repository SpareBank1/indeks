import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { JSX, ReactNode } from 'react';
import {
    MessageRegionContext,
    type MessageAnnounceStatus,
    type MessageRegionContextValue,
} from './MessageRegionContext';

export type MessageRegionProps = {
    /** Meldingene (og annet innhold) som skal kunne annonseres. */
    children?: ReactNode;
};

/**
 * MessageRegion eier to alltid-tilstedeværende, visuelt skjulte ARIA-live-regioner
 * — én `polite` (info/success) og én `assertive` (warning/danger) — og deler ut en
 * `announce`-funksjon til `<Message>`-barn via context. Den rendrer ikke noe eget
 * synlig wrapper-element; barna rendres uendret.
 *
 * ## Hvorfor en wrapper?
 *
 * En live-region annonserer kun *endringer* i en region som allerede eksisterte i
 * DOM. Setter man regionen og innholdet inn samtidig (slik en `role`/`aria-live`
 * direkte på meldingen gjør), rekker mange skjermlesere ikke å registrere regionen
 * før innholdet er der — annonseringen blir upålitelig. Ved å holde to *tomme*
 * regioner montert fra start, og skrive tekst inn i dem etterpå, fanges endringen
 * pålitelig. Samme prinsipp som `<ix-field>` sin `[data-field="error"]`-region.
 *
 * ## Stille ved sidelast
 *
 * `readyRef` settes `true` i wrapperens mount-effekt. Siden React kjører barn-
 * effekter *før* forelder-effekten, vil meldinger som finnes ved første render se
 * `readyRef.current === false` og være stille (med mindre de ber om
 * `announceOnPageLoad`). Meldinger som mountes senere ser `true` og annonseres.
 */
export function MessageRegion({ children }: MessageRegionProps): JSX.Element {
    const politeRef = useRef<HTMLDivElement>(null);
    const assertiveRef = useRef<HTMLDivElement>(null);
    const readyRef = useRef(false);
    // Holder rydde-timere så de kan kanselleres ved unmount.
    const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

    useEffect(() => {
        readyRef.current = true;
        const timers = timersRef.current;
        return () => {
            readyRef.current = false;
            for (const timer of timers) {
                clearTimeout(timer);
            }
            timers.clear();
        };
    }, []);

    const announce = useCallback<MessageRegionContextValue['announce']>(
        (text, status: MessageAnnounceStatus, announceOnPageLoad) => {
            if (!text) {
                return;
            }
            // Meldinger som er til stede ved sidelast er stille med mindre de
            // eksplisitt ber om å bli lest opp (f.eks. SSR-redirect-resultat).
            if (!readyRef.current && !announceOnPageLoad) {
                return;
            }
            const region =
                status === 'warning' || status === 'danger' ? assertiveRef.current : politeRef.current;
            if (!region) {
                return;
            }
            // Clear-then-set i neste frame slik at identisk tekst også annonseres
            // på nytt (skjermlesere hopper ellers over uendret textContent).
            region.textContent = '';
            requestAnimationFrame(() => {
                region.textContent = text;
                // Rydd regionen etter et lite øyeblikk så gammel tekst ikke ligger
                // igjen og blir lest ved neste navigasjon i enkelte skjermlesere.
                const timer = setTimeout(() => {
                    if (region.textContent === text) {
                        region.textContent = '';
                    }
                    timersRef.current.delete(timer);
                }, 1000);
                timersRef.current.add(timer);
            });
        },
        [],
    );

    const value = useMemo<MessageRegionContextValue>(() => ({ announce }), [announce]);

    return (
        <MessageRegionContext.Provider value={value}>
            {children}
            {/* Stabile, tomme live-regioner. Må ligge i DOM fra start for at
                annonsering skal være pålitelig. aria-atomic leser hele meldingen
                som én enhet. */}
            <div ref={politeRef} className="ix-sr-only" role="status" aria-live="polite" aria-atomic="true" />
            <div
                ref={assertiveRef}
                className="ix-sr-only"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            />
        </MessageRegionContext.Provider>
    );
}
