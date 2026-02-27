import clsx from 'clsx';
import type { ElementType, JSX } from 'react';
import { getIconName, type IconName } from './icon-types';
import type { MaterialDesignIconName } from './material-design-icon-types';

export type IconProps<As extends ElementType> = {
    as?: As;
    className?: string;
    ariaLabel?: React.ComponentProps<'span'>['aria-label'];

    size?: 'sm' | 'md' | 'lg' | 'xl';
} & (
    | {
          /** Navn på ikonet men bruk av fellesbetegnelser for SpareBank1. Gjensidig utelukkende med `materialDesignName`. */
          name: IconName;
          materialDesignName?: never;
      }
    | {
          name?: never;
          /** Navn på Material Design-ikonet. Gjensidig utelukkende med `name`. */
          materialDesignName: MaterialDesignIconName;
      }
);

const ICON_CDN_BASE = 'https://cdn.sparebank1.no/icons';

export function Icon<As extends ElementType = 'span'>(props: IconProps<As>): JSX.Element {
    const {
        as: Component = 'span',
        className,
        ariaLabel,
        name,
        materialDesignName,
        size = 'md',
        ...restProps
    } = {
        ...props,
    };

    const iconName = (name && getIconName(name)) || materialDesignName;

    return (
        <Component
            role="img"
            aria-label={ariaLabel}
            aria-hidden={!ariaLabel}
            {...restProps}
            className={clsx('ix-icon', { [`ix-icon--${size}`]: size && size !== 'md' }, className)}
            style={{
                maskImage: `url(${ICON_CDN_BASE}/${iconName}.svg)`,
                WebkitMaskImage: `url(${ICON_CDN_BASE}/${iconName}.svg)`,
            }}
        />
    );
}
