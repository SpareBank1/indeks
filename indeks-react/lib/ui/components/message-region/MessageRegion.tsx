import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { JSX, ReactNode } from 'react';
import { MessageRegionContext, type MessageRegionContextValue } from './MessageRegionContext';

export type MessageRegionProps = {
    /** Meldingene (og annet innhold) som skal kunne annonseres. */
    children?: ReactNode;
};

/**
 * MessageRegion eier én alltid-tilstedeværende, visuelt skjult ARIA-live-region
 * (`polite`) og deler ut en `announce`-funksjon til `<Message>`-barn via context.
 * Den rendrer ikke noe eget synlig wrapper-element; barna rendres uendret.
 *
 * ## Hvorfor en wrapper?
 *
 * En live-region annonserer kun *endringer* i en region som allerede eksisterte i
 * DOM. Setter man regionen og innholdet inn samtidig (slik en `role`/`aria-live`
 * direkte på meldingen gjør), rekker mange skjermlesere ikke å registrere regionen
 * før innholdet er der — annonseringen blir upålitelig. Ved å holde en *tom*
 * region montert fra start, og skrive tekst inn i den etterpå, fanges endringen
 * pålitelig. Samme prinsipp som `<ix-field>` sin `[data-field="error"]`-region.
 *
 * ## Fortløpende opplesning av flere meldinger
 *
 * Hver melding legges til som en *egen* node i regionen (ikke som erstatning av
 * innholdet). Med `aria-atomic="false"` leser skjermleseren kun den tillagte
 * noden, og `polite` køer opplesningene slik at flere meldinger som dukker opp
 * tett etter hverandre alle leses opp i tur — uten å avbryte hverandre. Hver
 * node fjernes igjen etter et lite øyeblikk; det avbryter ikke pågående
 * opplesning (teksten er allerede køet hos skjermleseren) og fjerningen
 * annonseres ikke (default `aria-relevant` leser kun tillegg). Oppryddingen
 * hindrer ubegrenset DOM-vekst og at gammel tekst leses på nytt ved navigasjon.
 *
 * ## Stille ved sidelast
 *
 * `readyRef` settes `true` i wrapperens mount-effekt. Siden React kjører barn-
 * effekter *før* forelder-effekten, vil meldinger som finnes ved første render se
 * `readyRef.current === false` og være stille (med mindre de ber om
 * `announceOnPageLoad`). Meldinger som mountes senere ser `true` og annonseres.
 */
export function MessageRegion({ children }: MessageRegionProps): JSX.Element {
    const regionRef = useRef<HTMLDivElement>(null);
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
        (text, announceOnPageLoad) => {
            if (!text) {
                return;
            }
            // Meldinger som er til stede ved sidelast er stille med mindre de
            // eksplisitt ber om å bli lest opp (f.eks. SSR-redirect-resultat).
            if (!readyRef.current && !announceOnPageLoad) {
                return;
            }
            const region = regionRef.current;
            if (!region) {
                return;
            }
            // Legg meldingen til som en egen node slik at den leses fortløpende
            // i tillegg til ev. andre meldinger som allerede ligger i køen.
            const node = document.createElement('div');
            node.textContent = text;
            region.appendChild(node);
            // Fjern denne noden etter et lite øyeblikk. Avbryter ikke opplesning
            // (teksten er allerede køet) og hindrer DOM-vekst / gjenlesing.
            const timer = setTimeout(() => {
                node.remove();
                timersRef.current.delete(timer);
            }, 1000);
            timersRef.current.add(timer);
        },
        [],
    );

    const value = useMemo<MessageRegionContextValue>(() => ({ announce }), [announce]);

    return (
        <MessageRegionContext.Provider value={value}>
            {children}
            {/* Stabil, tom live-region. Må ligge i DOM fra start for at
                annonsering skal være pålitelig. aria-atomic="false" gjør at kun
                den tillagte noden leses, slik at meldinger køes og leses i tur. */}
            <div
                ref={regionRef}
                className="ix-sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="false"
            />
        </MessageRegionContext.Provider>
    );
}
