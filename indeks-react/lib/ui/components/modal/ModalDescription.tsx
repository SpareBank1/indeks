import clsx from 'clsx';
import { forwardRef, useEffect } from 'react';
import type { HTMLAttributes, JSX } from 'react';
import { useModalContext } from './ModalContext';

export type ModalDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/**
 * Valgfri beskrivelse i en `Modal`. Rendres som `<p>` og registrerer sin id i
 * `Modal`-konteksten, slik at `<dialog aria-describedby>` peker hit automatisk —
 * skjermlesere leser da beskrivelsen etter tittelen (WCAG 4.1.2).
 *
 * Teksten kommer fra `children` og oversettes av konsumenten (i18n).
 */
export const ModalDescription = forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
    function ModalDescription({ children, className, id, ...props }, ref): JSX.Element {
        const { descriptionId, registerDescription } = useModalContext('Modal.Description');
        // Egen `id` vinner over den genererte; meld faktisk id til `Modal` så
        // `aria-describedby` peker hit.
        const effectiveId = id ?? descriptionId;

        useEffect(() => {
            registerDescription(effectiveId);
            return () => registerDescription(null);
        }, [registerDescription, effectiveId]);

        return (
            <p
                ref={ref}
                id={effectiveId}
                className={clsx('ix-modal__description', className)}
                {...props}
            >
                {children}
            </p>
        );
    },
);
