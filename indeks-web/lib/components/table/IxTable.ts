/**
 * IxTable — ARIA-lim rundt en native <table> i light DOM. Forfatteren skriver
 * vanlig tabellmarkup med checkbox, radio, sorterings- og ekspanderingsknapper;
 * <ix-table> kobler dem sammen og holder tilstanden i attributter CSS leser.
 *
 * - Sortering: `.ix-table__sort` i en `th` går ingen → stigende → synkende →
 *   ingen. Som standard setter komponenten `aria-sort`, sorterer radene og
 *   sender `sort-change`. Med `data-sort-controlled` sender den bare
 *   `sort-request`, og den som eier radene setter `aria-sort` og rekkefølgen.
 *   Når `aria-sort` har endret seg etter et klikk, leses `sort-ascending-label`,
 *   `sort-descending-label` eller `sort-none-label` opp, med `{column}` byttet
 *   ut med kolonnens navn.
 * - Valg: komponenten eier utvalget, en mengde av `value` på radkontrollene.
 *   Utvalget gjelder også rader som er skjult eller ikke finnes i DOM-en (en
 *   annen side). Checkbox i headeren velger radene som vises og blir
 *   indeterminate. Antallet, alle valgte, skrives i `[data-selected-count]`, og
 *   `.ix-table__selection` vises når noe er valgt. Etter et valg leses teksten i
 *   `[data-field="selected-label"]` opp, f.eks. «3 valgt». Sender
 *   `selection-change` når brukeren endrer valget. Endres det fra koden, med
 *   `setSelection()` eller `clearSelection()`, sendes ingen hendelse.
 * - Ekspandering: `.ix-table__expand` veksler `aria-expanded` og `hidden` på
 *   raden den styrer. Sender `expand-change`.
 * - Klikk på en rad med kontroll aktiverer kontrollen, med mindre klikket kom
 *   fra noe interaktivt i raden.
 * - Rulling: `data-overflow-start`/`-end` på `.ix-table__scroll`, og området
 *   blir fokuserbart bare når det faktisk ruller.
 * - Loading: mens tabellen har `aria-busy="true"`, står `loading-label` i et
 *   skjult `role="status"`-element. Elementet finnes hele tiden, så teksten
 *   annonseres én gang per innlasting.
 *
 * Hver tilstand har én skriver. Komponenten eier utvalg og ekspandering, og
 * React rendrer bare startverdiene. Med `data-sort-controlled` eier den som
 * rendrer radene sorteringen. Justering arves som `data-column-align`, så
 * cellens egen `data-align` aldri overskrives.
 *
 * @example
 * <ix-table class="ix-table">
 *   <h2 class="ix-table__heading" id="t">Regninger</h2>
 *   <div class="ix-table__frame">
 *     <div class="ix-table__scroll">
 *       <table aria-labelledby="t">…</table>
 *     </div>
 *   </div>
 * </ix-table>
 */

export type IxTableSortDirection = 'ascending' | 'descending' | 'none';

/** Detaljene i både `sort-request` og `sort-change`. */
export type IxTableSortChangeDetail = {
    /** Kolonnens indeks i headerraden. */
    column: number;
    /** `data-sort-key` på kolonnens `th`, eller `null`. */
    key: string | null;
    direction: IxTableSortDirection;
};

export type IxTableSelectionChangeDetail = {
    /** Hele utvalget, også rader som ikke vises, i den rekkefølgen de ble valgt. */
    selected: string[];
};

export type IxTableExpandChangeDetail = {
    row: HTMLTableRowElement;
    expanded: boolean;
};

let tableCounter = 0;
let expandedCounter = 0;

const NEXT_SORT: Record<IxTableSortDirection, IxTableSortDirection> = {
    none: 'ascending',
    ascending: 'descending',
    descending: 'none',
};

/** Ikonet for hver retning. React rendrer de samme (se table-icons.sync.test.ts). */
export const IX_TABLE_SORT_ICONS: Record<IxTableSortDirection, string> = {
    none: 'swap_vert',
    ascending: 'arrow_upward',
    descending: 'arrow_downward',
};

const ROW_CONTROL = '.ix-table__control input[type="checkbox"], .ix-table__control input[type="radio"]';
const FULL_WIDTH_ROW = '.ix-table__expanded, .ix-table__empty, .ix-table__loading';
const NOT_DATA_ROW = `${FULL_WIDTH_ROW}, .ix-table__skeleton`;
// Klikk herfra er en egen handling og skal ikke også aktivere raden.
const INTERACTIVE =
    'a[href], button, input, select, textarea, label, summary, [tabindex], [contenteditable=""], [contenteditable="true"], [role="button"], [role="link"]';
const STICKY_VALUES = ['first', 'last'];
/** Attributtene web componenten selv har satt på rulleområdet, per element. */
const OWNED_SCROLL_ATTRS = new WeakMap<Element, Set<string>>();
const SELECTION_PARTS = '.ix-table__selection, [data-selected-count], [data-field="selected-label"]';
// Tid fra et live-område settes inn til teksten skrives, så skjermleseren rekker
// å registrere det. 100 ms er vanlig praksis og merkes ikke av brukeren.
const LIVE_REGION_DELAY = 100;

