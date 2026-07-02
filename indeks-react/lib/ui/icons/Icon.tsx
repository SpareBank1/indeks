import clsx from 'clsx';
import type { ElementType, JSX } from 'react';
import type { IconName } from './icon-types';

export type IconProps<As extends ElementType> = {
    as?: As;
    className?: string;
    ariaLabel?: React.ComponentProps<'span'>['aria-label'];

    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Material Design-ikonnavn (f.eks. `"home"`). Vanlige SB1-ikoner autofullføres; alle andre MD-navn godtas også. */
    name: IconName;
};

export function Icon<As extends ElementType = 'ix-icon'>(props: IconProps<As>): JSX.Element {
    const {
        as: Component = 'ix-icon',
        className,
        ariaLabel,
        name,
        size = 'md',
        ...restProps
    } = props;

    return (
        <Component
            aria-label={ariaLabel}
            {...restProps}
            name={name}
            data-size={size !== 'md' ? size : undefined}
            className={clsx('ix-icon', className)}
        />
    );
}
