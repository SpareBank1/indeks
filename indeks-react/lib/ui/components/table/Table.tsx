import {
    createContext,
    forwardRef,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
    type TdHTMLAttributes,
    type ThHTMLAttributes,
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';
import { cn } from '../../../cn';
import { type ComponentSize } from '../../../types/types';

export type SortDirection = 'ascending' | 'descending';

/** Komparatoren atferds-modulen skal bruke for kolonnen. */
export type SortType = 'text' | 'number' | 'date';

/** Detaljen fra `ix-sort`. Duplisert fra indeks-web — se sort-detail.sync.ts. */
export type IxSortDetail = {
    index: number;
    key: string | undefined;
    type: string;
    direction: SortDirection;
};

type TableContextValue = {
    captionId: string;
    registerCaption: (present: boolean) => void;
};

const TableContext = createContext<TableContextValue | undefined>(undefined);

export interface TableProps extends Omit<HTMLAttributes<HTMLTableElement>, 'onSelect'> {
    children?: ReactNode;
    className?: string;
    /** Radhøyde. `lg` gir mer luft uten å skalere teksten opp. @default "md" */
    density?: ComponentSize;
    /** Annenhver rad får bakgrunn. Kan ikke kombineres med uthevet kolonne. */
    zebra?: boolean;
    /** Hover-tint på rader i tbody. Kan ikke kombineres med uthevet kolonne. */
    hover?: boolean;
    /** Fester overskriftsraden ved vertikal scroll. Kan ikke kombineres med uthevet kolonne. */
    stickyHeader?: boolean;
    /** Fester første kolonne ved horisontal scroll — hovedgrepet for brede tabeller på mobil. */
    stickyColumn?: boolean;
    /**
     * Lar atferds-modulen sortere radene i DOM-en.
     *
     * Av som standard, og det er med hensikt: React eier `<tr>`-nodene sine, så en
     * modul som stokker om på dem gjør at React sitt virtuelle tre ikke matcher
     * lenger, og neste re-render kan gi feil rekkefølge. Skru den kun på for
     * tabeller med statiske rader. Er radene datadrevet, la den stå av og sorter
     * egne data på `onSort`.
     */
    clientSort?: boolean;
    /** Kalles når en kolonneoverskrift aktiveres. Sorter egne data her. */
    onSort?: (detail: IxSortDetail) => void;
    /** Mal for skjermleser-annonsering ved stigende sortering. `{column}` erstattes med kolonnenavnet. */
    sortAscendingText?: string;
    /** Mal for skjermleser-annonsering ved synkende sortering. `{column}` erstattes med kolonnenavnet. */
    sortDescendingText?: string;
    /**
     * Navn på scroll-området, for tastatur- og skjermleserbrukere som scroller
     * tabellen. Trengs kun når tabellen ikke har `<Table.Caption>` — da arves
     * navnet derfra.
     */
    scrollLabel?: string;
    /** Klasse på scroll-containeren utenfor `<table>`. */
    scrollClassName?: string;
    /**
     * Stil på scroll-containeren utenfor `<table>`.
     *
     * Trengs for `stickyHeader`: containeren har `overflow-x: auto`, og siden CSS gjør
     * den andre aksen til `auto` når én av dem ikke er `visible`, er den selv
     * scroll-containeren i begge retninger. En høydebegrensning lenger ut gir derfor
     * ingenting å scrolle her, og overskriftsraden får aldri festet seg. Sett
     * `scrollStyle={{ maxHeight: '20rem' }}` eller tilsvarende via `scrollClassName`.
     */
    scrollStyle?: CSSProperties;
}

/* Scroll-containeren er tabbbar fordi tastaturbrukere ellers ikke kan scrolle en
   bred tabell (WCAG 2.1.1). role="region" settes bare når vi har et navn å gi
   den — en navnløs region er verre enn ingen. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
    {
        children,
        className,
        density = 'md',
        zebra,
        hover,
        stickyHeader,
        stickyColumn,
        clientSort,
        onSort,
        sortAscendingText,
        sortDescendingText,
        scrollLabel,
        scrollClassName,
        scrollStyle,
        ...rest
    },
    forwardedRef,
) {
    const captionId = useId();
    const [hasCaption, setHasCaption] = useState(false);
    const tableRef = useRef<HTMLTableElement | null>(null);

    const registerCaption = useCallback((present: boolean) => {
        setHasCaption(present);
    }, []);

    const setRef = useCallback(
        (node: HTMLTableElement | null) => {
            tableRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
        },
        [forwardedRef],
    );

    // `ix-sort` er en CustomEvent fra atferds-modulen, så den har ingen React-prop.
    useEffect(() => {
        const element = tableRef.current;
        if (!element || !onSort) return;
        const listener = (event: Event) => onSort((event as CustomEvent<IxSortDetail>).detail);
        element.addEventListener('ix-sort', listener);
        return () => element.removeEventListener('ix-sort', listener);
    }, [onSort]);

    const accessibleName = hasCaption
        ? { 'aria-labelledby': captionId }
        : scrollLabel
          ? { 'aria-label': scrollLabel }
          : undefined;

    return (
        <div
            className={cn('ix-table-scroll', scrollClassName)}
            style={scrollStyle}
            tabIndex={0}
            {...(accessibleName ? { role: 'region', ...accessibleName } : {})}
        >
            <table
                ref={setRef}
                className={cn('ix-table', className)}
                data-density={density}
                data-zebra={zebra ? '' : undefined}
                data-hover={hover ? '' : undefined}
                data-sticky-header={stickyHeader ? '' : undefined}
                data-sticky-column={stickyColumn ? '' : undefined}
                data-ix-sort-client={clientSort ? '' : undefined}
                data-ix-sort-ascending-text={sortAscendingText}
                data-ix-sort-descending-text={sortDescendingText}
                {...rest}
            >
                <TableContext.Provider value={{ captionId, registerCaption }}>
                    {children}
                </TableContext.Provider>
            </table>
        </div>
    );
}) as React.ForwardRefExoticComponent<TableProps & React.RefAttributes<HTMLTableElement>> & {
    Caption: typeof TableCaption;
    ColumnGroup: typeof TableColumnGroup;
    Column: typeof TableColumn;
    Head: typeof TableHead;
    Body: typeof TableBody;
    Foot: typeof TableFoot;
    Row: typeof TableRow;
    ColumnHeader: typeof TableColumnHeader;
    RowHeader: typeof TableRowHeader;
    Cell: typeof TableCell;
};

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {
    children?: ReactNode;
}

/* Registrerer seg i konteksten slik at scroll-containeren kan peke aria-labelledby
   hit. Uten den koblingen ville regionen vært navnløs. */
const TableCaption = ({ children, className, ...rest }: TableCaptionProps) => {
    const context = useContext(TableContext);
    const register = context?.registerCaption;

    useEffect(() => {
        register?.(true);
        return () => register?.(false);
    }, [register]);

    return (
        <caption id={context?.captionId} className={className} {...rest}>
            {children}
        </caption>
    );
};

export interface TableColumnGroupProps extends HTMLAttributes<HTMLTableColElement> {
    children?: ReactNode;
}

const TableColumnGroup = ({ children, ...rest }: TableColumnGroupProps) => (
    <colgroup {...rest}>{children}</colgroup>
);

export interface TableColumnProps extends HTMLAttributes<HTMLTableColElement> {
    /**
     * Uthever kolonnen — brukes for «anbefalt»-kolonnen i sammenligningstabeller.
     * Kan ikke kombineres med `zebra`, `hover` eller `stickyHeader`: tabeller maler
     * celle- og radbakgrunn over kolonnebakgrunnen, så uthevingen ville blitt
     * usynlig.
     */
    highlighted?: boolean;
}

const TableColumn = ({ highlighted, ...rest }: TableColumnProps) => (
    <col data-highlighted={highlighted ? '' : undefined} {...rest} />
);

export interface TableSectionProps extends HTMLAttributes<HTMLTableSectionElement> {
    children?: ReactNode;
}

const TableHead = ({ children, ...rest }: TableSectionProps) => <thead {...rest}>{children}</thead>;
const TableBody = ({ children, ...rest }: TableSectionProps) => <tbody {...rest}>{children}</tbody>;
const TableFoot = ({ children, ...rest }: TableSectionProps) => <tfoot {...rest}>{children}</tfoot>;

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
    children?: ReactNode;
}

