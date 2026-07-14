import { createContext, useContext } from 'react';

export type ModalContextValue = {
    /**
     * Generert fallback-id som `Modal.Title` bruker på sitt `<h2>` når konsumenten
     * ikke gir en egen `id`. Slik navngis dialogen automatisk uten at konsumenten
     * trenger å tenke på ARIA (WCAG 1.3.1 / dialog-mønsteret).
     */
    titleId: string;
    /**
     * Meld fra hvilken id `Modal.Title` faktisk bruker (egen `id` vinner over
     * fallback), slik at `<dialog aria-labelledby>` peker på RIKTIG element. `null`
     * ved avmontering. Uten dette ville en egen `id` på tittelen brutt koblingen.
     */
    registerTitle: (id: string | null) => void;
    /**
     * Generert fallback-id som `Modal.Description` bruker på sin `<p>` når
     * konsumenten ikke gir en egen `id`. Beskrivelsen er valgfri.
     */
    descriptionId: string;
    /**
     * Meld fra hvilken id `Modal.Description` faktisk bruker (egen `id` vinner),
     * slik at `<dialog aria-describedby>` peker riktig. `null` ved avmontering.
     */
    registerDescription: (id: string | null) => void;
    /** Lukk dialogen — brukes av `Modal.CloseButton`. */
    requestClose: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Intern hjelper for `Modal`-underkomponentene. Kaster hvis en underkomponent
 * brukes utenfor `<Modal>`.
 */
export function useModalContext(component: string): ModalContextValue {
    const ctx = useContext(ModalContext);
    if (!ctx) {
        throw new Error(`${component} må brukes inne i <Modal>.`);
    }
    return ctx;
}
