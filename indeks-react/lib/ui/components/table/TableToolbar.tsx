import { cn } from '../../../cn';
import { type JSX, type ReactNode } from 'react';
import { useTableContext } from './TableContext';

export type TableToolbarProps = {
    /** Søkefelt og filtre. Står igjen også når rader er valgt. */
    filters?: ReactNode;
    /** Handlinger for hele tabellen. Samle mindre brukte under en meny for flere handlinger. */
    actions?: ReactNode;
    /** Handlinger for de valgte radene. Vises bare når noen av radene som vises, er valgt. */
    selectionActions?: ReactNode;
    /**
     * Teksten om utvalget, f.eks. `(n) => n + ' valgt'`. Vises og leses opp når noe er
     * valgt, også uten `selectionActions`.
     */
    selectedLabel?: (count: number) => ReactNode;
    className?: string;
};

/** Søk, filtre og handlinger over tabellen. Bryter til flere rader når det blir trangt. */
export function TableToolbar({
    filters,
    actions,
    selectionActions,
    selectedLabel,
    className,
}: TableToolbarProps): JSX.Element {
    const { selectedKeys } = useTableContext();
    const count = selectedKeys.size;
    const hasSelection = selectionActions != null || selectedLabel != null;

    return (
        <div className={cn('ix-table__toolbar', className)}>
            {filters != null && <div className="ix-table__filters">{filters}</div>}
            {(actions != null || hasSelection) && (
                <div className="ix-table__actions">
                    {hasSelection && (
                        // Web componenten viser og skjuler utvalget ut fra radene som er valgt.
                        <div className="ix-table__selection">
                            {selectedLabel && (
                                // Web componenten leser teksten opp etter hvert valg (WCAG 4.1.3).
                                <span data-field="selected-label">{selectedLabel(count)}</span>
                            )}
                            {selectionActions}
                        </div>
                    )}
                    {actions}
                </div>
            )}
        </div>
    );
}
