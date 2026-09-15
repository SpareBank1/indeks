/* Table — atferds-modul for kolonnesortering i ix-tabeller.
 *
 * Dette er en atferds-modul, ikke en web component (samme delegerings-mønster som
 * tooltip.ts og modal.ts). Valget er bevisst: sorteringstilstanden ER `aria-sort`
 * på <th>, og et klikk finner alt det trenger via closest() — det finnes ingen
 * instans-tilstand å huske mellom handlinger, som er kriteriet for web component.
 * En web component ville i tillegg ikke kunne ligge inne i tabellen: HTML-parseren
 * foster-parenter ukjente elementer ut av <table>, så <table><ix-noe><tr> faller
 * i stykker.
 *
 * Deklarativt API:
 *   <table class="ix-table" data-ix-sort-client>
 *     <thead><tr>
 *       <th scope="col"><button type="button" data-ix-sort="number">Beløp</button></th>
 *     </tr></thead>
 *     <tbody><tr><td data-sort-value="250.5">250,50 kr</td></tr></tbody>
 *   </table>
 *
 * EIERSKAP TIL RADREKKEFØLGEN — det ikke-åpenbare her. Modulen sykler alltid
 * `aria-sort` og dispatcher `ix-sort`, men flytter rader BARE når tabellen har
 * `data-ix-sort-client`. Grunnen er at React eier <tr>-nodene sine: stokker vi om
 * på dem, matcher ikke React sitt virtuelle tre lenger, og neste re-render kan gi
 * feil rekkefølge. Ren HTML setter derfor attributtet og får sortering gratis,
 * mens React-wrapperen lar være og sorterer egne data på `ix-sort`. I React-modus
 * skriver både modulen og React `aria-sort`; verdiene konvergerer, siden React
 * rendrer samme retning som modulen nettopp satte.
 *
 * Syklusen er toveis (ascending ⇄ descending). En tredje «usortert»-tilstand ville
 * krevd at modulen husket opprinnelig radrekkefølge — nettopp den instans-
 * tilstanden som ville gjort dette til en web component i stedet. */

const ATTR_SORT = 'data-ix-sort';
const ATTR_SORT_KEY = 'data-sort-key';
const ATTR_SORT_CLIENT = 'data-ix-sort-client';
const ATTR_SORT_VALUE = 'data-sort-value';
const ATTR_ASCENDING_TEXT = 'data-ix-sort-ascending-text';
const ATTR_DESCENDING_TEXT = 'data-ix-sort-descending-text';
const LIVE_REGION_ID = 'ix-table-sort-status';

export type SortDirection = 'ascending' | 'descending';

export type IxSortDetail = {
    /** Kolonnens `cellIndex` i overskriftsraden. */
    index: number;
    /** Verdien av `data-sort-key` på knappen, hvis satt. */
    key: string | undefined;
    /** Komparatoren fra `data-ix-sort` — `text`, `number` eller `date`. */
    type: string;
    direction: SortDirection;
};

let collator: Intl.Collator | undefined;
let collatorLocale: string | undefined;

/* Kollasjon må følge dokumentets språk — æ/ø/å sorterer feil med en engelsk
   collator. `numeric` gjør at «sak 10» havner etter «sak 2» i tekstkolonner. */
function getCollator(): Intl.Collator {
    const locale = document.documentElement.lang || 'nb';
    if (!collator || collatorLocale !== locale) {
        collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
        collatorLocale = locale;
    }
    return collator;
}

let liveRegion: HTMLElement | undefined;

/* Ligger på <body>, utenfor et eventuelt React-tre — samme grunn som
   tooltip-panelet: da kan ingen re-render fjerne den under oss. */
function getLiveRegion(): HTMLElement {
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = LIVE_REGION_ID;
        liveRegion.className = 'ix-sr-only';
        liveRegion.setAttribute('role', 'status');
    }
    if (!liveRegion.isConnected) {
        document.body.appendChild(liveRegion);
    }
    return liveRegion;
}

/* Regionen installeres ved første berøring av en sorteringsknapp, ikke i det meldingen
   skal settes. En live-region må ligge i tilgjengelighetstreet FØR innholdet endres,
   ellers rekker ikke skjermleseren å begynne å overvåke den, og den aller første
   sorteringsmeldingen på siden går tapt.
 *
 * Både pointerdown og keydown kommer før click, så regionen er på plass i god tid. Vi
 * gjør det ikke ved import, selv om det ville vært enklere: da får hver side som laster
 * indeks-web en global role=status, og den dukker opp i andres `getByRole('status')` og
 * i skjermleserens regionoversikt på sider som ikke har en tabell i det hele tatt. */
