import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react';
import type { ComponentSize } from '../../../types/types';

export type TagVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export type TagProps<As extends ElementType> = {
    as?: As;
    children?: ReactNode;
    className?: string;
    variant?: TagVariant;
    size?: ComponentSize;
    type?: 'emphasis' | 'subtle';
} & ComponentPropsWithoutRef<As>;

export function Tag<As extends ElementType = 'span'>(props: TagProps<As>): JSX.Element {
    const {
        as: Component = 'span',
        className,
        variant = 'neutral',
        type = 'emphasis',
        size = 'md',
        ...restProps
    } = {
        ...props,
    };

    return (
        <Component
            {...restProps}
            data-size={size}
            className={clsx('ix-tag', `ix-tag--${variant}-${type}`, className)}
        />
    );
}
