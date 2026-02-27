import clsx from 'clsx';
import {
    type AnchorHTMLAttributes,
    forwardRef,
    type ForwardRefExoticComponent,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import { type Border, type LimitedSpacingProps, type SurfaceColor } from '../../../types/types';

export interface CardProps extends HTMLAttributes<HTMLDivElement>, LimitedSpacingProps {
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

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ children, className, surfaceColor, border = 'default', href, onClick, ...rest }, ref) => {
        const isClickable = Boolean(href || onClick);

        // TODO: Legg til URL-validering for href for å hindre javascript:-protokoll XSS
        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            if (href) {
                window.location.href = href;
            } else if (onClick) {
                onClick(e);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (href) {
                    window.location.href = href;
                }
                // For onClick from keyboard, we'll just trigger the href or ignore
                // since mixing onClick with keyboard events can be complex
            }
        };

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

        return (
            <div
                className={cardClass}
                ref={ref}
                {...(isClickable && {
                    tabIndex: 0,
                    role: href ? 'link' : 'button',
                    onClick: handleClick,
                    onKeyDown: handleKeyDown,
                })}
                {...rest}
            >
                {children}
            </div>
        );
    }
) as ForwardRefExoticComponent<CardProps> & {
    Action: typeof Action;
};

Card.displayName = 'Card';
Card.Action = Action;
