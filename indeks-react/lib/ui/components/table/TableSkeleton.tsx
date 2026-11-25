import { type JSX } from 'react';

export type TableSkeletonProps = {
    /** Antall kolonner. Gjenspeil omtrent tabellen som kommer. */
    columns: number;
    /** Antall rader. @default 3 */
    rows?: number;
    /** Ta med headerraden når kolonnene heller ikke er kjent ennå. @default false */
    header?: boolean;
};

/**
 * Plassholder mens hele tabellen lastes og strukturen ikke er kjent. Brukes i
 * stedet for `Table.Header` og `Table.Body`, sammen med `loading` og
 * `loadingLabel` på `Table`, så innlastingen leses opp.
 */
export function TableSkeleton({ columns, rows = 3, header = false }: TableSkeletonProps): JSX.Element {
    const cells = Array.from({ length: columns }, (_, i) => i);

    return (
        <>
            {header && (
                <thead>
                    <tr className="ix-table__skeleton" aria-hidden="true">
                        {cells.map((i) => (
                            <th key={i} />
                        ))}
                    </tr>
                </thead>
            )}
            <tbody>
                {Array.from({ length: rows }, (_, r) => (
                    <tr key={r} className="ix-table__skeleton" aria-hidden="true">
                        {cells.map((i) => (
                            <td key={i} />
                        ))}
                    </tr>
                ))}
            </tbody>
        </>
    );
}
