import { cn } from '../../../cn';
import {
    forwardRef,
    useId,
    useLayoutEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
    type ForwardRefExoticComponent,
    type HTMLAttributes,
    type ReactNode,
    type RefAttributes,
} from 'react';
import {
    TableContext,
    type TableSelectionChangeDetail,
    type TableSort,
    type TableSortChangeDetail,
    type TableVariant,
} from './TableContext';
import { TableBody, TableEmpty } from './TableBody';
import { TableHeader, TableHeaderCell } from './TableHeader';
import { TableCell, TableRow } from './TableRow';
import { TableSkeleton } from './TableSkeleton';
import { TableToolbar } from './TableToolbar';

type TableTitleElement = 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export type TableProps = {
    /** Overskrift over tabellen. Gir også tabellen navn. */
    title?: ReactNode;
    /** Elementet tittelen rendres som. Velg nivå etter overskriften over tabellen. @default "h3" */
    titleAs?: TableTitleElement;
    /** Navn på tabellen når den ikke har `title`. */
    ariaLabel?: string;
    /** Valg eller ekspandering av rader. Utelatt gir en vanlig tabell. Sortering er uavhengig av variant. */
    variant?: TableVariant;
    /** Fest første kolonne eller handlingskolonnen ved vannrett rulling. */
    sticky?: 'first' | 'last';
    density?: 'compact' | 'comfortable';
    /** Tilgjengelig navn på checkboxen som velger alle. Påkrevd med `variant="multi-select"`. */
    selectAllLabel?: string;
    /** `name` på checkboxene eller radioene, så valget sendes med et vanlig skjema. */
    name?: string;
    /** Kontrollert utvalg: `value` på de valgte radene. */
    selectedKeys?: string[];
    /** Ukontrollert utvalg ved start. */
    defaultSelectedKeys?: string[];
    onSelectionChange?: (keys: string[]) => void;
    /** Kontrollert sortering. `null` er ingen sortering. Tabellen sorterer ikke radene selv. */
    sort?: TableSort;
    defaultSort?: TableSort;
    /** Kalles med neste sortering i syklusen ingen → stigende → synkende → ingen. */
    onSortChange?: (sort: TableSort) => void;
    /** Viser loading i radområdet og beholder overskrifter, toolbar, footer og paginering. */
    loading?: boolean;
    /** Teksten som vises og leses opp mens tabellen laster, f.eks. «Laster». */
    loadingLabel?: string;
    /** Vanligvis `<Table.Toolbar>`. */
    toolbar?: ReactNode;
    /** Innhold i footeren, f.eks. en sum til venstre og høyre. */
    footer?: ReactNode;
    /** Vanligvis `<Pagination>`. */
    pagination?: ReactNode;
    /** `Table.Header` og `Table.Body`, eller `Table.Skeleton`. */
    children?: ReactNode;
    className?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'title' | 'children' | 'className'>;

type IxTableElement = HTMLElement & { refresh?: () => void };

/**
 * Tabell for strukturerte data i rader og kolonner.
 *
 * Tynn wrapper over `<ix-table>`. Web componenten eier atferden (sorteringsikon,
 * velg alle, telling, radklikk, ekspandering, justering og rulling). React eier
 * props-API-et, tilstanden for sortering og valg, og leser endringer fra
 * `sort-change` og `selection-change`. Radene sorteres og filtreres av konsumenten.
 */
export const Table = forwardRef<HTMLElement, TableProps>(function Table(
    {
        title,
        titleAs: TitleTag = 'h3',
        ariaLabel,
        variant,
        sticky,
        density,
        selectAllLabel,
        name,
        selectedKeys,
        defaultSelectedKeys,
        onSelectionChange,
        sort: sortProp,
        defaultSort = null,
        onSortChange,
        loading = false,
        loadingLabel,
        toolbar,
        footer,
        pagination,
        children,
        className,
        ...rest
    },
    ref
) {
    const hostRef = useRef<IxTableElement | null>(null);
    const titleId = useId();
    // Radioene må dele name for å være én gruppe. Web componenten gir dem et navn
    // hvis det mangler, men React 19 fjerner attributter React ikke selv har satt
    // ved neste render. Derfor setter React navnet. Bare for radio: en checkbox
    // med name sendes med i et skjema, og det skal konsumenten bestemme.
    const generatedName = useId();
    const groupName = name ?? (variant === 'single-select' ? generatedName : undefined);

    const [internalSort, setInternalSort] = useState<TableSort>(defaultSort);
    const sortControlled = sortProp !== undefined;
    const sort = sortControlled ? sortProp : internalSort;

    const [internalKeys, setInternalKeys] = useState<string[]>(defaultSelectedKeys ?? []);
    const selectionControlled = selectedKeys !== undefined;
    const keys = selectionControlled ? selectedKeys : internalKeys;
    const selectedSet = useMemo(() => new Set(keys), [keys]);
    // Kontrollert: en ny render speiler selectedKeys inn igjen, også når
    // konsumenten avviser endringen og ikke oppdaterer staten.
    const [, rerender] = useReducer((n: number) => n + 1, 0);

    // Siste callbacks i ref, så lytterne under ikke må festes på nytt ved hver render.
    const callbacks = useRef({ onSortChange, onSelectionChange });
    callbacks.current = { onSortChange, onSelectionChange };

    // Layout-effekt, og før speilingen under: web componenten kan sende
    // selection-change allerede i første refresh().
    useLayoutEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        // React eier rekkefølgen på radene, så web componenten skal verken sette
        // aria-sort eller flytte rader. Vi rapporterer bare neste sortering.
        const handleSort = (e: Event): void => {
            e.preventDefault();
            const { key, direction } = (e as CustomEvent<TableSortChangeDetail>).detail;
            const next: TableSort = key && direction !== 'none' ? { key, direction } : null;
            if (!sortControlled) setInternalSort(next);
            callbacks.current.onSortChange?.(next);
        };
        const handleSelection = (e: Event): void => {
            const { selected } = (e as CustomEvent<TableSelectionChangeDetail>).detail;
            if (selectionControlled) rerender();
            else setInternalKeys(selected);
            callbacks.current.onSelectionChange?.(selected);
        };
        host.addEventListener('sort-change', handleSort);
        host.addEventListener('selection-change', handleSelection);
        return () => {
            host.removeEventListener('sort-change', handleSort);
            host.removeEventListener('selection-change', handleSelection);
        };
    }, [sortControlled, selectionControlled]);

    // Kontrollene er ukontrollerte i React, så web componenten kan endre dem (velg
    // alle). Utvalget speiles inn etter hver render, og web componenten synker
    // radtilstand, telling og indeterminate fra det.
    //
    // Utvalget gjelder bare radene som vises. En nøkkel uten rad (filtrert bort,
    // en annen side) fjernes og meldes med onSelectionChange. Ikke mens tabellen
    // laster, så et forhåndsvalg overlever innlastingen. Rader som skjules med
    // hidden, tar web componenten seg av.
    //
    // Effekten må kjøre ved hver render, så web componenten synker det React
    // nettopp har skrevet (radtilstand, telling, ikoner i nye overskrifter).
    const reportedStale = useRef<string | null>(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- må kjøre ved hver render (se over). reportedStale melder samme utvalg bare én gang, så setState gir ingen løkke.
    useLayoutEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        const inputs = host.querySelectorAll<HTMLInputElement>('tbody .ix-table__control input');
        const present = new Set<string>();
        inputs.forEach((input) => {
            // Uten value hører kontrollen ikke til noen nøkkel. Web componenten advarer.
            if (!input.hasAttribute('value')) return;
            present.add(input.value);
            const checked = selectedSet.has(input.value);
            if (input.checked !== checked) input.checked = checked;
        });
        host.refresh?.();

        const stale = loading ? [] : keys.filter((key) => !present.has(key));
        const signature = stale.length ? JSON.stringify(keys) : null;
        if (signature && signature !== reportedStale.current) {
            const next = keys.filter((key) => present.has(key));
            if (!selectionControlled) setInternalKeys(next);
            callbacks.current.onSelectionChange?.(next);
        }
        reportedStale.current = signature;
    });

    const context = useMemo(
        () => ({ variant, sort, selectedKeys: selectedSet, selectAllLabel, name: groupName, loading, loadingLabel }),
        [variant, sort, selectedSet, selectAllLabel, groupName, loading, loadingLabel]
    );

    return (
        <TableContext.Provider value={context}>
            <ix-table
                ref={(node: HTMLElement | null) => {
                    hostRef.current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) ref.current = node;
                }}
                class={cn('ix-table', className)}
                data-sticky={sticky}
                data-density={density}
                loading-label={loadingLabel}
                {...rest}
            >
                {title != null && (
                    <TitleTag id={titleId} className="ix-table__heading">
                        {title}
                    </TitleTag>
                )}
                <div className="ix-table__frame">
                    {toolbar}
                    <div className="ix-table__scroll">
                        <table
                            aria-labelledby={title != null ? titleId : undefined}
                            aria-label={title == null ? ariaLabel : undefined}
                            aria-busy={loading || undefined}
                        >
                            {children}
                        </table>
                    </div>
                    {footer != null && <div className="ix-table__footer">{footer}</div>}
                    {pagination != null && <div className="ix-table__pagination">{pagination}</div>}
                </div>
            </ix-table>
        </TableContext.Provider>
    );
}) as ForwardRefExoticComponent<TableProps & RefAttributes<HTMLElement>> & {
    Header: typeof TableHeader;
    HeaderCell: typeof TableHeaderCell;
    Body: typeof TableBody;
    Row: typeof TableRow;
    Cell: typeof TableCell;
    Empty: typeof TableEmpty;
    Skeleton: typeof TableSkeleton;
    Toolbar: typeof TableToolbar;
};

Table.displayName = 'Table';
Table.Header = TableHeader;
Table.HeaderCell = TableHeaderCell;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.Empty = TableEmpty;
Table.Skeleton = TableSkeleton;
Table.Toolbar = TableToolbar;
