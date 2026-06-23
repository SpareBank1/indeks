import { createContext, useContext } from 'react';

/** Status styrer hvilken live-region (polite/assertive) en melding annonseres i. */
export type MessageAnnounceStatus = 'info' | 'success' | 'warning' | 'danger';

export type MessageRegionContextValue = {
    /**
     * Annonser `text` i riktig live-region ut fra `status` (info/success →
     * polite, warning/danger → assertive).
     *
     * `announceOnPageLoad` overstyrer stille-ved-sidelast: normalt annonseres
     * kun meldinger som settes inn *etter* at siden er ferdig lastet, slik at en
     * side full av meldinger ikke leser seg selv opp. Sett `true` for meldinger
     * som er til stede ved første sidelast og likevel skal leses opp (f.eks.
     * SSR-rendret success/feil etter en redirect).
     */
    announce: (text: string, status: MessageAnnounceStatus, announceOnPageLoad: boolean) => void;
};

export const MessageRegionContext = createContext<MessageRegionContextValue | null>(null);

/**
 * Returnerer annonserings-API-et fra nærmeste `<MessageRegion>`, eller `null`
 * hvis komponenten ikke er pakket i en region.
 */
export function useMessageRegion(): MessageRegionContextValue | null {
    return useContext(MessageRegionContext);
}
