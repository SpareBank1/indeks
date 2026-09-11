import { cn } from '../../../cn';
import { forwardRef } from 'react';
import type {
    ButtonHTMLAttributes,
    ComponentPropsWithRef,
    ElementType,
    FC,
    JSX,
    MouseEvent,
    ReactNode,
    RefAttributes,
} from 'react';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** @default "md" */
    size?: 'sm' | 'md';
    children?: ReactNode;
    /** Render som annet element eller komponent, f.eks. "a". @default "button" */
    as?: ElementType;
    /** Viser chipen i feiltilstand med rød kant. Slår `readOnly` hvis begge er satt. */
    error?: boolean;
    /**
     * Viser chipen som skrivebeskyttet: nedtonet grå flate, ingen klikkrespons.
     * Setter `aria-disabled` — en `<button>` har ingen native read-only-tilstand,
     * og en fokuserbar chip som ser inaktiv ut men fortsatt fyrer `onClick` er en
     * felle. Chipen beholder tab-fokus, så innholdet kan fortsatt leses opp.
     */
    readOnly?: boolean;
}

interface OverridableComponent<Component, Element extends HTMLElement> {
    (props: Component & RefAttributes<Element>): ReturnType<FC>;
    <As extends ElementType>(
        props: { as: As } & Component & Omit<ComponentPropsWithRef<As>, keyof Component | 'as'>,
    ): ReturnType<FC>;
}

/**
 * Button chip — en interaktiv chip som fungerer som en knapp og trigger en
 * handling. Tynn wrapper over CSS-klassen `.ix-chip`. Har ingen vedvarende
 * valgt tilstand.
 */
export const Chip: OverridableComponent<ChipProps, HTMLButtonElement> = forwardRef<
    HTMLButtonElement,
    ChipProps
>(function Chip(
    { as, children, size = 'md', error, readOnly, type, className, onClick, ...props },
    ref
): JSX.Element {
    const Component = (as ?? 'button') as ElementType;
    // Samme rangering som RadioGroup og CheckboxGroup utleder data-state med.
    const dataState = error ? 'error' : readOnly ? 'readonly' : undefined;

    function handleClick(event: MouseEvent<HTMLButtonElement>): void {
        if (readOnly) {
            event.preventDefault();
            return;
        }
        onClick?.(event);
    }

    return (
        <Component
            ref={ref}
            className={cn('ix-chip', className)}
            data-size={size !== 'md' ? size : undefined}
            data-state={dataState}
            aria-disabled={readOnly ? 'true' : undefined}
            type={Component === 'button' ? (type ?? 'button') : type}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Component>
    );
});
