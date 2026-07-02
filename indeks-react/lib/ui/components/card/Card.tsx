import clsx from 'clsx';
import {
    type AnchorHTMLAttributes,
    type ButtonHTMLAttributes,
    forwardRef,
    type ForwardRefExoticComponent,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import { type LimitedSpacingProps } from '../../../types/types';
import { Icon, type IconName } from '../../icons';

export interface CardProps extends HTMLAttributes<HTMLElement>, LimitedSpacingProps {
    children?: ReactNode;
    className?: string;
    href?: string;
    /** Ikon for affordanse-chevronen på klikkbart kort. @default "pil-hoyre" */
    chevronIcon?: IconName;
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
    ({ children, className, href, onClick, chevronIcon = 'pil-hoyre', ...rest }, ref) => {
        const isClickable = Boolean(href || onClick);

        const getSpacingClassName = () => {
            const { padding } = rest as LimitedSpacingProps;
            if (!padding) return undefined;
            return `ix-p-${padding}`;
        };

        const cardClass = clsx(
            'ix-card',
            getSpacingClassName(),
            className,
            isClickable && 'ix-card--clickable'
        );

        // Chevronen bæres av et ekte ix-icon (ikke et CSS-tegn) slik at den kan
        // byttes ut via `chevronIcon`. Dekorativt → aria-hidden.
        const chevron = isClickable ? (
            <Icon name={chevronIcon} size="lg" className="ix-card__chevron" aria-hidden />
        ) : null;

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
                    {chevron}
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
                    {chevron}
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
