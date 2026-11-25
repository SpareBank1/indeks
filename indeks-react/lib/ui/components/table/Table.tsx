import { cn } from '../../../cn';
import {
    forwardRef,
    useId,
    useLayoutEffect,
    useMemo,
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
    type TableSortLabels,
    type TableVariant,
} from './TableContext';
import { TableBody, TableEmpty } from './TableBody';
import { TableHeader, TableHeaderCell } from './TableHeader';
import { TableCell, TableRow } from './TableRow';
import { TableSkeleton } from './TableSkeleton';
import { TableToolbar } from './TableToolbar';

type TableTitleElement = 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

/**
 * Teksten for «velg alle» hører til multi-select. Typen gjør den påkrevd der og
 * ugyldig ellers, så den ikke glemmes og ikke står igjen etter et variantbytte.
 */
type TableVariantProps =
    | {
          /** Valg eller ekspandering av rader. Utelatt gir en vanlig tabell. Sortering er uavhengig av variant. */
          variant?: Exclude<TableVariant, 'multi-select'>;
          selectAllLabel?: never;
      }
    | {
          variant: 'multi-select';
          /** Tilgjengelig navn på checkboxen som velger alle, f.eks. «Velg alle regninger». */
          selectAllLabel: string;
      };

type TableBaseProps = {
    /** Overskrift over tabellen. Gir også tabellen navn. */
    title?: ReactNode;
    /** Elementet tittelen rendres som. Velg nivå etter overskriften over tabellen. @default "h3" */
    titleAs?: TableTitleElement;
    /** Navn på tabellen når den ikke har `title`. */
    ariaLabel?: string;
    /** Fest første kolonne eller handlingskolonnen ved vannrett rulling. */
    sticky?: 'first' | 'last';
    density?: 'compact' | 'comfortable';
    /** `name` på checkboxene eller radioene, så valget sendes med et vanlig skjema. */
    name?: string;
    /**
     * Utvalget, `value` på de valgte radene. Når verdien endres, settes den inn i
     * tabellen, for eksempel for å tømme utvalget etter en handling. Brukerens
     * egne valg meldes med `onSelectionChange` og kan ikke avvises.
     */
    selectedKeys?: string[];
    /** Utvalget ved start. Nøkler til rader som ikke vises ennå, telles med. */
    defaultSelectedKeys?: string[];
    /** Hele utvalget etter at brukeren har endret det, også rader som ikke vises. */
    onSelectionChange?: (keys: string[]) => void;
    /** Kontrollert sortering. `null` er ingen sortering. Tabellen sorterer ikke radene selv. */
    sort?: TableSort;
    defaultSort?: TableSort;
    /** Kalles med neste sortering i syklusen ingen → stigende → synkende → ingen. */
    onSortChange?: (sort: TableSort) => void;
    /**
     * Det som leses opp når sorteringen endres. `{column}` byttes ut med kolonnens
     * navn, f.eks. `{ ascending: 'Sortert etter {column}, stigende', descending:
     * 'Sortert etter {column}, synkende', none: 'Sortering fjernet' }`.
     */
    sortLabels?: TableSortLabels;
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

export type TableProps = TableBaseProps & TableVariantProps;

type IxTableElement = HTMLElement & { setSelection?: (keys: string[]) => void };

/**
 * Tabell for strukturerte data i rader og kolonner.
 *
 * Tynn wrapper over `<ix-table>`. Hver tilstand har én skriver:
 * - Web componenten eier utvalg og ekspandering. React rendrer startverdiene,
 *   setter `selectedKeys` inn med `setSelection()` og leser `selection-change`.
 * - React eier sorteringen (`data-sort-controlled`): den rendrer `aria-sort`, og
 *   konsumenten sorterer dataene. Web componenten sender bare `sort-request`.
 * - React rendrer sorteringsikonene og statuselementet selv, så web componenten
 *   ikke setter inn noder i elementer React eier.
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
        sortLabels,
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

    // Utvalget slik web componenten sist meldte det. Brukes bare til å rendre
    // antallet og startverdier for rader som rendres senere, aldri til å skrive
    // checked. Det gjør web componenten.
    const [selection, setSelectionState] = useState<string[]>(selectedKeys ?? defaultSelectedKeys ?? []);
    const selectedSet = useMemo(() => new Set(selection), [selection]);

    // Siste callbacks i ref, så lytterne under ikke må festes på nytt ved hver render.
    const callbacks = useRef({ onSortChange, onSelectionChange });
    callbacks.current = { onSortChange, onSelectionChange };

    useLayoutEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        const handleSort = (e: Event): void => {
            const { key, direction } = (e as CustomEvent<TableSortChangeDetail>).detail;
            const next: TableSort = key && direction !== 'none' ? { key, direction } : null;
            if (!sortControlled) setInternalSort(next);
            callbacks.current.onSortChange?.(next);
        };
        const handleSelection = (e: Event): void => {
            const { selected } = (e as CustomEvent<TableSelectionChangeDetail>).detail;
            setSelectionState(selected);
            callbacks.current.onSelectionChange?.(selected);
        };
        host.addEventListener('sort-request', handleSort);
        host.addEventListener('selection-change', handleSelection);
        return () => {
            host.removeEventListener('sort-request', handleSort);
            host.removeEventListener('selection-change', handleSelection);
        };
    }, [sortControlled]);

    // Utvalget ved start og hver gang selectedKeys får nye verdier, settes inn i
    // web componenten. Den eier checked, også for rader som ikke er rendret ennå.
    const keysSignature = JSON.stringify(selectedKeys ?? null);
    const startKeys = useRef(defaultSelectedKeys);
    useLayoutEffect(() => {
        const keys = selectedKeys ?? startKeys.current;
        if (!keys) return;
        hostRef.current?.setSelection?.(keys);
        setSelectionState(keys);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- selectedKeys sammenlignes på verdi, ikke identitet.
    }, [keysSignature]);

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
                // React sorterer dataene. Web componenten ser bare om attributtet finnes.
                data-sort-controlled="true"
                sort-ascending-label={sortLabels?.ascending}
                sort-descending-label={sortLabels?.descending}
                sort-none-label={sortLabels?.none}
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
                {/* Web componenten skriver loading og utvalget hit. Det må finnes før teksten settes. */}
                <span className="ix-sr-only" role="status" data-field="status" />
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
