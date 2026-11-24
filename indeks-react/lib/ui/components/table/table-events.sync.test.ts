import { describe, expect, it } from 'vitest';
import type { IxTableSelectionChangeDetail, IxTableSortChangeDetail } from '@sb1/indeks-web';
import type { TableSelectionChangeDetail, TableSortChangeDetail } from './TableContext';

// Hendelsestypene fra <ix-table> dupliseres i React (React skal ikke importere
// web-modulen i library-kode). Testen typesjekker ikke hvis de glir fra hverandre.
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export type _SortDetail = Expect<Equal<TableSortChangeDetail, IxTableSortChangeDetail>>;
export type _SelectionDetail = Expect<Equal<TableSelectionChangeDetail, IxTableSelectionChangeDetail>>;

describe('Table-hendelser sync', () => {
    it('hendelsestypene i indeks-react og indeks-web er like (sjekkes av tsc)', () => {
        expect(true).toBe(true);
    });
});