// dd.mm.åååå, eventuelt med klokkeslett: «12.10.2026 14:30» eller «12.10.2026, kl. 14.30».
const NORWEGIAN_DATE = /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:,?\s+(?:kl\.?\s*)?(\d{1,2})[:.](\d{2}))?$/;
// åååå-mm-dd, eventuelt med klokkeslett: «2026-11-25» eller «2026-11-25T14:30».
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/;
// Valuta foran eller bak beløpet: «kr 500», «500 kr», «1 249 NOK», «500,-».
const CURRENCY = /^(?:kr\.?|nok)\s*|\s*(?:kr\.?|nok|,-)$/gi;
// \s dekker også hardt og smalt hardt mellomrom, som skiller tusener i norske tall.
// Punktum kan også skille tusener: «1.250» og «1.250,50».
const NUMBER = /^[+−-]?\s*\d[\d\s.]*(,\d+)?\s*%?$/;
// Bare punktum foran grupper på tre sifre er tusenskille. «1.5» er et desimaltall.
const DOT_THOUSANDS = /^\d{1,3}(\.\d{3})+$/;
// Plassholdere for en tom verdi.
const EMPTY = /^[–—-]?$/;
const collator = new Intl.Collator('nb', { numeric: true, sensitivity: 'base' });

function dateValue(y: string, m: string, d: string, h = '0', min = '0'): number {
    return Number(y) * 1e8 + Number(m) * 1e6 + Number(d) * 1e4 + Number(h) * 100 + Number(min);
}

/** Tall og datoer sammenlignes som tall, resten som tekst. Tom celle eller «–» gir ''. */
function sortValue(cell: HTMLTableCellElement | undefined): number | string {
    if (!cell) return '';
    const raw = (cell.dataset.sortValue ?? cell.textContent ?? '').trim();
    if (EMPTY.test(raw)) return '';
    const date = NORWEGIAN_DATE.exec(raw);
    if (date) return dateValue(date[3], date[2], date[1], date[4], date[5]);
    const iso = ISO_DATE.exec(raw);
    if (iso) return dateValue(iso[1], iso[2], iso[3], iso[4], iso[5]);
    const amount = raw.replace(CURRENCY, '').trim();
    if (NUMBER.test(amount)) {
        const sign = amount.startsWith('−') || amount.startsWith('-') ? -1 : 1;
        let digits = amount.replace(/^[+−-]/, '').replace(/[\s%]/g, '');
        if (digits.includes(',')) digits = digits.replace(/\./g, '').replace(',', '.');
        else if (DOT_THOUSANDS.test(digits)) digits = digits.replace(/\./g, '');
        const n = Number(digits);
        if (!Number.isNaN(n)) return sign * n;
    }
    return raw;
}

/** Kolonnen cellen starter i. Celler med colspan foran teller for flere kolonner. */
function columnOf(cell: HTMLTableCellElement): number {
    let column = 0;
    for (let prev = cell.previousElementSibling; prev; prev = prev.previousElementSibling) {
        if (prev instanceof HTMLTableCellElement) column += prev.colSpan;
    }
    return column;
}

/** Cellen i raden som dekker kolonnen, med colspan tatt med. */
function cellAt(row: HTMLTableRowElement, column: number): HTMLTableCellElement | undefined {
    let start = 0;
    for (const cell of Array.from(row.cells)) {
        if (column < start + cell.colSpan) return cell;
        start += cell.colSpan;
    }
    return undefined;
}

/** Sammenligner to verdier av samme type. */
function compareValues(a: number | string, b: number | string): number {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return collator.compare(String(a), String(b));
}

/** Tall før tekst og tomme sist, i begge retninger. */
function typeRank(value: number | string): number {
    if (value === '') return 2;
    return typeof value === 'number' ? 0 : 1;
}

function hasAccessibleName(el: Element): boolean {
    if (el.getAttribute('aria-label')?.trim() || el.getAttribute('aria-labelledby')) return true;
    if (el instanceof HTMLInputElement) {
        return Array.from(el.labels ?? []).some((label) => label.textContent?.trim());
    }
    return !!el.textContent?.trim();
}

export class IxTable extends HTMLElement {
    private _mutationObserver: MutationObserver | null = null;
    private _resizeObserver: ResizeObserver | null = null;
    private _clickListener: ((e: MouseEvent) => void) | null = null;
    private _changeListener: ((e: Event) => void) | null = null;
    private _scrollListener: (() => void) | null = null;
    private _scrollTarget: HTMLElement | null = null;

    private _instanceId = 0;
    private _orderCounter = 0;
    private _originalOrder = new WeakMap<HTMLTableRowElement, number>();
    /** Sorteringen komponenten selv har gjort, så nye rader kan sorteres inn. */
    private _activeSort: { column: number; direction: IxTableSortDirection } | null = null;
    // colspan komponenten selv har skrevet. Har attributtet fått en annen verdi,
    // er det konsumentens, og komponenten gir slipp på cellen.
    private _autoColspan = new WeakMap<HTMLTableCellElement, number>();
    /** Utvalget: value på de valgte radkontrollene, også rader som ikke vises. */
    private _selection = new Set<string>();
    /** Kontroller komponenten har sett, så en ny rad som er avkrysset i markupen blir lagt til. */
    private _knownControls = new WeakSet<HTMLInputElement>();
    private _warned = new WeakSet<Element>();
    // Attributtene vi satte på rulleområdet, så vi bare fjerner våre egne.
    private _warnedSticky: string | null = null;
    private _warnedLoadingLabel = false;
    private _lastBusy: boolean | null = null;
    private _announceTimer: ReturnType<typeof setTimeout> | null = null;
    private _loadingTimer: ReturnType<typeof setTimeout> | null = null;
    /** Statuselementer komponenten har sett, laget av den selv eller rendret av React. */
    private _seenStatus = new WeakSet<HTMLElement>();
    /** Kolonnen brukeren nettopp valgte, og aria-sort før klikket. Leses opp når den endres. */
    private _pendingSort: { th: HTMLTableCellElement; before: string | null } | null = null;
    private _warnedSortLabels = false;

