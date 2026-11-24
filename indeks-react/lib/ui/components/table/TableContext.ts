import { createContext, useContext } from 'react';

export type TableVariant = 'single-select' | 'multi-select' | 'expandable';

/** Aktiv sortering. `null` betyr ingen sortering. */
export type TableSort = { key: string; direction: 'ascending' | 'descending' } | null;

/** Speiler `IxTableSortChangeDetail` i @sb1/indeks-web (se table-events.sync.test.ts). */
export type TableSortChangeDetail = {
    column: number;
    key: string | null;
    direction: 'ascending' | 'descending' | 'none';
};

/** Speiler `IxTableSelectionChangeDetail` i @sb1/indeks-web. */
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
