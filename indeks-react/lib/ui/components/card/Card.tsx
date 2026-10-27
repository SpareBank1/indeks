import { cn } from '../../../cn';
import { type AnchorHTMLAttributes, forwardRef, type HTMLAttributes, type JSX, type ReactNode } from 'react';
import { Icon } from '../../icons';

type CardTitleElement = 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';

interface CardBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
    /** Navigasjonsmål. Hele kortet blir klikkbart, men det finnes bare én lenke (tittelen). */
    href: string;
    /** Tittelen — er også lenketeksten, og dermed det skjermlesere leser som lenkenavn. */
    title: ReactNode;
    /** Overskriftsnivå for tittelen. Velg nivå som passer i dokumentstrukturen. @default "h3" */
    titleAs?: CardTitleElement;
    subtitle?: ReactNode;
    /** Ekstra attributter til `<a>`-elementet (f.eks. `onClick`, `data-*`). */
    linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'target' | 'rel'>;
}

interface CardInternalProps {
    /** Åpner lenken i ny fane og viser `open_in_new`-ikonet. */
    external?: false;
    externalLabel?: never;
}

interface CardExternalProps {
    external: true;
    /** Skjult tekst lagt til lenkenavnet, f.eks. "(åpnes i ny fane)". Må oversettes av konsumenten. */
    externalLabel: string;
}

type CardNavigationProps = CardInternalProps | CardExternalProps;

export type CardSmallProps = CardBaseProps &
    CardNavigationProps & {
        /** @default "small" */
        variant?: 'small';
        /** `dashed` gir en stiplet, gjennomsiktig flate i hvile. @default "default" */
        appearance?: 'default' | 'dashed';
        /** Ikon eller illustrasjon foran tittelen. Dekorativt — sett `aria-hidden` på innholdet. */
        leading?: ReactNode;
        /** @default "icon" */
        leadingType?: 'icon' | 'icon-background' | 'illustration';
        media?: never;
        mediaType?: never;
        description?: never;
        tag?: never;
    };

export type CardLargeProps = CardBaseProps &
    CardNavigationProps & {
        variant: 'large-vertical' | 'large-horizontal';
        appearance?: never;
        leading?: never;
        leadingType?: never;
        /** Bilde eller illustrasjon. Bilder trenger `alt` (tom `alt=""` hvis rent dekorativt). */
        media?: ReactNode;
        /** `image` fyller flaten (cover), `illustration` sentreres (contain). @default "image" */
        mediaType?: 'image' | 'illustration';
        description?: ReactNode;
        /** Én eller flere `<Tag>`. */
        tag?: ReactNode;
    };

export type CardProps = CardSmallProps | CardLargeProps;

/**
 * Card presenterer innhold og navigasjon i én klikkbar flate. Kortet er en
 * `<div>` med én ekte lenke i tittelen; CSS strekker lenkens klikkflate over
 * hele kortet (stretched link), så det finnes bare ett interaktivt mål.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(props, ref): JSX.Element {
    const {
        variant = 'small',
        appearance,
        href,
        title,
        titleAs: TitleTag = 'h3',
        subtitle,
        leading,
        leadingType = 'icon',
        media,
        mediaType = 'image',
        description,
        tag,
        external,
        externalLabel,
        linkProps,
        className,
        ...rest
    } = props;

    const isSmall = variant === 'small';

    return (
        <div
            ref={ref}
            className={cn('ix-card', className)}
            data-variant={variant}
            data-appearance={isSmall && appearance === 'dashed' ? 'dashed' : undefined}
            {...rest}
        >
            {isSmall && leading && (
                <span className="ix-card__leading" data-type={leadingType}>
                    {leading}
                </span>
            )}
            {!isSmall && media && (
                <div className="ix-card__media" data-type={mediaType}>
                    {media}
                </div>
            )}
            <div className="ix-card__content">
                <div className="ix-card__heading">
                    <TitleTag className="ix-card__title">
                        <a
                            {...linkProps}
                            className="ix-card__link"
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
                        </a>
                    </TitleTag>
                    <Icon
                        name={external ? 'open_in_new' : 'arrow_forward'}
                        className="ix-card__nav-icon"
                        aria-hidden
                    />
                </div>
                {subtitle && <p className="ix-card__subtitle">{subtitle}</p>}
                {!isSmall && description && <p className="ix-card__description">{description}</p>}
                {!isSmall && tag && <div className="ix-card__tags">{tag}</div>}
            </div>
        </div>
    );
});

Card.displayName = 'Card';
