/**
 * IxTable — ARIA-lim rundt en native <table> i light DOM. Forfatteren skriver
 * vanlig tabellmarkup med checkbox, radio, sorterings- og ekspanderingsknapper;
 * <ix-table> kobler dem sammen og holder tilstanden i attributter CSS leser.
 *
 * - Sortering: `.ix-table__sort` i en `th` går ingen → stigende → synkende →
 *   ingen. `aria-sort` står bare på den sorterte kolonnen. Sender avbrytbar
 *   `sort-change`. Uten `preventDefault()` sorterer komponenten radene selv.
 * - Valg: checkbox eller radio i `.ix-table__control` speiles som
 *   `data-selected` på raden. Checkbox i headeren velger alle og blir
 *   indeterminate. Antallet skrives i `[data-selected-count]`, og
 *   `.ix-table__selection` vises når noe er valgt. Etter et valg leses teksten i
 *   `[data-field="selected-label"]` opp, f.eks. «3 valgt». Sender `selection-change`.
 *   Utvalget gjelder bare radene som vises: «velg alle» og antallet hopper over
 *   skjulte rader, og en valgt rad som skjules (`hidden` eller `display: none`)
 *   mister valget, med `selection-change`.
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
 * All tilstand leses fra DOM-en ved hver synk, så kontrollert React kan sette
 * `aria-sort`, `aria-expanded` og `checked` selv og kalle `refresh()`.
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

export type IxTableSortChangeDetail = {
    /** Kolonnens indeks i headerraden. */
    column: number;
    /** `data-sort-key` på kolonnens `th`, eller `null`. */
    key: string | null;
    direction: IxTableSortDirection;
};

