import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react';
import type { GapSize } from '../../../types/types';

export type HStackAlign = 'start' | 'center' | 'end';

export type HStackProps<As extends ElementType = 'div'> = {
    as?: As;
    ref?: React.Ref<HTMLElement>;
    children?: ReactNode;
    className?: string;
    align?: HStackAlign;
    gap?: GapSize;
} & Omit<ComponentPropsWithoutRef<As>, 'as'>;

export function HStack<As extends ElementType = 'div'>({
    as,
    children,
    className,
    align = 'center',
    gap,
    ...restProps
}: HStackProps<As>): JSX.Element {
    if (as) {
        const Component = as as ElementType;
        const alignClass = align === 'center' ? 'ix-stack-horizontal' : `ix-stack-horizontal-${align}`;
        const gapClass = gap ? `ix-gap-${gap}` : undefined;
        return (
            <Component className={clsx('ix-stack', alignClass, gapClass, className)} {...restProps}>
                {children}
            </Component>
        );
    }
    return (
        <ix-stack horizontal={align === 'center' ? true : align} gap={gap} class={className} {...restProps}>
            {children}
        </ix-stack>
    );
}