    static get observedAttributes(): string[] {
        return ['data-sticky', 'loading-label'];
    }

    connectedCallback(): void {
        this._instanceId = ++tableCounter;

        this._clickListener = (e: MouseEvent) => this._onClick(e);
        this._changeListener = (e: Event) => this._onChange(e);
        this.addEventListener('click', this._clickListener);
        this.addEventListener('change', this._changeListener);

        // hidden er med, så «velg alle» og ekspandert innhold følger rader som
        // filtreres bort. data-align og disabled skriver komponenten aldri selv.
        // Ellers står våre egne skrivinger (data-column-align, colspan, ikoner)
        // ikke i filteret. Synken er idempotent og skriver hidden bare når verdien
        // endres, så endringer vi likevel ser gir én ekstra runde uten nye endringer.
        this._mutationObserver = new MutationObserver((records) => {
            if (records.some((record) => this._affectsTable(record))) this.refresh();
        });
        this._mutationObserver.observe(this, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['aria-sort', 'aria-expanded', 'aria-busy', 'hidden', 'data-align', 'disabled'],
        });

        if (typeof ResizeObserver !== 'undefined') {
            this._resizeObserver = new ResizeObserver(() => this._measure());
        }

        this.refresh();
    }

    disconnectedCallback(): void {
        this._mutationObserver?.disconnect();
        this._mutationObserver = null;
        this._resizeObserver?.disconnect();
        this._resizeObserver = null;

        if (this._clickListener) this.removeEventListener('click', this._clickListener);
        this._clickListener = null;
        if (this._changeListener) this.removeEventListener('change', this._changeListener);
        this._changeListener = null;

        if (this._scrollListener && this._scrollTarget) {
            this._scrollTarget.removeEventListener('scroll', this._scrollListener);
        }
        this._scrollListener = null;
        this._scrollTarget = null;

        if (this._announceTimer) clearTimeout(this._announceTimer);
        this._announceTimer = null;
        if (this._loadingTimer) clearTimeout(this._loadingTimer);
        this._loadingTimer = null;
        this._lastBusy = null;
    }

    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
        if (!this.isConnected) return;
        if (name === 'data-sticky') {
            if (import.meta.env.DEV) this._warnInvalidSticky(newValue);
            this._measure();
        }
        if (name === 'loading-label') this.refresh();
    }

    /** Hele utvalget, også rader som ikke vises. */
    get selection(): string[] {
        return [...this._selection];
    }

    /**
     * Setter utvalget fra koden, for eksempel etter at de valgte regningene er
     * godkjent. Sender ingen selection-change. Med radio gjelder bare den første.
     */
    setSelection(keys: Iterable<string>): void {
        const table = this._table();
        const list = [...keys];
        const single = !!table && this._dataRows(table).some((row) => this._rowControl(row)?.type === 'radio');
        this._selection = new Set(single ? list.slice(0, 1) : list);
        if (table) this._syncSelection(table, this._dataRows(table));
    }

    clearSelection(): void {
        this.setSelection([]);
    }

    /** Synker all avledet tilstand fra DOM-en. Trygt å kalle så ofte man vil. */
    refresh(): void {
        const table = this._table();
        if (!table) {
            if (import.meta.env.DEV && !this._warned.has(this)) {
                this._warned.add(this);
                console.warn('[ix-table] Fant ingen <table>.');
            }
            return;
        }

        let rows = this._dataRows(table);
        if (!this._activeSort) {
            // Uten egen sortering er rekkefølgen i DOM-en den opprinnelige, også for
            // rader som er lagt til siden sist.
            rows.forEach((row, i) => this._originalOrder.set(row, i));
            this._orderCounter = rows.length;
        } else if (rows.some((row) => !this._originalOrder.has(row))) {
            // Nye rader mens tabellen er sortert, sorteres inn. De kom sist.
            this._linkExpanded(table);
            rows.forEach((row) => {
                if (!this._originalOrder.has(row)) this._originalOrder.set(row, this._orderCounter++);
            });
            this._sortRows(table, this._activeSort.column, this._activeSort.direction);
            rows = this._dataRows(table);
        }

        this._syncStructure(table, rows);
        this._syncSortIcons(table);
        this._syncExpanded(table);
        this._syncSelection(table, rows);
        this._syncStatus(table);
        this._announcePendingSort();
        this._wireScroll();
        this._measure();
        if (import.meta.env.DEV) {
            this._warnMissingNames(table, rows);
            this._warnInvalidSticky(this.getAttribute('data-sticky'));
        }
    }

    /**
     * Endringer i toolbaren, en meny eller annet rundt tabellen trenger ingen synk.
     * Endringer i tabellen eller i noe som inneholder den (et nytt rulleområde),
     * gjør det.
     */
    private _affectsTable(record: MutationRecord): boolean {
        const table = this._table();
        const target = record.target;
        if (!table || target === this || table.contains(target) || target.contains(table)) return true;
        // Utvalget og telleren i toolbaren skal synkes når de dukker opp.
        return Array.from(record.addedNodes).some(
            (node) =>
                node instanceof Element && (node.matches(SELECTION_PARTS) || !!node.querySelector(SELECTION_PARTS))
        );
    }

    private _table(): HTMLTableElement | null {
        return this.querySelector('table');
    }

    private _dataRows(table: HTMLTableElement): HTMLTableRowElement[] {
        return Array.from(table.tBodies).flatMap((body) =>
            Array.from(body.rows).filter((row) => !row.matches(NOT_DATA_ROW))
        );
    }

    private _headerCells(table: HTMLTableElement): HTMLTableCellElement[] {
        return Array.from(table.tHead?.rows[0]?.cells ?? []);
    }

    private _columnCount(table: HTMLTableElement): number {
        const cells = this._headerCells(table);
        const source = cells.length ? cells : Array.from(this._dataRows(table)[0]?.cells ?? []);
        return source.reduce((sum, cell) => sum + cell.colSpan, 0);
    }

    /** Raden selv er skjult, f.eks. av et filter. En lukket forelder teller ikke. */
    private _isRowVisible(row: HTMLTableRowElement): boolean {
        return !row.hidden && getComputedStyle(row).display !== 'none';
    }

    private _rowControl(row: HTMLTableRowElement): HTMLInputElement | null {
        return row.querySelector<HTMLInputElement>(ROW_CONTROL);
    }

    private _expandButton(row: HTMLTableRowElement): HTMLButtonElement | null {
        return row.querySelector<HTMLButtonElement>('.ix-table__expand');
    }

    // getElementById er et oppslag, ikke et søk. Å gå gjennom radene for hver
    // ekspanderingsknapp ble kvadratisk i store tabeller.
    private _rowById(table: HTMLTableElement, id: string | null): HTMLTableRowElement | null {
        if (!id) return null;
        const el = table.isConnected
            ? table.ownerDocument.getElementById(id)
            : table.querySelector(`#${CSS.escape(id)}`);
        return el instanceof HTMLTableRowElement && table.contains(el) ? el : null;
    }

    // ── Struktur ──────────────────────────────────────────────────────────

    private _syncStructure(table: HTMLTableElement, rows: HTMLTableRowElement[]): void {
        const columns = this._columnCount(table);
        table.querySelectorAll<HTMLTableRowElement>(FULL_WIDTH_ROW).forEach((row) => {
            const cell = row.cells[0];
            if (row.cells.length !== 1 || !columns) return;
            const auto = this._autoColspan.get(cell);
            if (cell.hasAttribute('colspan') && cell.colSpan !== auto) {
                this._autoColspan.delete(cell);
                return;
            }
            if (cell.colSpan !== columns) cell.colSpan = columns;
            this._autoColspan.set(cell, columns);
        });

        // Justeringen står på kolonnens th, så konsumenten slipper å gjenta den i
        // hver celle. Den arves som data-column-align, et attributt bare
        // komponenten skriver, så cellens egen data-align vinner i CSS og aldri
        // blir overskrevet. Kolonnen regnes med colspan, så en overskrift over to
        // kolonner gjelder begge.
        const align: (string | null)[] = [];
        this._headerCells(table).forEach((th) => {
            const start = columnOf(th);
            for (let i = 0; i < th.colSpan; i++) align[start + i] = th.getAttribute('data-align');
        });
        rows.forEach((row) => {
            Array.from(row.cells).forEach((cell) => {
                const value = align[columnOf(cell)];
                if (value) {
                    if (cell.getAttribute('data-column-align') !== value) cell.setAttribute('data-column-align', value);
                } else if (cell.hasAttribute('data-column-align')) {
                    cell.removeAttribute('data-column-align');
                }
            });
            // En deaktivert kontroll kan ikke aktiveres med klikk på raden.
            const control = this._rowControl(row);
            const interactive = !!((control && !control.disabled) || this._expandButton(row));
            row.toggleAttribute('data-interactive', interactive);
        });
    }

    // ── Sortering ─────────────────────────────────────────────────────────

    // Alle tre ikonene legges inn med en gang, og CSS viser det som hører til
    // aria-sort. Et ikon lastes først når det vises, så å bytte name ved sortering
    // ga et blankt øyeblikk mens SVG-en ble hentet fra CDN-en.
    private _syncSortIcons(table: HTMLTableElement): void {
        table.tHead?.querySelectorAll('th').forEach((th) => {
            const button = th.querySelector<HTMLButtonElement>('.ix-table__sort');
            if (!button || button.querySelector(':scope > .ix-table__sort-icon')) return;
            const wrapper = document.createElement('span');
            wrapper.className = 'ix-table__sort-icon';
            wrapper.setAttribute('aria-hidden', 'true');
            (Object.keys(IX_TABLE_SORT_ICONS) as IxTableSortDirection[]).forEach((direction) => {
                const icon = document.createElement('ix-icon');
                icon.setAttribute('name', IX_TABLE_SORT_ICONS[direction]);
                icon.setAttribute('data-size', 'sm');
                icon.setAttribute('data-sort-icon', direction);
                wrapper.append(icon);
            });
            button.append(wrapper);
        });
    }

    private _toggleSort(th: HTMLTableCellElement): void {
        const table = this._table();
        if (!table) return;
        const current = (th.getAttribute('aria-sort') as IxTableSortDirection | null) ?? 'none';
        const direction = NEXT_SORT[current] ?? 'ascending';
        const column = columnOf(th);

        const detail: IxTableSortChangeDetail = { column, key: th.getAttribute('data-sort-key'), direction };
        this._pendingSort = { th, before: th.getAttribute('aria-sort') };

        // Kontrollert: den som eier radene, setter aria-sort og rekkefølgen.
        // Valget står i markupen, så det gjelder også før en React-app har festet
        // lyttere, og komponenten flytter aldri rader React eier.
        if (this.hasAttribute('data-sort-controlled')) {
            this.dispatchEvent(new CustomEvent<IxTableSortChangeDetail>('sort-request', { bubbles: true, detail }));
            return;
        }

        table.tHead?.querySelectorAll('th').forEach((cell) => {
            if (cell !== th) cell.removeAttribute('aria-sort');
        });
        if (direction === 'none') th.removeAttribute('aria-sort');
        else th.setAttribute('aria-sort', direction);

        this._sortRows(table, column, direction);
        this._activeSort = direction === 'none' ? null : { column, direction };
        this._syncSortIcons(table);
        this._announcePendingSort();
        this.dispatchEvent(new CustomEvent<IxTableSortChangeDetail>('sort-change', { bubbles: true, detail }));
    }

    /**
     * Rekkefølgen endres uten at fokus flytter seg, så endringen leses opp
     * (WCAG 4.1.3). Med data-sort-controlled venter vi til eieren faktisk har satt
     * aria-sort, så meldingen stemmer med det som vises.
     */
    private _announcePendingSort(): void {
        const pending = this._pendingSort;
        if (!pending) return;
        const now = pending.th.getAttribute('aria-sort');
        if (now === pending.before) return;
        this._pendingSort = null;
        const direction = (now as IxTableSortDirection | null) ?? 'none';
        const template = this.getAttribute(`sort-${direction}-label`);
        if (!template) return;
        const column = (
            pending.th.querySelector('.ix-table__sort')?.textContent ??
            pending.th.textContent ??
            ''
        ).trim();
        this._announce(template.replaceAll('{column}', column));
    }

    /** Flytter radene, med ekspandert innhold, i ny rekkefølge innenfor hver tbody. */
    private _sortRows(table: HTMLTableElement, column: number, direction: IxTableSortDirection): void {
        Array.from(table.tBodies).forEach((body) => {
            const rows = Array.from(body.rows).filter((row) => !row.matches(NOT_DATA_ROW));
            if (rows.length < 2) return;
            // Verdien regnes ut én gang per rad, ikke ved hver sammenligning.
            const groups = rows.map((row) => ({
                row,
                members: [row, ...this._expandedRowsOf(table, row)],
                value: sortValue(cellAt(row, column)),
                order: this._originalOrder.get(row) ?? 0,
            }));
            const factor = direction === 'descending' ? -1 : 1;
            groups.sort((a, b) => {
                if (direction === 'none') return a.order - b.order;
                // Typen avgjør først og snus ikke: tall, så tekst, så tomme celler.
                const rank = typeRank(a.value) - typeRank(b.value);
                if (rank !== 0) return rank;
                return compareValues(a.value, b.value) * factor || a.order - b.order;
            });
            // Rader som ikke er data (tom, loading) blir stående sist.
            const placed = new Set(groups.flatMap((g) => g.members));
            const rest = Array.from(body.rows).filter((row) => !placed.has(row));
            body.append(...groups.flatMap((g) => g.members), ...rest);
        });
    }

    // ── Ekspandering ──────────────────────────────────────────────────────

    private _expandedRowsOf(table: HTMLTableElement, row: HTMLTableRowElement): HTMLTableRowElement[] {
        const button = this._expandButton(row);
        const target = this._rowById(table, button?.getAttribute('aria-controls') ?? null);
        return target ? [target] : [];
    }

    /**
     * aria-controls kan utelates når innholdet står rett etter raden. Koblingen må
     * finnes før radene flyttes, ellers blir innholdet liggende igjen der det sto.
     */
    private _linkExpanded(table: HTMLTableElement): void {
        this._dataRows(table).forEach((row) => {
            const button = this._expandButton(row);
            if (!button || button.hasAttribute('aria-controls')) return;
            const next = row.nextElementSibling;
            if (next instanceof HTMLTableRowElement && next.matches('.ix-table__expanded')) {
                if (!next.id) next.id = `ix-table-${this._instanceId}-expanded-${++expandedCounter}`;
                button.setAttribute('aria-controls', next.id);
            }
        });
    }

    private _syncExpanded(table: HTMLTableElement): void {
        this._linkExpanded(table);
        const opened: HTMLTableRowElement[] = [];
        this._dataRows(table).forEach((row) => {
            const button = this._expandButton(row);
            if (!button) return;
            if (!button.hasAttribute('aria-expanded')) button.setAttribute('aria-expanded', 'false');
            const expanded = button.getAttribute('aria-expanded') === 'true';
            // Filtreres raden bort, skjules innholdet også. aria-expanded står, så
            // innholdet kommer tilbake sammen med raden.
            const shown = expanded && this._isRowVisible(row);
            const target = this._rowById(table, button.getAttribute('aria-controls'));
            if (target && target.hidden === shown) {
                if (shown) {
                    target.setAttribute('data-animate', '');
                    opened.push(target);
                }
                target.hidden = !shown;
            }
        });

        // data-animate slår på @starting-style i CSS-en, så raden vokser fram når
        // den åpnes, men ikke når den flyttes ved sortering. getAnimations()
        // beregner stilen og starter overgangene. Etter det trengs ikke attributtet.
        opened.forEach((target) => {
            if (typeof target.getAnimations === 'function') target.getAnimations({ subtree: true });
            target.removeAttribute('data-animate');
        });
    }

    private _toggleExpanded(button: HTMLButtonElement): void {
        const table = this._table();
        const row = button.closest('tr');
        if (!table || !row) return;
        const expanded = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(expanded));
        this._syncExpanded(table);
        this.dispatchEvent(
            new CustomEvent<IxTableExpandChangeDetail>('expand-change', { bubbles: true, detail: { row, expanded } })
        );
    }

    // ── Valg ──────────────────────────────────────────────────────────────

    private _selectAll(table: HTMLTableElement): HTMLInputElement | null {
        return table.tHead?.querySelector<HTMLInputElement>('.ix-table__control input[type="checkbox"]') ?? null;
    }

    /**
     * Speiler utvalget ut i kontrollene. En kontroll komponenten ikke har sett før,
     * og som er avkrysset i markupen (eller med defaultChecked i React), legges til.
     * Ellers er det utvalget som bestemmer, så en rad som kommer tilbake fra en
     * annen side, er valgt igjen. «Velg alle» og tilstanden i headeren gjelder
     * radene som vises. Antallet er hele utvalget.
     */
    private _syncSelection(table: HTMLTableElement, rows: HTMLTableRowElement[]): void {
        const controls = rows.map((row) => this._rowControl(row));

        // Radioene må dele name for at bare én kan være valgt.
        const radios = controls.filter((c): c is HTMLInputElement => c?.type === 'radio');
        const name = radios.find((r) => r.name)?.name ?? `ix-table-${this._instanceId}`;
        radios.forEach((radio) => {
            if (!radio.name) radio.name = name;
        });

        controls.forEach((control) => {
            // Uten value hører kontrollen ikke til noen nøkkel. Den advares om.
            if (!control || !control.hasAttribute('value')) return;
            if (!this._knownControls.has(control)) {
                this._knownControls.add(control);
                if (control.checked) this._select(control);
            }
            const checked = this._selection.has(control.value);
            if (control.checked !== checked) control.checked = checked;
        });

        rows.forEach((row, i) => row.toggleAttribute('data-selected', !!controls[i]?.checked));

        // Synligheten leses bare når det finnes en «velg alle». Den koster en
        // stilberegning per rad.
        const selectAll = this._selectAll(table);
        if (selectAll) {
            const enabled = controls.filter(
                (c, i): c is HTMLInputElement => !!c && !c.disabled && this._isRowVisible(rows[i])
            );
            const checked = enabled.filter((c) => c.checked).length;
            selectAll.checked = enabled.length > 0 && checked === enabled.length;
            selectAll.indeterminate = checked > 0 && checked < enabled.length;
        }

        const selectedCount = this._selection.size;
        this.querySelectorAll('[data-selected-count]').forEach((el) => {
            if (el.textContent !== String(selectedCount)) el.textContent = String(selectedCount);
        });
        // Bare når verdien endres: hidden står i observerfilteret.
        this.querySelectorAll<HTMLElement>('.ix-table__selection').forEach((el) => {
            if (el.hidden !== (selectedCount === 0)) el.hidden = selectedCount === 0;
        });
    }

    /** Legger kontrollens value i utvalget. En radio erstatter det som var valgt. */
    private _select(control: HTMLInputElement): void {
        if (control.type === 'radio') this._selection.clear();
        this._selection.add(control.value);
    }

    private _dispatchSelection(): void {
        this.dispatchEvent(
            new CustomEvent<IxTableSelectionChangeDetail>('selection-change', {
                bubbles: true,
                detail: { selected: [...this._selection] },
            })
        );
    }

    private _onChange(e: Event): void {
        const table = this._table();
        const target = e.target;
        if (!table || !(target instanceof HTMLInputElement) || !table.contains(target)) return;
        if (!target.closest('.ix-table__control')) return;

        if (target === this._selectAll(table)) {
            // Velg alle gjelder radene som vises. Valg på andre sider eller i rader
            // som er filtrert bort, står.
            this._dataRows(table).forEach((row) => {
                const control = this._rowControl(row);
                if (!control || control.disabled || !this._isRowVisible(row) || !control.hasAttribute('value')) return;
                this._knownControls.add(control);
                if (target.checked) this._selection.add(control.value);
                else this._selection.delete(control.value);
            });
        } else if (target.hasAttribute('value')) {
            this._knownControls.add(target);
            if (target.checked) this._select(target);
            else this._selection.delete(target.value);
        }
        this._syncSelection(table, this._dataRows(table));
        this._dispatchSelection();
        this._announceSelection();
    }

    /**
     * Antallet valgte er en statusmelding (WCAG 4.1.3): checkboxen sier bare
     * «avmerket», ikke at alle radene ble valgt. Teksten leses etter én runde, så
     * React rekker å rendre det nye antallet før vi kopierer det.
     */
    private _announceSelection(): void {
        if (!this.querySelector('[data-field="selected-label"]')) return;
        this._announce(() => this.querySelector('[data-field="selected-label"]')?.textContent?.trim() ?? '');
    }

    /**
     * Skriver en melding i statuselementet etter én runde, så React rekker å
     * rendre det nye. Er teksten lik den forrige, tømmes elementet først, ellers
     * leses den ikke opp på nytt.
     */
    private _announce(text: string | (() => string)): void {
        const status = this._statusElement();
        if (this._announceTimer) clearTimeout(this._announceTimer);
        this._announceTimer = setTimeout(() => {
            this._announceTimer = null;
            const message = typeof text === 'function' ? text() : text;
            if (!message) return;
            if (status.textContent === message) {
                status.textContent = '';
                this._announceTimer = setTimeout(() => {
                    this._announceTimer = null;
                    status.textContent = message;
                }, LIVE_REGION_DELAY);
            } else {
                status.textContent = message;
            }
        }, 0);
    }

    // ── Klikk ─────────────────────────────────────────────────────────────

    private _onClick(e: MouseEvent): void {
        const table = this._table();
        const target = e.target;
        if (!table || !(target instanceof Element) || !table.contains(target)) return;

        const sort = target.closest<HTMLButtonElement>('.ix-table__sort');
        if (sort) {
            const th = sort.closest('th');
            if (th) this._toggleSort(th);
            return;
        }

        const expand = target.closest<HTMLButtonElement>('.ix-table__expand');
        if (expand) {
            this._toggleExpanded(expand);
            return;
        }

        const row = target.closest('tr');
        if (!row?.hasAttribute('data-interactive') || !row.parentElement?.matches('tbody')) return;
        const interactive = target.closest(INTERACTIVE);
        if (interactive && row.contains(interactive)) return;
        // Brukeren markerer tekst i raden, for eksempel for å kopiere et beløp.
        if (window.getSelection?.()?.toString()) return;

        (this._rowControl(row) ?? this._expandButton(row))?.click();
    }

    // ── Loading ───────────────────────────────────────────────────────────

    /** Ett statuselement for loading og utvalg. Det må finnes før teksten settes, ellers annonseres den ikke. */
    private _statusElement(): HTMLElement {
        let status = this.querySelector<HTMLElement>(':scope > [data-field="status"]');
        if (!status) {
            status = document.createElement('span');
            status.className = 'ix-sr-only';
            status.setAttribute('role', 'status');
            status.setAttribute('data-field', 'status');
            this.append(status);
        }
        return status;
    }

    private _syncStatus(table: HTMLTableElement): void {
        const label = this.getAttribute('loading-label');
        const busy = table.getAttribute('aria-busy') === 'true';
        const hasCandidates = label || busy || this.querySelector('[data-field="selected-label"]');
        const status = hasCandidates ? this._statusElement() : null;
        // Nytt for komponenten, enten det ble laget nå eller rendret av React i samme runde.
        const created = !!status && !this._seenStatus.has(status);
        if (status) this._seenStatus.add(status);
        // Teksten skrives bare når loading starter eller slutter. Ellers ville hver
        // synk visket ut meldingen om utvalget.
        if (status && busy !== this._lastBusy) {
            const text = busy && label ? label : '';
            if (this._loadingTimer) clearTimeout(this._loadingTimer);
            this._loadingTimer = null;
            if (created && text) {
                // Et statuselement som settes inn med teksten allerede i seg, leses
                // ofte ikke opp. Det skjer når tabellen laster fra første stund
                // (skeleton). Skjermleseren må rekke å registrere elementet først.
                this._loadingTimer = setTimeout(() => {
                    this._loadingTimer = null;
                    if (status.textContent !== text) status.textContent = text;
                }, LIVE_REGION_DELAY);
            } else if (status.textContent !== text) {
                status.textContent = text;
            }
        }
        this._lastBusy = busy;

        if (import.meta.env.DEV && busy && !label && !this._warnedLoadingLabel) {
            this._warnedLoadingLabel = true;
            console.warn('[ix-table] Tabellen laster, men mangler loading-label, så skjermlesere får ikke vite det.');
        }
    }

    // ── Rulling og mål ────────────────────────────────────────────────────

    private _wireScroll(): void {
        const scroll = this.querySelector<HTMLElement>('.ix-table__scroll');
        if (scroll === this._scrollTarget) return;

        if (this._scrollListener && this._scrollTarget) {
            this._scrollTarget.removeEventListener('scroll', this._scrollListener);
            this._resizeObserver?.unobserve(this._scrollTarget);
        }
        this._scrollTarget = scroll;
        if (!scroll) return;

        this._scrollListener = () => this._syncOverflow();
        scroll.addEventListener('scroll', this._scrollListener, { passive: true });
        this._resizeObserver?.observe(scroll);
        const table = this._table();
        if (table) this._resizeObserver?.observe(table);
    }

    private _measure(): void {
        const table = this._table();
        if (!table) return;

        // Høyden på radområdet huskes til loading-raden, så innholdet under ikke
        // hopper mens nye rader lastes.
        const body = table.tBodies[0];
        if (body && table.getAttribute('aria-busy') !== 'true' && body.offsetHeight > 0) {
            this.style.setProperty('--ii-table-body-height', `${body.offsetHeight}px`);
        }

        // Den synlige bredden. Rader som spenner hele tabellen (ekspandert innhold,
        // ingen treff, loading) holder innholdet innenfor den, så tekst ikke legger
        // seg etter en tabell som er bredere enn skjermen (WCAG 1.4.10).
        const scroll = this._scrollTarget;
        if (scroll && scroll.clientWidth > 0) {
            this.style.setProperty('--ii-table-scroll-width', `${scroll.clientWidth}px`);
        }

        const sticky = this.getAttribute('data-sticky');
        const cells = this._headerCells(table);
        const control = cells[0]?.matches('.ix-table__control') ? cells[0] : null;
        const controlWidth = control?.offsetWidth ?? 0;
        this.style.setProperty('--ii-table-control-width', `${controlWidth}px`);

        if (sticky === 'first') {
            const stickyCell = control ? cells[1] : cells[0];
            this.style.setProperty('--ii-table-sticky-start', `${controlWidth + (stickyCell?.offsetWidth ?? 0)}px`);
        } else {
            this.style.removeProperty('--ii-table-sticky-start');
        }
        if (sticky === 'last') {
            this.style.setProperty('--ii-table-sticky-end', `${cells[cells.length - 1]?.offsetWidth ?? 0}px`);
        } else {
            this.style.removeProperty('--ii-table-sticky-end');
        }

        this._syncOverflow();
    }

    private _syncOverflow(): void {
        const scroll = this._scrollTarget;
        if (!scroll) return;
        const max = scroll.scrollWidth - scroll.clientWidth;
        const position = Math.abs(scroll.scrollLeft);
        const overflowing = max > 1;
        scroll.toggleAttribute('data-overflow-start', overflowing && position > 1);
        scroll.toggleAttribute('data-overflow-end', overflowing && position < max - 1);

        // Et rulleområde må kunne nås med tastatur (WCAG 2.1.1). Uten rulling er
        // det bare et ekstra tabstopp, så det får fokus bare når det trengs.
        const table = this._table();
        const caption = table?.caption ?? null;
        if (overflowing && caption && !caption.id) caption.id = `ix-table-${this._instanceId}-caption`;
        const name = table?.getAttribute('aria-labelledby') ?? (caption ? caption.id : null);
        const label = table?.getAttribute('aria-label');
        const wanted: Record<string, string | null> = {
            tabindex: overflowing ? '0' : null,
            role: overflowing ? 'region' : null,
            'aria-labelledby': overflowing && name ? name : null,
            'aria-label': overflowing && !name && label ? label : null,
        };
        // Eierskapet følger elementet, så det overlever at tabellen flyttes i DOM-en.
        let owned = OWNED_SCROLL_ATTRS.get(scroll);
        if (!owned) OWNED_SCROLL_ATTRS.set(scroll, (owned = new Set()));
        Object.entries(wanted).forEach(([attr, value]) => {
            const ours = owned.has(attr);
            if (scroll.hasAttribute(attr) && !ours) return;
            if (value === null) {
                if (ours) scroll.removeAttribute(attr);
                owned.delete(attr);
            } else {
                if (scroll.getAttribute(attr) !== value) scroll.setAttribute(attr, value);
                owned.add(attr);
            }
        });
    }

    // ── Advarsler ─────────────────────────────────────────────────────────

    private _warnInvalidSticky(value: string | null): void {
        if (value === null || STICKY_VALUES.includes(value) || value === this._warnedSticky) return;
        this._warnedSticky = value;
        console.warn(`[ix-table] data-sticky="${value}" er ugyldig. Bruk "first" eller "last".`);
    }

    private _warnMissingNames(table: HTMLTableElement, rows: HTMLTableRowElement[]): void {
        const warnOnce = (el: Element, message: string): void => {
            if (this._warned.has(el)) return;
            this._warned.add(el);
            console.warn(`[ix-table] ${message}`, el);
        };

        if (!table.getAttribute('aria-labelledby') && !table.getAttribute('aria-label') && !table.caption) {
            warnOnce(table, 'Tabellen mangler navn. Sett aria-labelledby til overskriften, eller aria-label.');
        }
        const sortable = !!table.tHead?.querySelector('.ix-table__sort');
        const hasSortLabels = ['ascending', 'descending', 'none'].some((d) => this.hasAttribute(`sort-${d}-label`));
        if (sortable && !hasSortLabels && !this._warnedSortLabels) {
            this._warnedSortLabels = true;
            console.warn(
                '[ix-table] Sorterbare kolonner uten sort-ascending-label, sort-descending-label og sort-none-label. Skjermlesere får ikke vite at rekkefølgen endret seg.'
            );
        }
        const selectAll = this._selectAll(table);
        if (selectAll && !hasAccessibleName(selectAll)) {
            warnOnce(selectAll, 'Checkboxen for å velge alle mangler tilgjengelig navn.');
        }
        rows.forEach((row) => {
            const control = this._rowControl(row);
            if (control && !hasAccessibleName(control)) {
                warnOnce(control, 'Valgkontrollen i raden mangler tilgjengelig navn, f.eks. «Velg Strømleverandør».');
            }
            // Uten value får alle slike kontroller verdien «on», og selection-change
            // kan ikke skille radene fra hverandre.
            if (control && !control.hasAttribute('value')) {
                warnOnce(
                    row,
                    'Valgkontrollen i raden mangler value, så utvalget kan ikke skille radene fra hverandre.'
                );
            }
            const expand = this._expandButton(row);
            if (expand && !hasAccessibleName(expand)) {
                warnOnce(
                    expand,
                    'Ekspanderingsknappen mangler tilgjengelig navn, f.eks. aria-label="Vis detaljer for Boliglån".'
                );
            }
        });
    }
}
