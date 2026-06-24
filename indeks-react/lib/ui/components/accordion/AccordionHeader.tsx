import clsx from 'clsx';
import { forwardRef } from 'react';
import type { JSX, ReactNode } from 'react';

export type AccordionHeaderProps = {
    /** Tittel (kort og beskrivende). Kan inneholde et prefiks-ikon. */
    children?: ReactNode;
    className?: string;
};

/**
 * Headeren for en `Accordion.Item` — klikkflaten som åpner/lukker seksjonen.
 * Rendres som et native `<summary>` og må være første barn i `Accordion.Item`
 * (native-kravet for `<details>`). Gir gratis knapp-semantikk, Tab-fokus og
 * Enter/Space fra nettleseren — ingen ekstra ARIA er nødvendig.
 */
export const AccordionHeader = forwardRef<HTMLElement, AccordionHeaderProps>(function AccordionHeader(
    { children, className },
    ref,
): JSX.Element {
    return (
        <summary ref={ref} className={clsx('ix-accordion__header', className)}>
            {children}
        </summary>
    );
});
