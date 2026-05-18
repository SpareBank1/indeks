import clsx from 'clsx';
import type { ElementType, JSX } from 'react';
import type { IconName } from './icon-types';

export type IconProps<As extends ElementType> = {
    as?: As;
    className?: string;
    ariaLabel?: React.ComponentProps<'span'>['aria-label'];

    size?: 'sm' | 'md' | 'lg' | 'xl';
} & (
    | {
          /** Navn på ikonet med bruk av fellesbetegnelser for SpareBank1. Gjensidig utelukkende med `materialDesignName`. */
          name: IconName;
          materialDesignName?: never;
      }
    | {
          name?: never;
          /** Navn på Material Design-ikonet. Gjensidig utelukkende med `name`. */
          materialDesignName: string;
      }
);

export function Icon<As extends ElementType = 'ix-icon'>(props: IconProps<As>): JSX.Element {
    const {
        as: Component = 'ix-icon',
        className,
        ariaLabel,
        name,
        materialDesignName,
        size = 'md',
        ...restProps
    } = props;

    return (
        <Component
            aria-label={ariaLabel}
            {...restProps}
            name={name}
            materialdesignname={materialDesignName}
            size={size !== 'md' ? size : undefined}
            className={clsx('ix-icon', className)}
        />
    );
}
