import { cn } from '../../../cn';
import {
    type AnchorHTMLAttributes,
    type ButtonHTMLAttributes,
    type ComponentPropsWithoutRef,
    type ElementType,
    type FC,
    forwardRef,
    type HTMLAttributes,
    type JSX,
    type MouseEventHandler,
    type ReactNode,
    type RefAttributes,
} from 'react';
import { Icon } from '../../icons';
import { RowLeading } from './RowLeading';
import { RowTrailingLabel } from './RowTrailingLabel';

type RowTitleElement = 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';

interface RowBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'onClick'> {
    /** Radens primære tekst. I en interaktiv rad er den også navnet på lenken eller knappen. */
    title: ReactNode;
    /** Elementet tittelen rendres som. Bruk en overskrift når raden innleder innhold. @default "p" */
    titleAs?: RowTitleElement;
    /** Id på tittelen, så en kontroll i `trailingControl` kan vise til raden med `aria-describedby`. */
    titleId?: string;
    subtitle?: ReactNode;
    description?: ReactNode;
    /** Bruk `<Row.Leading>`. */
    leading?: ReactNode;
    /**
     * Verdi eller status til høyre, f.eks. `<Row.TrailingLabel>` eller en `<Tag>`.
     * Ikke kontroller: bruk `trailingControl`. Typen kan ikke stoppe en kontroll her.
     */
    trailing?: ReactNode;
}

type RowNavigationProps =
    | {
          /** Viser chevron for intern navigasjon. Utelat for å skjule navigasjonsikonet. */
          navigation?: 'internal';
          externalLabel?: never;
      }
    | {
          /** Åpner lenken i ny fane og viser ikonet for ekstern lenke. */
          navigation: 'external';
          /** Skjult tekst lagt til lenkenavnet, f.eks. "(åpnes i ny fane)". Må oversettes av konsumenten. */
          externalLabel: string;
      };

type RowLinkProps = RowNavigationProps & {
    /** Hele raden blir en lenke. Tittelen er lenketeksten. */
    href: string;
    /** Ekstra attributter til `<a>`-elementet (f.eks. `data-*`). */
    linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'target' | 'rel'>;
    /**
     * Router-lenke i stedet for `<a>`, f.eks. `Link` fra Next eller React Router.
     * Props som `to` sendes via `linkProps`. Kan ikke kombineres med ekstern navigasjon.
     */
    linkAs?: never;
    onClick?: never;
    buttonProps?: never;
    trailingControl?: never;
};

type RowButtonProps = {
    /** Hele raden blir en knapp. Tittelen er knappeteksten. */
    onClick: MouseEventHandler<HTMLButtonElement>;
    /** Uten `disabled`: Figma har ingen deaktivert rad. Skjul raden i stedet. */
    buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'onClick' | 'type' | 'disabled'>;
    /** Viser chevron. Utelat for å skjule navigasjonsikonet. */
    navigation?: 'internal';
    externalLabel?: never;
    href?: never;
    linkProps?: never;
    linkAs?: never;
    trailingControl?: never;
};

type RowPassiveProps = {
    /**
     * Én selvstendig kontroll til høyre, f.eks. `<Button>` eller `<LinkText>`.
     * Kan ikke kombineres med `href` eller `onClick`: raden skal ha ett interaktivt mål.
     */
    trailingControl?: ReactNode;
    href?: never;
    linkProps?: never;
    linkAs?: never;
    onClick?: never;
    buttonProps?: never;
    navigation?: never;
    externalLabel?: never;
};

export type RowProps = RowBaseProps & (RowLinkProps | RowButtonProps | RowPassiveProps);

type RowLinkAsLinkProps<As extends ElementType> = Omit<
    ComponentPropsWithoutRef<As>,
    'className' | 'children' | 'href' | 'target' | 'rel'
>;

// Påkrevd bare når lenken har påkrevde props, som `to` i React Router. Next sin Link klarer seg med `href`.
type RowLinkAsLinkPropsProp<As extends ElementType> =
    Partial<RowLinkAsLinkProps<As>> extends RowLinkAsLinkProps<As>
        ? { linkProps?: RowLinkAsLinkProps<As> }
        : { linkProps: RowLinkAsLinkProps<As> };

/** Row med router-lenke. `href` er valgfri, fordi f.eks. React Router bruker `to`. */
export type RowLinkAsProps<As extends ElementType> = RowBaseProps & {
    linkAs: As;
    href?: string;
    /** Viser chevron for intern navigasjon. Utelat for å skjule navigasjonsikonet. */
    navigation?: 'internal';
    externalLabel?: never;
    onClick?: never;
    buttonProps?: never;
    trailingControl?: never;
} & RowLinkAsLinkPropsProp<As> &
    (ComponentPropsWithoutRef<As> extends { href: unknown } ? { href: string } : unknown);

interface RowComponent {
    (props: RowProps & RefAttributes<HTMLDivElement>): ReturnType<FC>;
    <As extends ElementType>(props: RowLinkAsProps<As> & RefAttributes<HTMLDivElement>): ReturnType<FC>;
    displayName?: string;
    Leading: typeof RowLeading;
    TrailingLabel: typeof RowTrailingLabel;
}

/**
 * Row viser informasjon, navigasjon eller én handling i en liste. En
 * interaktiv rad er en `<div>` med én lenke eller knapp i tittelen; CSS
 * strekker klikkflaten over hele raden, så det finnes bare ett interaktivt mål.
 */
export const Row = forwardRef<HTMLDivElement, RowProps | RowLinkAsProps<ElementType>>(function Row(
    props,
    ref
): JSX.Element {
    const {
        title,
        titleAs: TitleTag = 'p',
        titleId,
        subtitle,
        description,
        leading,
        trailing,
        trailingControl,
        href,
        linkProps,
        linkAs,
        onClick,
        buttonProps,
        navigation,
        externalLabel,
        className,
        ...rest
    } = props;

    const external = navigation === 'external';
    const Link = (linkAs ?? 'a') as ElementType;

    let titleContent: ReactNode = title;
    if (href !== undefined || linkAs !== undefined) {
        titleContent = (
            <Link
                {...linkProps}
                className="ix-row__action"
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
            >
                {title}
                {external && (
                    <>
                        {' '}
                        <span className="ix-sr-only">{externalLabel}</span>
                    </>
                )}
            </Link>
        );
    } else if (onClick) {
        titleContent = (
            <button {...buttonProps} type="button" className="ix-row__action" onClick={onClick}>
                {title}
            </button>
        );
    }

    return (
        <div ref={ref} className={cn('ix-row', className)} {...rest}>
            {leading}
            <div className="ix-row__body">
                <div className="ix-row__content">
                    <TitleTag id={titleId} className="ix-row__title">
                        {titleContent}
                    </TitleTag>
                    {subtitle && <p className="ix-row__subtitle">{subtitle}</p>}
                    {description && <p className="ix-row__description">{description}</p>}
                </div>
                {trailing && <div className="ix-row__trailing">{trailing}</div>}
            </div>
            {trailingControl && <div className="ix-row__control">{trailingControl}</div>}
            {navigation && (
                <Icon
                    name={external ? 'open_in_new' : 'keyboard_arrow_right'}
                    className="ix-row__nav-icon"
                    aria-hidden
                />
            )}
        </div>
    );
}) as unknown as RowComponent;

Row.displayName = 'Row';
Row.Leading = RowLeading;
Row.TrailingLabel = RowTrailingLabel;
