import { createContext } from 'react';

export type TabsContextValue = {
    /**
     * Verdien som er valgt ved første render — controlledValue ?? defaultValue.
     * Stabil gjennom komponentens levetid slik at `aria-selected` i JSX ikke
     * endrer seg mellom renders. Web componenten eier tilstanden etter mount
     * (ukontrollert) eller synkes via effect (kontrollert), og siden JSX-verdien
     * er stabil reverterer React aldri det WC-en har satt.
     */
    initialValue: string | undefined;
};

export const TabsContext = createContext<TabsContextValue | null>(null);
