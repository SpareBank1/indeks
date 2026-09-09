import { cn } from '../../../cn';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, JSX } from 'react';
import { Icon } from '../../icons';
import type { IconName } from '../../icons';
import type { Status } from '../../../types/types';

export type InteractiveIconStatus = Status;

export type InteractiveIconProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Navn på ikonet som vises. Sendes videre til `Icon`. */
    name: IconName;
    /** Tilgjengelig navn for knappen. Påkrevd — må oversettes av konsumenten (i18n). */
    'aria-label': string;
    /**
     * Fargetema for hover/pressed/focus. Utelates den, arver ikonet status fra
     * nærmeste `data-status`-forelder — og er nøytralt uten en slik forelder.
     * `"neutral"` er derimot et eksplisitt valg som bryter arven.
     */
    status?: InteractiveIconStatus;
    /** Størrelse på knappen og ikonet. @default "md" */
    size?: 'sm' | 'md' | 'lg' | 'xl';
};

export const InteractiveIcon = forwardRef<HTMLButtonElement, InteractiveIconProps>(
    function InteractiveIcon({ name, status, size = 'md', className, ...props }, ref): JSX.Element {
        return (
            <button
                ref={ref}
                type="button"
                className={cn('ix-interactive-icon', className)}
                data-size={size !== 'md' ? size : undefined}
                data-status={status}
                {...props}
            >
                <Icon name={name} size={size} aria-hidden />
            </button>
        );
    },
);
