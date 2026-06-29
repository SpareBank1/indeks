import clsx from 'clsx';
import { forwardRef } from 'react';
import type {
    ButtonHTMLAttributes,
    ComponentPropsWithRef,
    ElementType,
    FC,
    JSX,
    ReactNode,
    RefAttributes,
} from 'react';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** @default "md" */
    size?: 'sm' | 'md';
    children?: ReactNode;
    /** Render som annet element eller komponent, f.eks. "a". @default "button" */
    as?: ElementType;
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
>(function Chip({ as, children, size = 'md', type, className, ...props }, ref): JSX.Element {
    const Component = (as ?? 'button') as ElementType;
    return (
        <Component
            ref={ref}
            className={clsx('ix-chip', className)}
            data-size={size !== 'md' ? size : undefined}
            type={Component === 'button' ? (type ?? 'button') : type}
            {...props}
        >
            {children}
        </Component>
    );
});