function primeLiveRegion(event: Event): void {
    const target = event.target as Element | null;
    if (target?.closest?.(`[${ATTR_SORT}]`)) getLiveRegion();
}

/* Norsk tallformat: tynt/hardt mellomrom som tusenskille og komma som desimal-
   skille. Punktum tolkes som tusenskille når det også finnes et komma. Formaterte
   tall bør likevel oppgi `data-sort-value` — dette er en høflighet, ikke en
   garanti. */
function toNumber(raw: string): number {
    const cleaned = raw.replace(/\s/g, '').replace(/[^\d,.-]/g, '');
    const normalised = cleaned.includes(',')
        ? cleaned.replace(/\./g, '').replace(',', '.')
        : cleaned;
    return normalised === '' ? Number.NaN : Number(normalised);
}

function toTime(raw: string): number {
    const trimmed = raw.trim();
    const dayFirst = /^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})$/.exec(trimmed);
    if (dayFirst) {
        return Date.UTC(Number(dayFirst[3]), Number(dayFirst[2]) - 1, Number(dayFirst[1]));
    }
    return Date.parse(trimmed);
}

function compareValues(type: string, a: string, b: string): number {
    if (type === 'number') {
        const left = toNumber(a);
        const right = toNumber(b);
        if (!Number.isNaN(left) && !Number.isNaN(right)) return left - right;
    }
    if (type === 'date') {
        const left = toTime(a);
        const right = toTime(b);
        if (!Number.isNaN(left) && !Number.isNaN(right)) return left - right;
    }
    return getCollator().compare(a, b);
}

function cellValue(row: HTMLTableRowElement, index: number): string {
    const cell = row.cells[index];
    if (!cell) return '';
    return cell.getAttribute(ATTR_SORT_VALUE) ?? cell.textContent?.trim() ?? '';
}

function sortRows(table: HTMLTableElement, index: number, type: string, direction: SortDirection): void {
    const factor = direction === 'ascending' ? 1 : -1;
    // Hver <tbody> sorteres for seg slik at gruppering bevares.
    for (const body of Array.from(table.tBodies)) {
        const rows = Array.from(body.rows);
        rows.sort((a, b) => factor * compareValues(type, cellValue(a, index), cellValue(b, index)));
        // append() flytter eksisterende noder, den lager ingen nye.
        body.append(...rows);
    }
}

function announce(table: HTMLTableElement, header: HTMLTableCellElement, direction: SortDirection): void {
    const template = table.getAttribute(
        direction === 'ascending' ? ATTR_ASCENDING_TEXT : ATTR_DESCENDING_TEXT,
    );
    // Ingen hardkodet fallback (i18n) — uten mal er dette en stille no-op.
    if (!template) return;

    const message = template.replace('{column}', header.textContent?.trim() ?? '');
    const region = getLiveRegion();

    /* Skjermlesere annonserer bare når innholdet ENDRER seg. Alle tabeller på siden
       deler denne regionen, så to tabeller med samme kolonnenavn sortert samme vei
       ville gitt identisk tekst og dermed stillhet. Vi tømmer først og setter
       teksten i neste frame, slik at det alltid er en reell endring å annonsere. */
    region.textContent = '';
    requestAnimationFrame(() => {
        region.textContent = message;
    });
}

function handleClick(event: Event): void {
    const target = event.target as Element | null;
    const button = target?.closest?.(`[${ATTR_SORT}]`);
    if (!button) return;

    const header = button.closest('th');
    const table = button.closest('table');
    if (!header || !table) return;

    const direction: SortDirection =
        header.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';

    // Bare én kolonne kan bære aria-sort av gangen.
    for (const other of Array.from(table.querySelectorAll('th[aria-sort]'))) {
        if (other !== header) other.removeAttribute('aria-sort');
    }
    header.setAttribute('aria-sort', direction);

    const index = header.cellIndex;
    const type = button.getAttribute(ATTR_SORT) || 'text';

    if (table.hasAttribute(ATTR_SORT_CLIENT)) {
        sortRows(table as HTMLTableElement, index, type, direction);
    }

    announce(table as HTMLTableElement, header, direction);

    const detail: IxSortDetail = {
        index,
        key: button.getAttribute(ATTR_SORT_KEY) ?? undefined,
        type,
        direction,
    };
    table.dispatchEvent(new CustomEvent<IxSortDetail>('ix-sort', { bubbles: true, detail }));
}

document.addEventListener('pointerdown', primeLiveRegion);
document.addEventListener('keydown', primeLiveRegion);
document.addEventListener('click', handleClick);
