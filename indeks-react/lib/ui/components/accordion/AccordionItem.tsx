import clsx from 'clsx';
import { forwardRef } from 'react';
import type { JSX, ReactNode } from 'react';

export type AccordionItemProps = {
    /**
     * Innholdet i seksjonen — forventer en `Accordion.Header` (først) og en
     * `Accordion.Content`.
     */
    children?: ReactNode;
    /**
     * Start seksjonen åpen. Speiler native `<details open>`. @default false
     */
    defaultOpen?: boolean;
    className?: string;
};

/**
 * En enkelt seksjon i en `Accordion`. Rendres som et native `<details>`.
 * Forventer `Accordion.Header` som første barn (klikkflaten / `<summary>`) og
 * `Accordion.Content` etter den.
 */
export const AccordionItem = forwardRef<HTMLDetailsElement, AccordionItemProps>(function AccordionItem(
    { children, defaultOpen = false, className },
    ref,
): JSX.Element {
    return (
        <details
            ref={ref}
            className={clsx('ix-accordion__item', className)}
            // `open` brukes som start-tilstand (uncontrolled); native <details>
            // styrer videre åpne/lukke. `|| undefined` holder attributtet ute av
            // DOM når seksjonen ikke er åpen.
            open={defaultOpen || undefined}
        >
            {children}
        </details>
    );
});
