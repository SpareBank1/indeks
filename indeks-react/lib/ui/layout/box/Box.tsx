import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react';
import {
    extractSpacingClassnameFromProps,
    type Border,
    type Size,
    type SpacingProps,
    type SurfaceColor,
} from '../../../types/types';

export type BoxProps<As extends ElementType = 'div'> = {
    as?: As;
    ref?: React.Ref<HTMLElement>;
    children?: ReactNode;
    className?: string;
    surfaceColor?: SurfaceColor;
    border?: Border;
    fullWidth?: boolean;
    justifyContent?: 'start' | 'end' | 'center' | 'space-between';
    alignItems?: 'start' | 'end' | 'center' | 'baseline';
    gap?: Size;
} & SpacingProps &
    ComponentPropsWithoutRef<As>;

export function Box<As extends ElementType = 'div'>(props: BoxProps<As>): JSX.Element {
    const {
        border,
        gap,
        className,
        surfaceColor,
        fullWidth,
        justifyContent,
        alignItems,
        as: Component = 'div',
        ...restProps
    } = {
        ...props,
    };

    const { spacingClassName, propsWitoutSpacingProps } = extractSpacingClassnameFromProps(restProps);

    const _className = clsx(
        'ix-box',
        {
            [`ix-color-surface-${surfaceColor}-default`]: surfaceColor,
            [`ix-border-${border}`]: border,
            [`ix-gap-${gap}`]: gap,
            'ix-full-width': !!fullWidth,
            [`ix-justify-${justifyContent}`]: justifyContent,
            [`ix-items-${alignItems}`]: alignItems,
        },
        spacingClassName,
        className
    );

    return <Component {...propsWitoutSpacingProps} className={_className} />;
}
