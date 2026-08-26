import { cn } from '../../../cn';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, JSX } from 'react';
import { Icon } from '../../icons';
import type { IconName } from '../../icons';

export type InteractiveIconStatus = 'default' | 'info' | 'success' | 'warning' | 'danger';

export type InteractiveIconProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Navn på ikonet som vises. Sendes videre til `Icon`. */
    name: IconName;
    /** Tilgjengelig navn for knappen. Påkrevd — må oversettes av konsumenten (i18n). */
    'aria-label': string;
    /** Fargetema for hover/pressed/focus. @default "default" */
    status?: InteractiveIconStatus;
    /** Størrelse på knappen og ikonet. @default "md" */
    size?: 'xs' | 'sm' | 'md' | 'lg';
};

export const InteractiveIcon = forwardRef<HTMLButtonElement, InteractiveIconProps>(
    function InteractiveIcon(
        { name, status = 'default', size = 'md', className, ...props },
        ref,
    ): JSX.Element {
        return (
            <button
                ref={ref}
                type="button"
                className={cn('ix-interactive-icon', className)}
                data-size={size !== 'md' ? size : undefined}
                data-status={status !== 'default' ? status : undefined}
                {...props}
            >
                <Icon name={name} size={size === 'xs' ? 'sm' : size} aria-hidden />
            </button>
        );
    },
);
