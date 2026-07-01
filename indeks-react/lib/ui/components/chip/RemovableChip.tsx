import clsx from 'clsx';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, JSX, MouseEvent } from 'react';

export interface RemovableChipProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    /** Etiketten på chipen. Inngår også i det tilgjengelige navnet. */
    children: string;
    /** @default "md" */
    size?: 'sm' | 'md';
    /**
     * Suffiks som legges til det tilgjengelige navnet, f.eks. "fjern" gir
     * «Sparing fjern». Påkrevd og må sendes inn på brukerens språk (i18n) —
     * komponenten har ingen hardkodet fallback.
     */
    removeLabel: string;
    /** Kalles når chipen fjernes (klikk / Enter / Mellomrom). */
    onRemove?: () => void;
}

/**
 * Removable chip — en chip som representerer et aktivt valg og kan fjernes.
 * Hele chipen er fjern-knappen; krysset er et dekorativt CSS-ikon (`::after`).
 * Tynn wrapper over CSS-klassen `.ix-chip` med `data-removable`.
 */
export const RemovableChip = forwardRef<HTMLButtonElement, RemovableChipProps>(
    function RemovableChip(
        { children, size = 'md', removeLabel, onRemove, onClick, type, className, ...props },
        ref
    ): JSX.Element {
        function handleClick(event: MouseEvent<HTMLButtonElement>): void {
            onClick?.(event);
            onRemove?.();
        }

        return (
            <button
                ref={ref}
                type={type ?? 'button'}
                className={clsx('ix-chip', className)}
                data-removable=""
                data-size={size !== 'md' ? size : undefined}
                aria-label={`${children} ${removeLabel}`}
                onClick={handleClick}
                {...props}
            >
                {children}
            </button>
        );
    }
);