const TableRow = ({ children, ...rest }: TableRowProps) => <tr {...rest}>{children}</tr>;

export interface TableColumnHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
    children?: ReactNode;
    /** Gjør overskriften til en sorteringsknapp som atferds-modulen plukker opp. */
    sortable?: boolean;
    /** Komparator for kolonnen. @default "text" */
    sortType?: SortType;
    /** Identifiserer kolonnen i `ix-sort`-detaljen, slik at du ikke må stole på indeks. */
    sortKey?: string;
    /**
     * Gjeldende sorteringsretning. Send den inn når du eier sorteringstilstanden;
     * ellers setter atferds-modulen `aria-sort` selv.
     */
    sortDirection?: SortDirection;
}

/* Knappen ligger inne i <th>, ikke i stedet for den: <th> må beholde
   scope="col" og aria-sort for at tabellsemantikken skal være intakt. */
const TableColumnHeader = ({
    children,
    sortable,
    sortType = 'text',
    sortKey,
    sortDirection,
    ...rest
}: TableColumnHeaderProps) => (
    <th scope="col" aria-sort={sortDirection} {...rest}>
        {sortable ? (
            <button type="button" data-ix-sort={sortType} data-sort-key={sortKey}>
                {children}
            </button>
        ) : (
            children
        )}
    </th>
);

export interface TableRowHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
    children?: ReactNode;
    /** Verdi atferds-modulen skal sortere på, når den viste teksten er formatert. */
    sortValue?: string | number;
}

const TableRowHeader = ({ children, sortValue, ...rest }: TableRowHeaderProps) => (
    <th scope="row" data-sort-value={sortValue} {...rest}>
        {children}
    </th>
);

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
    children?: ReactNode;
    /**
     * Verdi atferds-modulen skal sortere på i stedet for celleteksten. Påkrevd for
     * formaterte tall og datoer — «1 250,50 kr» sorterer ikke som tekst.
     */
    sortValue?: string | number;
}

const TableCell = ({ children, sortValue, ...rest }: TableCellProps) => (
    <td data-sort-value={sortValue} {...rest}>
        {children}
    </td>
);

Table.displayName = 'Table';
TableCaption.displayName = 'Table.Caption';
TableColumnGroup.displayName = 'Table.ColumnGroup';
TableColumn.displayName = 'Table.Column';
TableHead.displayName = 'Table.Head';
TableBody.displayName = 'Table.Body';
TableFoot.displayName = 'Table.Foot';
TableRow.displayName = 'Table.Row';
TableColumnHeader.displayName = 'Table.ColumnHeader';
TableRowHeader.displayName = 'Table.RowHeader';
TableCell.displayName = 'Table.Cell';

Table.Caption = TableCaption;
Table.ColumnGroup = TableColumnGroup;
Table.Column = TableColumn;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Foot = TableFoot;
Table.Row = TableRow;
Table.ColumnHeader = TableColumnHeader;
Table.RowHeader = TableRowHeader;
Table.Cell = TableCell;
