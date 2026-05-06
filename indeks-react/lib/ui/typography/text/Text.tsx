import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react';
export type TextProps<As extends ElementType> = {
    /** Elementtypen som skal brukes - standard er 'p' */
    as?: As;
    /** Innholdet som skal vises i tekst-komponenten */
    children?: ReactNode;
    /** Ekstra CSS-klasser som skal legges til komponenten */
    className?: string;
    /** Tekststørrelse - standard er 'md' */
    size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
    /** Spacing under teksten/avsnittet */
    addRecommendedSpacing?: boolean;
    /** Brukes når teksten strekker seg over flere linjer. Øker linjehøyden for bedre lesbarhet */
    long?: boolean;
} & ComponentPropsWithoutRef<As>;

export function Text<As extends ElementType = 'p'>(props: TextProps<As>): JSX.Element {
    const {
        as: Component = 'p',
        className,
        addRecommendedSpacing,
        long,
        size = 'md',
        ...restProps
    } = {
        ...props,
    };

    return (
        <Component
            {...restProps}
            data-size={size}
            className={clsx('ix-text', { 'ix-mb-md': addRecommendedSpacing, 'ix-text--long': long }, className)}
        />
    );
}
