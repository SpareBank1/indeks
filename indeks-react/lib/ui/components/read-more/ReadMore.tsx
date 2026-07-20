import clsx from 'clsx';
import { forwardRef } from 'react';
import type { JSX, ReactNode } from 'react';

export type ReadMoreProps = {
    /**
     * Klikkbar label (`<summary>`) — kort og beskrivende, må gi mening lest
     * alene. Kan inneholde et prefiks-ikon, men teksten er hovedbæreren.
     */
    label: ReactNode;
    /**
     * Innholdet som avsløres når seksjonen åpnes — tekst, lister, lenker eller
     * andre komponenter.
     */
    children?: ReactNode;
    /**
     * Start seksjonen åpen. Speiler native `<details open>`. @default false
     */
    defaultOpen?: boolean;
    /** Ekstra CSS-klasser på rot-`<details>`. */
    className?: string;
};

/**
 * ReadMore viser og skjuler én frittstående tekstblokk bak en klikkbar label.
 * Rendres som et native `<details>` med `<summary>`, så tastatur og skjermleser
 * fungerer uten ekstra oppsett. Til forskjell fra `Accordion` er dette én enkelt
 * seksjon — bruk `Accordion` når du har flere seksjoner som hører sammen.
 */
export const ReadMore = forwardRef<HTMLDetailsElement, ReadMoreProps>(function ReadMore(
    { label, children, defaultOpen = false, className },
    ref,
): JSX.Element {
    return (
        <details
            ref={ref}
            className={clsx('ix-read-more', className)}
            // `open` brukes som start-tilstand (uncontrolled); native <details>
            // styrer videre åpne/lukke. `|| undefined` holder attributtet ute av
            // DOM når seksjonen ikke er åpen.
            open={defaultOpen || undefined}
        >
            <summary>{label}</summary>
            <div className="ix-read-more__content">{children}</div>
        </details>
    );
});
