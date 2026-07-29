import { cn } from '@/cn';
import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react';
import { type ComponentSize } from '../../../types/types';

export type DividerProps<As extends ElementType> = {
    as?: As;
    children?: ReactNode;
    className?: string;
    size?: ComponentSize;
} & ComponentPropsWithoutRef<As>;

export function Divider<As extends ElementType = 'div'>(props: DividerProps<As>): JSX.Element {
    const {
        as: Component = 'div',
        size: _size,
        className,
        ...restProps
    } = {
        ...props,
    };

    return <Component {...restProps} className={cn('ix-divider', className)} />;
}
