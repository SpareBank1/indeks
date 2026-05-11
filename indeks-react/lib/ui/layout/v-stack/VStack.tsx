import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react';
import type { GapSize } from '../../../types/types';

export type VStackAlign = 'start' | 'center' | 'end';

export type VStackProps<As extends ElementType = 'div'> = {
    as?: As;
    ref?: React.Ref<HTMLElement>;
    children?: ReactNode;
    className?: string;
    align?: VStackAlign;
    gap?: GapSize;
} & Omit<ComponentPropsWithoutRef<As>, 'as'>;

export function VStack<As extends ElementType = 'div'>({
    as,
    children,
    className,
    align = 'start',
    gap,
    ...restProps
}: VStackProps<As>): JSX.Element {
    if (as) {
        const Component = as as ElementType;
        const alignClass = align === 'start' ? undefined : `ix-stack-vertical-${align}`;
        const gapClass = gap ? `ix-gap-${gap}` : undefined;
        return (
            <Component className={clsx('ix-stack', alignClass, gapClass, className)} {...restProps}>
                {children}
            </Component>
        );
    }
    const vertical = align === 'start' ? undefined : align;
    return (
        <ix-stack vertical={vertical} gap={gap} class={className} {...restProps}>
            {children}
        </ix-stack>
    );
}
