import clsx from 'clsx';
import {
    type AnchorHTMLAttributes,
    type ButtonHTMLAttributes,
    forwardRef,
    type ForwardRefExoticComponent,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import { type Border, type LimitedSpacingProps, type SurfaceColor } from '../../../types/types';

export interface CardProps extends HTMLAttributes<HTMLElement>, LimitedSpacingProps {
    children?: ReactNode;
    className?: string;
    surfaceColor?: SurfaceColor;
    border?: Border;
    href?: string;
}

export interface ActionProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
    href?: string;
}

const Action = ({ href, children, className, onClick, ...rest }: ActionProps) => {
    const actionClass = clsx('ix-card__action', className);

    if (href) {
        return (
            <a href={href} className={actionClass} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {children}
            </a>
        );
    }

    return (
        <div className={actionClass} onClick={onClick} {...rest}>
            {children}
        </div>
    );
};

export const Card = forwardRef<HTMLElement, CardProps>(
    ({ children, className, surfaceColor, border = 'default', href, onClick, ...rest }, ref) => {
        const isClickable = Boolean(href || onClick);

        const getSpacingClassName = () => {
            const { padding } = rest as LimitedSpacingProps;
            if (!padding) return undefined;
            return `ix-p-${padding}`;
        };

        const cardClass = clsx(
            'ix-card',
            `ix-card--${surfaceColor}`,
            `ix-border-${border}`,
            `ix-color-foreground-${surfaceColor === 'accent' ? 'accent' : 'main'}-default`,
            { [`ix-color-surface-${surfaceColor}-default`]: surfaceColor },
            getSpacingClassName(),
            className,
            isClickable && 'ix-card--clickable'
        );

        // Ekte semantisk element gir tastatur, fokus og rolle gratis:
        // <a> for navigasjon, <button> for handling, <div> for statisk kort.
        if (href) {
            return (
                <a
                    href={href}
                    className={cardClass}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    onClick={onClick}
                    {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
                >
                    {children}
                </a>
            );
        }

        if (onClick) {
            return (
                <button
                    type="button"
                    className={cardClass}
                    ref={ref as React.Ref<HTMLButtonElement>}
                    onClick={onClick}
                    {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
                >
                    {children}
                </button>
            );
        }

        return (
            <div className={cardClass} ref={ref as React.Ref<HTMLDivElement>} {...rest}>
                {children}
            </div>
        );
    }
) as ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLElement>> & {
    Action: typeof Action;
};

Card.displayName = 'Card';
Card.Action = Action;
