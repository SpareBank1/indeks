import clsx from 'clsx';
import { forwardRef } from 'react';
import type { ForwardRefExoticComponent, JSX, ReactNode, RefAttributes } from 'react';
import { AccordionItem } from './AccordionItem';
import { AccordionHeader } from './AccordionHeader';
import { AccordionContent } from './AccordionContent';
import type { AccordionItemProps } from './AccordionItem';
import type { AccordionHeaderProps } from './AccordionHeader';
import type { AccordionContentProps } from './AccordionContent';

export type AccordionProps = {
    /**
     * Seksjonene — `Accordion.Item`-elementer (hvert med en `Accordion.Header`
     * og en `Accordion.Content`).
     */
    children?: ReactNode;
    className?: string;
};

/**
 * Accordion viser og skjuler innhold i seksjoner. Bygger på native
 * `<details>/<summary>`, så tastatur (Tab, Enter/Space) og skjermleser-
 * semantikk kommer gratis — ingen ekstra JavaScript er nødvendig.
 *
 * Seksjonene er uavhengige: flere kan være åpne samtidig. Definer start-åpne
 * seksjoner med `defaultOpen` på den enkelte `Accordion.Item`.
 *
 * @example
 * <Accordion>
 *   <Accordion.Item defaultOpen>
 *     <Accordion.Header>Tittel</Accordion.Header>
 *     <Accordion.Content>Innhold…</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
    { children, className },
    ref,
): JSX.Element {
    return (
        <div ref={ref} className={clsx('ix-accordion', className)}>
            {children}
        </div>
    );
}) as ForwardRefExoticComponent<AccordionProps & RefAttributes<HTMLDivElement>> & {
    Item: typeof AccordionItem;
    Header: typeof AccordionHeader;
    Content: typeof AccordionContent;
};

Accordion.displayName = 'Accordion';
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;

export type { AccordionItemProps, AccordionHeaderProps, AccordionContentProps };
