import { cn } from '../../../cn';
import type { ComponentPropsWithoutRef, ElementType, JSX } from 'react';

export type DividerProps<As extends ElementType = 'hr'> = {
    /** @default "hr" */
    as?: As;
    className?: string;
    /** `emphasis` gir et tydeligere skille. Settes som `data-variant`. @default "default" */
    variant?: 'default' | 'emphasis';
} & Omit<ComponentPropsWithoutRef<As>, 'children'>;

/**
 * Horisontal skillelinje. Rendres som `<hr>`, som allerede har rollen
 * `separator`. Andre elementer får rollen satt eksplisitt.
 */
export function Divider<As extends ElementType = 'hr'>(props: DividerProps<As>): JSX.Element {
    const { as: Component = 'hr', variant = 'default', className, ...restProps } = props;

    return (
        <Component
            role={Component === 'hr' ? undefined : 'separator'}
            {...restProps}
            className={cn('ix-divider', className)}
            data-variant={variant !== 'default' ? variant : undefined}
        />
    );
}
