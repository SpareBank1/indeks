import clsx from 'clsx';
import { forwardRef } from 'react';
import type { JSX, ReactNode } from 'react';

export type AccordionContentProps = {
    /** Innholdet i seksjonen — tekst, lister eller andre komponenter. */
    children?: ReactNode;
    className?: string;
};

/**
 * Innholdsområdet for en `Accordion.Item`. Rendres som en `<div>` inni
 * `<details>`, etter `Accordion.Header`. Synlig kun når seksjonen er åpen
 * (native `<details>` styrer dette). Kobles til headeren strukturelt — ingen
 * `aria-controls`/`id` er nødvendig.
 */
export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(function AccordionContent(
    { children, className },
    ref,
): JSX.Element {
    return (
        <div ref={ref} className={clsx('ix-accordion__content', className)}>
            {children}
        </div>
    );
});
