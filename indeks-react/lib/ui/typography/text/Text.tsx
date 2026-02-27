import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react';
export type TextProps<As extends ElementType> = {
    /** Elementtypen som skal brukes, h1-h6 */
    as?: As;
    /** Innholdet som skal vises i tekst-komponenten */
    children?: ReactNode;
    /** Ekstra CSS-klasser som skal legges til komponenten */
    className?: string;
    /** Ststørrelsen på overskriften, hvis man vil overstyre fra standard */
    size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
    /** Spacing under overskriften, for å få passe luft */
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

    const textClass = `ix-text--${size}`;
    const spacingClass = addRecommendedSpacing ? 'ix-mb-md' : '';
    const longClass = long ? 'ix-text--long' : '';

    return <Component {...restProps} className={clsx('ix-text', textClass, spacingClass, longClass, className)} />;
}
