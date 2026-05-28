import type { ComponentPropsWithoutRef, JSX } from 'react';
import clsx from 'clsx';
import type { ComponentSize } from '../../../types/types';

export type SpinnerProps = {
    className?: string;
    /** Synlig tekst under hjulet */
    label?: string;
    /** Tilgjengelig navn for skjermlesere — overstyrer label */
    loadingLabel?: string;
    size?: ComponentSize;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export function Spinner({
    className,
    label,
    loadingLabel,
    size = 'md',
    ...rest
}: SpinnerProps): JSX.Element {
    return (
        <div
            role="status"
            aria-label={loadingLabel ?? label ?? 'Laster...'}
            className={clsx('ix-spinner', className)}
            data-size={size}
            {...rest}
        >
            {label}
        </div>
    );
}
