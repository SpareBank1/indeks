import { createContext, useContext } from 'react';

export type TableVariant = 'single-select' | 'multi-select' | 'expandable';

/** Det som leses opp når sorteringen endres. `{column}` er kolonnens navn. */
export type TableSortLabels = { ascending: string; descending: string; none: string };

/** Aktiv sortering. `null` betyr ingen sortering. */
export type TableSort = { key: string; direction: 'ascending' | 'descending' } | null;

/**
 * Ikonet for hver sorteringsretning. Speiler `IX_TABLE_SORT_ICONS` i @sb1/indeks-web
 * (se table-icons.sync.test.ts). React rendrer ikonene selv, så web componenten
 * ikke setter inn noder i overskrifter React eier.
 */
export const TABLE_SORT_ICONS = {
    none: 'swap_vert',
    ascending: 'arrow_upward',
    descending: 'arrow_downward',
} as const;

/** Detaljene i `sort-request`. Speiler `IxTableSortChangeDetail` i @sb1/indeks-web (se table-events.sync.test.ts). */
export type TableSortChangeDetail = {
    column: number;
    key: string | null;
    direction: 'ascending' | 'descending' | 'none';
};

/** Hele utvalget, også rader som ikke vises. Speiler `IxTableSelectionChangeDetail` i @sb1/indeks-web. */
export type TableSelectionChangeDetail = {
    selected: string[];
};

export type TableContextValue = {
    variant?: TableVariant;
    sort: TableSort;
    selectedKeys: ReadonlySet<string>;
    selectAllLabel?: string;
    name?: string;
    loading: boolean;
    loadingLabel?: string;
};

export const TableContext = createContext<TableContextValue>({
    sort: null,
    selectedKeys: new Set(),
    loading: false,
});

export function useTableContext(): TableContextValue {
    return useContext(TableContext);
}
