import { useId, type JSX, type ReactNode, type ThHTMLAttributes } from 'react';
import { Icon } from '../../icons/Icon';
import { TABLE_SORT_ICONS, useTableContext } from './TableContext';

export type TableHeaderProps = {
    /** `Table.HeaderCell` per kolonne. Kontrollkolonnen for valg og ekspandering legges til av seg selv. */
    children: ReactNode;
};

/** Headerraden. Med valg eller ekspandering får den en kontrollkolonne først. */
export function TableHeader({ children }: TableHeaderProps): JSX.Element {
    const { variant, selectAllLabel } = useTableContext();
    const selectAllId = useId();

    return (
        <thead>
            <tr>
                {variant === 'multi-select' && (
                    <th scope="col" className="ix-table__control">
                        <div className="ix-checkbox">
                            {/* Web componenten eier checked og indeterminate. */}
                            <input type="checkbox" id={selectAllId} />
                            <label htmlFor={selectAllId}>
                                <span className="ix-sr-only">{selectAllLabel}</span>
                            </label>
                        </div>
                    </th>
                )}
                {(variant === 'single-select' || variant === 'expandable') && <td className="ix-table__control" />}
                {children}
            </tr>
        </thead>
    );
}

export type TableHeaderCellProps = {
    /** Gjør kolonnen sorterbar. Nøkkelen kommer tilbake i `onSortChange`. */
    sortKey?: string;
    /** Justering for hele kolonnen. Bruk `end` for tall som skal sammenlignes. @default "start" */
    align?: 'start' | 'end';
    children?: ReactNode;
} & Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align' | 'children'>;

/** Kolonneoverskrift. Med `sortKey` blir den en knapp som går gjennom sorteringen. */
export function TableHeaderCell({ sortKey, align, children, ...rest }: TableHeaderCellProps): JSX.Element {
    const { sort } = useTableContext();
    const ariaSort = sortKey && sort?.key === sortKey ? sort.direction : undefined;

    return (
        <th
            scope="col"
            data-align={align === 'end' ? 'end' : undefined}
            data-sort-key={sortKey}
            aria-sort={ariaSort}
            {...rest}
        >
            {sortKey ? (
                <button type="button" className="ix-table__sort">
                    {children}
                    {/* Alle tre er lastet, og CSS viser det som hører til aria-sort. */}
                    <span className="ix-table__sort-icon" aria-hidden="true">
                        {(Object.keys(TABLE_SORT_ICONS) as (keyof typeof TABLE_SORT_ICONS)[]).map((direction) => (
                            <Icon
                                key={direction}
                                name={TABLE_SORT_ICONS[direction]}
                                size="sm"
                                data-sort-icon={direction}
                            />
                        ))}
                    </span>
                </button>
            ) : (
                children
            )}
        </th>
    );
}
