import { cn } from '../../../cn';
import { Children, forwardRef, isValidElement, type HTMLAttributes, type JSX, type ReactNode, useId } from 'react';
import { hasContent } from '../../has-content';

type ListCardTitleElement = 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export interface ListCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Tittel i headeren. Gir også lista navn. */
    title?: ReactNode;
    /** Elementet tittelen rendres som. Velg nivå etter overskriften over kortet. @default "h3" */
    titleAs?: ListCardTitleElement;
    /** Tekst til høyre i headeren, f.eks. en sum. */
    trailing?: ReactNode;
    /** Én `<Row>` per rad. Hvert barn legges i sin egen `<li>`. */
    children?: ReactNode;
}

/** Grupperer relaterte rader i et kort med valgfri header. */
export const ListCard = forwardRef<HTMLDivElement, ListCardProps>(function ListCard(
    { title, titleAs: TitleTag = 'h3', trailing, children, className, ...rest },
    ref
): JSX.Element {
    const titleId = useId();
    const hasTitle = hasContent(title);

    return (
        <div ref={ref} className={cn('ix-list-card', className)} {...rest}>
            {(hasTitle || hasContent(trailing)) && (
                <div className="ix-list-card__header">
                    {hasTitle && (
                        <TitleTag id={titleId} className="ix-list-card__title">
                            {title}
                        </TitleTag>
                    )}
                    {hasContent(trailing) && <span className="ix-list-card__trailing">{trailing}</span>}
                </div>
            )}
            {/* VoiceOver i Safari fjerner liste-semantikken når list-style er none, med mindre rollen står eksplisitt. */}
            <ul role="list" aria-labelledby={hasTitle ? titleId : undefined}>
                {Children.toArray(children).map((child, index) => (
                    <li key={isValidElement(child) ? (child.key ?? index) : index}>{child}</li>
                ))}
            </ul>
        </div>
    );
});

ListCard.displayName = 'ListCard';
