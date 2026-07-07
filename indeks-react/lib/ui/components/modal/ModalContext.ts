import { createContext, useContext } from 'react';

export type ModalContextValue = {
    /**
     * Stabil id som `Modal.Title` bruker på sitt `<h2>`, og som `Modal` kobler
     * til `<dialog aria-labelledby>`. Slik navngis dialogen automatisk uten at
     * konsumenten trenger å tenke på ARIA (WCAG 1.3.1 / dialog-mønsteret).
     */
    titleId: string;
    /** Meld fra at en `Modal.Title` er montert, slik at `aria-labelledby` settes. */
    registerTitle: (present: boolean) => void;
    /**
     * Stabil id som `Modal.Description` bruker på sin `<p>`, og som `Modal` kobler
     * til `<dialog aria-describedby>`. Beskrivelsen er valgfri.
     */
    descriptionId: string;
    /** Meld fra at en `Modal.Description` er montert, slik at `aria-describedby` settes. */
    registerDescription: (present: boolean) => void;
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
