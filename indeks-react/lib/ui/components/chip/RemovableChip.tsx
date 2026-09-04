import { cn } from '../../../cn';
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
    /** Viser chipen i feiltilstand med mørkerødt fyll. Slår `readOnly` hvis begge er satt. */
    error?: boolean;
    /**
     * Viser chipen som skrivebeskyttet: nedtonet grå flate, og `onRemove` kalles
     * ikke. Setter `aria-disabled` — en `<button>` har ingen native read-only-
     * tilstand, og en chip som ser inaktiv ut men likevel fjerner seg er en felle.
     */
    readOnly?: boolean;
}

/**
 * Removable chip — en chip som representerer et aktivt valg og kan fjernes.
 * Hele chipen er fjern-knappen; krysset er et dekorativt CSS-ikon (`::after`).
 * Tynn wrapper over CSS-klassen `.ix-chip` med `data-removable`.
 */
export const RemovableChip = forwardRef<HTMLButtonElement, RemovableChipProps>(
    function RemovableChip(
        {
            children,
            size = 'md',
            removeLabel,
            onRemove,
            error,
            readOnly,
            onClick,
            type,
            className,
            ...props
        },
        ref
    ): JSX.Element {
        // Samme rangering som RadioGroup og CheckboxGroup utleder data-state med.
        const dataState = error ? 'error' : readOnly ? 'readonly' : undefined;

        function handleClick(event: MouseEvent<HTMLButtonElement>): void {
            if (readOnly) {
                event.preventDefault();
                return;
            }
            onClick?.(event);
            onRemove?.();
        }

        return (
            <button
                ref={ref}
                type={type ?? 'button'}
                className={cn('ix-chip', className)}
                data-removable=""
                data-size={size !== 'md' ? size : undefined}
                data-state={dataState}
                aria-disabled={readOnly ? 'true' : undefined}
                aria-label={`${children} ${removeLabel}`}
                onClick={handleClick}
                {...props}
            >
                {children}
            </button>
        );
    }
);