export type IxTableSelectionChangeDetail = {
    /** `value` på de valgte kontrollene, i radrekkefølge. */
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

const SORT_ICON: Record<IxTableSortDirection, string> = {
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
// Valuta foran eller bak beløpet: «kr 500», «500 kr», «1 249 NOK», «500,-».
const CURRENCY = /^(?:kr\.?|nok)\s*|\s*(?:kr\.?|nok|,-)$/gi;
// \s dekker også hardt og smalt hardt mellomrom, som skiller tusener i norske tall.
const NUMBER = /^[+−-]?\s*\d[\d\s]*([.,]\d+)?\s*%?$/;
const collator = new Intl.Collator('nb', { numeric: true, sensitivity: 'base' });

/** Tall og datoer (dd.mm.åååå) sammenlignes som tall, resten som tekst. */
function sortValue(cell: HTMLTableCellElement | undefined): number | string {
    if (!cell) return '';
    const raw = (cell.dataset.sortValue ?? cell.textContent ?? '').trim();
    const date = NORWEGIAN_DATE.exec(raw);
    if (date) {
        const [, d, m, y, h = '0', min = '0'] = date;
        return Number(y) * 1e8 + Number(m) * 1e6 + Number(d) * 1e4 + Number(h) * 100 + Number(min);
    }
    const amount = raw.replace(CURRENCY, '').trim();
    if (NUMBER.test(amount)) {
        const n = Number(
            amount
                .replace(/[\s%+]/g, '')
                .replace('−', '-')
                .replace(',', '.')
        );
        if (!Number.isNaN(n)) return n;
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

/** Tall før tekst, så en kolonne som blander dem, sorteres likt hver gang. */
function compareValues(a: number | string, b: number | string): number {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    if (typeof a === 'number') return -1;
    if (typeof b === 'number') return 1;
    return collator.compare(a, b);
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
    private _autoColspan = new WeakSet<HTMLTableCellElement>();
    private _autoAlign = new WeakSet<HTMLTableCellElement>();
    private _warned = new WeakSet<Element>();
    // Attributtene vi satte på rulleområdet, så vi bare fjerner våre egne.
    private _warnedSticky: string | null = null;
    private _warnedLoadingLabel = false;
    private _lastBusy: boolean | null = null;
    private _announceTimer: ReturnType<typeof setTimeout> | null = null;
    private _loadingTimer: ReturnType<typeof setTimeout> | null = null;

    static get observedAttributes(): string[] {
        return ['data-sticky', 'loading-label'];
    }

    connectedCallback(): void {
        this._instanceId = ++tableCounter;

        this._clickListener = (e: MouseEvent) => this._onClick(e);
        this._changeListener = (e: Event) => this._onChange(e);
        this.addEventListener('click', this._clickListener);
        this.addEventListener('change', this._changeListener);

        // hidden er med, så en rad som filtreres bort i HTML mister valget. Ellers
        // står våre egne skrivinger (data-*, colspan, ikonnavn) ikke i filteret.
        // Synken er idempotent og skriver hidden bare når verdien endres, så
        // endringer vi likevel ser gir én ekstra runde uten nye endringer.
        this._mutationObserver = new MutationObserver((records) => {
            if (records.some((record) => this._affectsTable(record))) this.refresh();
        });
        this._mutationObserver.observe(this, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['aria-sort', 'aria-expanded', 'aria-busy', 'hidden'],
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
            rows.forEach((row) => {
                if (!this._originalOrder.has(row)) this._originalOrder.set(row, this._orderCounter++);
            });
            this._sortRows(table, this._activeSort.column, this._activeSort.direction);
            rows = this._dataRows(table);
        }

        this._syncStructure(table, rows);
        this._syncSortIcons(table);
        this._syncExpanded(table);
        if (this._syncSelection(table, rows)) this._dispatchSelection(table);
        this._syncStatus(table);
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
            if (!cell.hasAttribute('colspan') || this._autoColspan.has(cell)) {
                cell.colSpan = columns;
                this._autoColspan.add(cell);
            }
        });

        // Justeringen står på kolonnens th, så konsumenten slipper å gjenta den
        // i hver celle. En celle med egen data-align beholder den.
        // Kolonnen regnes med colspan, så en overskrift over to kolonner gjelder begge.
        const align: (string | null)[] = [];
        this._headerCells(table).forEach((th) => {
            const start = columnOf(th);
            for (let i = 0; i < th.colSpan; i++) align[start + i] = th.getAttribute('data-align');
        });
        rows.forEach((row) => {
            Array.from(row.cells).forEach((cell) => {
                if (cell.hasAttribute('data-align') && !this._autoAlign.has(cell)) return;
                const value = align[columnOf(cell)];
                if (value) {
                    cell.setAttribute('data-align', value);
                    this._autoAlign.add(cell);
                } else if (this._autoAlign.has(cell)) {
                    cell.removeAttribute('data-align');
                }
            });
            const interactive = !!(this._rowControl(row) || this._expandButton(row));
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
            (Object.keys(SORT_ICON) as IxTableSortDirection[]).forEach((direction) => {
                const icon = document.createElement('ix-icon');
                icon.setAttribute('name', SORT_ICON[direction]);
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

        const event = new CustomEvent<IxTableSortChangeDetail>('sort-change', {
            bubbles: true,
            cancelable: true,
            detail: { column, key: th.getAttribute('data-sort-key'), direction },
        });
        if (!this.dispatchEvent(event)) return;

        table.tHead?.querySelectorAll('th').forEach((cell) => {
            if (cell !== th) cell.removeAttribute('aria-sort');
        });
        if (direction === 'none') th.removeAttribute('aria-sort');
        else th.setAttribute('aria-sort', direction);

        this._sortRows(table, column, direction);
        this._activeSort = direction === 'none' ? null : { column, direction };
        this._syncSortIcons(table);
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
                // Tomme celler står sist i begge retninger.
                if ((a.value === '') !== (b.value === '')) return a.value === '' ? 1 : -1;
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

    private _syncExpanded(table: HTMLTableElement): void {
        const opened: HTMLTableRowElement[] = [];
        this._dataRows(table).forEach((row) => {
            const button = this._expandButton(row);
            if (!button) return;
            // aria-controls kan utelates når innholdet står rett etter raden.
            if (!button.hasAttribute('aria-controls')) {
                const next = row.nextElementSibling;
                if (next instanceof HTMLTableRowElement && next.matches('.ix-table__expanded')) {
                    if (!next.id) next.id = `ix-table-${this._instanceId}-expanded-${++expandedCounter}`;
                    button.setAttribute('aria-controls', next.id);
                }
            }
            if (!button.hasAttribute('aria-expanded')) button.setAttribute('aria-expanded', 'false');
            const expanded = button.getAttribute('aria-expanded') === 'true';
            const target = this._rowById(table, button.getAttribute('aria-controls'));
            if (target && target.hidden === expanded) {
                if (expanded) {
                    target.setAttribute('data-animate', '');
                    opened.push(target);
                }
                target.hidden = !expanded;
            }
            row.toggleAttribute('data-expanded', expanded);
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
     * Utvalget gjelder bare radene som vises. En valgt rad som skjules, mister
     * valget, og «velg alle» og telleren regner bare med synlige rader. Returnerer
     * true når synken fjernet et valg, så refresh() kan sende selection-change.
     */
    private _syncSelection(table: HTMLTableElement, rows: HTMLTableRowElement[]): boolean {
        const controls = rows.map((row) => this._rowControl(row));
        const visible = rows.map((row) => this._isRowVisible(row));

        let deselected = false;
        controls.forEach((control, i) => {
            if (control?.checked && !visible[i]) {
                control.checked = false;
                deselected = true;
            }
        });

        // Radioene må dele name for at bare én kan være valgt.
        const radios = controls.filter((c): c is HTMLInputElement => c?.type === 'radio');
        const name = radios.find((r) => r.name)?.name ?? `ix-table-${this._instanceId}`;
        radios.forEach((radio) => {
            if (!radio.name) radio.name = name;
        });

        rows.forEach((row, i) => row.toggleAttribute('data-selected', !!controls[i]?.checked));

        const enabled = controls.filter((c, i): c is HTMLInputElement => !!c && !c.disabled && visible[i]);
        const checked = enabled.filter((c) => c.checked).length;
        const selectAll = this._selectAll(table);
        if (selectAll) {
            selectAll.checked = enabled.length > 0 && checked === enabled.length;
            selectAll.indeterminate = checked > 0 && checked < enabled.length;
        }

        const selectedCount = controls.filter((c) => c?.checked).length;
        this.querySelectorAll('[data-selected-count]').forEach((el) => {
            if (el.textContent !== String(selectedCount)) el.textContent = String(selectedCount);
        });
        // Bare når verdien endres: hidden står i observerfilteret.
        this.querySelectorAll<HTMLElement>('.ix-table__selection').forEach((el) => {
            if (el.hidden !== (selectedCount === 0)) el.hidden = selectedCount === 0;
        });
        return deselected;
    }

    private _dispatchSelection(table: HTMLTableElement): void {
        const selected = this._dataRows(table)
            .map((row) => this._rowControl(row))
            .filter((c): c is HTMLInputElement => !!c?.checked)
            .map((c) => c.value);
        this.dispatchEvent(
            new CustomEvent<IxTableSelectionChangeDetail>('selection-change', { bubbles: true, detail: { selected } })
        );
    }

    private _onChange(e: Event): void {
        const table = this._table();
        const target = e.target;
        if (!table || !(target instanceof HTMLInputElement) || !table.contains(target)) return;
        if (!target.closest('.ix-table__control')) return;

        if (target === this._selectAll(table)) {
            this._dataRows(table).forEach((row) => {
                const control = this._rowControl(row);
                if (control && !control.disabled && this._isRowVisible(row)) control.checked = target.checked;
            });
        }
        this._syncSelection(table, this._dataRows(table));
        this._dispatchSelection(table);
        this._announceSelection();
    }

    /**
     * Antallet valgte er en statusmelding (WCAG 4.1.3): checkboxen sier bare
     * «avmerket», ikke at alle radene ble valgt. Teksten leses etter én runde, så
     * React rekker å rendre det nye antallet før vi kopierer det.
     */
    private _announceSelection(): void {
        if (!this.querySelector('[data-field="selected-label"]')) return;
        if (this._announceTimer) clearTimeout(this._announceTimer);
        this._announceTimer = setTimeout(() => {
            this._announceTimer = null;
            const text = this.querySelector('[data-field="selected-label"]')?.textContent?.trim();
            if (text) this._statusElement().textContent = text;
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
        const created = !!hasCandidates && !this.querySelector(':scope > [data-field="status"]');
        const status = hasCandidates ? this._statusElement() : null;
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
