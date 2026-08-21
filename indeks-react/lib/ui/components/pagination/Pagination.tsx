import { forwardRef, type JSX } from 'react';
import { cn } from '../../../cn';
import { Icon } from '../../icons/Icon';

export type PaginationProps = {
    /** Nåværende side (1-indeksert). */
    page: number;
    /** Totalt antall sider. */
    count: number;
    /** Callback når bruker bytter side. */
    onPageChange?: (page: number) => void;
    /** Antall synlige sider rundt aktiv side. @default 1 */
    siblingCount?: number;
    /** Antall synlige sider i start og slutt. @default 1 */
    boundaryCount?: number;
    /** Vis tekst på forrige/neste-knapper. @default false */
    prevNextTexts?: boolean;
    /** Tilgjengelig navn på forrige-knapp. */
    previousLabel: string;
    /** Tilgjengelig navn på neste-knapp. */
    nextLabel: string;
    /** Tilgjengelig navn på nav-elementet. */
    ariaLabel: string;
    /** Funksjon som genererer tilgjengelig navn for sidetall. */
    pageLabel: (page: number) => string;
    /** CSS-klasse på rot-elementet. */
    className?: string;
};

type Step = number | 'ellipsis-start' | 'ellipsis-end';

function getSteps({
    page,
    count,
    boundaryCount = 1,
    siblingCount = 1,
}: Pick<PaginationProps, 'page' | 'count' | 'boundaryCount' | 'siblingCount'>): Step[] {
    const range = (start: number, end: number) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i);

    if (count <= (boundaryCount + siblingCount) * 2 + 3) {
        return range(1, count);
    }

    const startPages = range(1, boundaryCount);
    const endPages = range(count - boundaryCount + 1, count);

    const siblingsStart = Math.max(
        Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
        boundaryCount + 2,
    );
    const siblingsEnd = siblingsStart + siblingCount * 2;

    const result: Step[] = [...startPages];

    if (siblingsStart - (startPages[startPages.length - 1] ?? 0) === 2) {
        result.push(siblingsStart - 1);
    } else {
        result.push('ellipsis-start');
    }

    result.push(...range(siblingsStart, siblingsEnd));

    if ((endPages[0] ?? count + 1) - siblingsEnd === 2) {
        result.push(siblingsEnd + 1);
    } else {
        result.push('ellipsis-end');
    }

    result.push(...endPages);

    return result;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
    {
        page,
        count,
        onPageChange,
        siblingCount = 1,
        boundaryCount = 1,
        prevNextTexts = false,
        previousLabel,
        nextLabel,
        ariaLabel,
        pageLabel,
        className,
    },
    ref,
): JSX.Element | null {
    if (count <= 1) {
        return null;
    }

    const steps = getSteps({ page, count, siblingCount, boundaryCount });
    const isFirstPage = page === 1;
    const isLastPage = page === count;

    return (
        <nav ref={ref} className={cn('ix-pagination', className)} aria-label={ariaLabel}>
            <ul className="ix-pagination__list">
                <li>
                    <button
                        type="button"
                        className="ix-pagination__button"
                        data-type="prev"
                        data-show-text={prevNextTexts || undefined}
                        disabled={isFirstPage}
                        aria-label={prevNextTexts ? undefined : previousLabel}
                        onClick={() => onPageChange?.(page - 1)}
                    >
                        <Icon name="chevron_left" aria-hidden="true" />
                        {prevNextTexts && previousLabel}
                    </button>
                </li>
                {steps.map((step) =>
                    typeof step === 'string' ? (
                        <li key={step}>
                            <span className="ix-pagination__ellipsis" aria-hidden="true">
                                <Icon name="more_horiz" />
                            </span>
                        </li>
                    ) : (
                        <li key={step}>
                            <button
                                type="button"
                                className="ix-pagination__button"
                                aria-current={page === step ? 'page' : undefined}
                                aria-label={pageLabel(step)}
                                onClick={() => onPageChange?.(step)}
                            >
                                {step}
                            </button>
                        </li>
                    ),
                )}
                <li>
                    <button
                        type="button"
                        className="ix-pagination__button"
                        data-type="next"
                        data-show-text={prevNextTexts || undefined}
                        disabled={isLastPage}
                        aria-label={prevNextTexts ? undefined : nextLabel}
                        onClick={() => onPageChange?.(page + 1)}
                    >
                        {prevNextTexts && nextLabel}
                        <Icon name="chevron_right" aria-hidden="true" />
                    </button>
                </li>
            </ul>
        </nav>
    );
});
