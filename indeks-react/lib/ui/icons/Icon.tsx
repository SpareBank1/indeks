import { cn } from '../../cn';
import type { ElementType, JSX } from 'react';
import type { IconName } from './icon-types';

export type IconProps<As extends ElementType> = {
    as?: As;
    className?: string;
    /** Setter role="img" og fjerner aria-hidden. Utelat for dekorative ikoner — de blir aria-hidden automatisk. */
    ariaLabel?: React.ComponentProps<'span'>['aria-label'];
    /** Trengs normalt ikke — ikonet blir aria-hidden automatisk når `ariaLabel` er utelatt. */
    'aria-hidden'?: boolean | 'true' | 'false';

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
            className={cn('ix-icon', className)}
        />
    );
}
