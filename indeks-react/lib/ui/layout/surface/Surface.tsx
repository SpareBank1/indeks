import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react';
import {
    extractSpacingClassnameFromProps,
    type Border,
    type Radius,
    type Size,
    type SpacingProps,
    type SurfaceColor,
} from '../../../types/types';

export type SurfaceProps<As extends ElementType = 'div'> = {
    as?: As;
    ref?: React.Ref<HTMLElement>;
    children?: ReactNode;
    className?: string;
    surfaceColor?: SurfaceColor;
    border?: Border;
    radius?: Radius;
    fullWidth?: boolean;
    justifyContent?: 'start' | 'end' | 'center' | 'space-between';
    alignItems?: 'start' | 'end' | 'center' | 'baseline';
    gap?: Size;
} & SpacingProps &
    ComponentPropsWithoutRef<As>;

/**
 * Surface er en enkel visuell flate som grupperer innhold, gjerne med en
 * surface-farge. Den er bevisst enklere enn Card (ingen elevation eller
 * klikk-affordanse), og bygger i sin helhet på utility-klasser.
 */
export function Surface<As extends ElementType = 'div'>(props: SurfaceProps<As>): JSX.Element {
    const {
        border,
        radius,
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
        'ix-surface',
        {
            [`ix-color-surface-${surfaceColor}-default`]: surfaceColor,
            [`ix-border-${border}`]: border,
            [`ix-radius-${radius}`]: radius,
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
