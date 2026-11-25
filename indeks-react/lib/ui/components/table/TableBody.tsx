import { Children, type JSX, type ReactNode } from 'react';
import { useTableContext } from './TableContext';

export type TableBodyProps = {
    /** `Table.Row` per rad. */
    children?: ReactNode;
    /** Vises når det ikke er noen rader, vanligvis `<Table.Empty>`. */
    empty?: ReactNode;
};

/** Radområdet. Viser loading mens tabellen laster, og `empty` når det ikke er rader. */
export function TableBody({ children, empty }: TableBodyProps): JSX.Element {
    const { loading, loadingLabel } = useTableContext();
    const hasRows = Children.toArray(children).length > 0;

    return (
        <tbody>
            {loading ? (
                <tr className="ix-table__loading">
                    <td>
                        {/* Bare visuelt. Web componenten leser loading-label opp i én status. */}
                        <div className="ix-spinner" aria-hidden="true">
                            {loadingLabel}
                        </div>
                    </td>
                </tr>
            ) : hasRows ? (
                children
            ) : (
                empty
            )}
        </tbody>
    );
}

export type TableEmptyProps = {
    /** Hovedbudskapet, f.eks. «Ingen treff». */
    title: ReactNode;
    /** Hjelp til å komme videre, f.eks. «Prøv et annet søk eller endre filtrene.» */
    children?: ReactNode;
};

/** Rad for ingen treff. Spenner over alle kolonnene. */
export function TableEmpty({ title, children }: TableEmptyProps): JSX.Element {
    return (
        <tr className="ix-table__empty">
            <td>
                <p>{title}</p>
                {children != null && <p>{children}</p>}
            </td>
        </tr>
    );
}
