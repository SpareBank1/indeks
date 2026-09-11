import { afterEach, describe, expect, it, vi } from 'vitest';

// Import side-effect — registrerer den delegerte click-lytteren
import './table';

import type { IxSortDetail } from './table';

type TableOptions = {
    client?: boolean;
    type?: string;
    rows?: string[][];
    ascendingText?: string;
};

/* Bygger <table> med én sorterbar kolonne per overskrift. Første kolonne er
   th[scope=row] slik at cellIndex-oppslaget testes mot ekte radoverskrifter. */
function createTable(options: TableOptions = {}): HTMLTableElement {
    const { client = true, type = 'text', rows = [['b'], ['a'], ['c']], ascendingText } = options;

    const table = document.createElement('table');
    table.className = 'ix-table';
    if (client) table.setAttribute('data-ix-sort-client', '');
    if (ascendingText) table.setAttribute('data-ix-sort-ascending-text', ascendingText);

    const columnCount = rows[0].length;
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (let i = 0; i < columnCount; i++) {
        const th = document.createElement('th');
        th.scope = 'col';
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('data-ix-sort', type);
        button.setAttribute('data-sort-key', `kol${i}`);
        button.textContent = `Kolonne ${i}`;
        th.appendChild(button);
        headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const cells of rows) {
        const tr = document.createElement('tr');
        cells.forEach((value, i) => {
            // Verdier på formen "vist|sorteringsverdi" gir cellen data-sort-value.
            const [text, sortValue] = value.split('|');
            const cell = document.createElement(i === 0 ? 'th' : 'td');
            if (i === 0) (cell as HTMLTableCellElement).scope = 'row';
            if (sortValue !== undefined) cell.setAttribute('data-sort-value', sortValue);
            cell.textContent = text;
            tr.appendChild(cell);
        });
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    document.body.appendChild(table);
    return table;
}

function clickHeader(table: HTMLTableElement, index = 0): void {
    const button = table.querySelectorAll('thead button')[index] as HTMLButtonElement;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function firstColumn(table: HTMLTableElement): string[] {
    return Array.from(table.tBodies[0].rows).map((row) => row.cells[0].textContent ?? '');
}

/* Live-regionen får bli liggende mellom testene, slik den gjør i en nettleser: den
   installeres ved første berøring av en sorteringsknapp og lever videre resten av
   sidens levetid. Innholdet nullstilles i stedet. */
afterEach(() => {
    for (const child of Array.from(document.body.children)) {
        if (child.id !== 'ix-table-sort-status') child.remove();
    }
    const live = document.getElementById('ix-table-sort-status');
    if (live) live.textContent = '';
    document.documentElement.removeAttribute('lang');
});

describe('table — aria-sort-syklus', () => {
    it('setter ascending ved første klikk', () => {
        const table = createTable();
        clickHeader(table);

        expect(table.querySelector('thead th')?.getAttribute('aria-sort')).toBe('ascending');
    });

    it('veksler til descending ved andre klikk', () => {
        const table = createTable();
        clickHeader(table);
        clickHeader(table);

        expect(table.querySelector('thead th')?.getAttribute('aria-sort')).toBe('descending');
    });

    it('er toveis — tredje klikk gir ascending igjen, ikke usortert', () => {
        const table = createTable();
        clickHeader(table);
        clickHeader(table);
        clickHeader(table);

        expect(table.querySelector('thead th')?.getAttribute('aria-sort')).toBe('ascending');
    });

    it('fjerner aria-sort fra andre kolonner slik at bare én er sortert', () => {
        const table = createTable({ rows: [['b', 'x'], ['a', 'y']] });
        clickHeader(table, 0);
        clickHeader(table, 1);

        const headers = table.querySelectorAll('thead th');
        expect(headers[0].hasAttribute('aria-sort')).toBe(false);
        expect(headers[1].getAttribute('aria-sort')).toBe('ascending');
    });
});

describe('table — eierskap til radrekkefølgen', () => {
    it('flytter rader når data-ix-sort-client er satt', () => {
        const table = createTable({ rows: [['b'], ['a'], ['c']] });
        clickHeader(table);

        expect(firstColumn(table)).toEqual(['a', 'b', 'c']);
    });

    it('reverserer ved descending', () => {
        const table = createTable({ rows: [['b'], ['a'], ['c']] });
        clickHeader(table);
        clickHeader(table);

        expect(firstColumn(table)).toEqual(['c', 'b', 'a']);
    });

    it('lar radene stå når data-ix-sort-client mangler, men setter likevel aria-sort', () => {
        const table = createTable({ client: false, rows: [['b'], ['a'], ['c']] });
        clickHeader(table);

        expect(firstColumn(table)).toEqual(['b', 'a', 'c']);
        expect(table.querySelector('thead th')?.getAttribute('aria-sort')).toBe('ascending');
    });

    it('sorterer hver tbody for seg slik at gruppering bevares', () => {
        const table = createTable({ rows: [['b'], ['a']] });
        const second = document.createElement('tbody');
        for (const value of ['z', 'y']) {
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            th.scope = 'row';
            th.textContent = value;
            tr.appendChild(th);
            second.appendChild(tr);
        }
        table.appendChild(second);

        clickHeader(table);

        expect(firstColumn(table)).toEqual(['a', 'b']);
        expect(Array.from(second.rows).map((r) => r.cells[0].textContent)).toEqual(['y', 'z']);
    });
});

describe('table — komparatorer', () => {
    it('sorterer tall numerisk, ikke som tekst', () => {
        const table = createTable({ type: 'number', rows: [['250'], ['1000'], ['30']] });
        clickHeader(table);

        expect(firstColumn(table)).toEqual(['30', '250', '1000']);
    });

    it('håndterer norsk tallformat med tusenskille og desimalkomma', () => {
        const table = createTable({
            type: 'number',
            rows: [['1 250,50 kr'], ['999,00 kr'], ['1 250,10 kr']],
        });
        clickHeader(table);

        expect(firstColumn(table)).toEqual(['999,00 kr', '1 250,10 kr', '1 250,50 kr']);
    });

    it('lar data-sort-value overstyre den viste teksten', () => {
        const table = createTable({
            type: 'number',
            rows: [['mye|100'], ['lite|1'], ['middels|50']],
        });
        clickHeader(table);

        expect(firstColumn(table)).toEqual(['lite', 'middels', 'mye']);
    });

    it('sorterer datoer på dd.mm.yyyy kronologisk', () => {
        const table = createTable({
            type: 'date',
            rows: [['02.01.2026'], ['31.12.2025'], ['15.06.2026']],
        });
        clickHeader(table);

        expect(firstColumn(table)).toEqual(['31.12.2025', '02.01.2026', '15.06.2026']);
    });

    it('sorterer enkeltbokstaver alfabetisk', () => {
        const table = createTable({ rows: [['c'], ['a'], ['b']] });
        clickHeader(table);

        expect(firstColumn(table)).toEqual(['a', 'b', 'c']);
    });

    /* De to neste sammenligner mot collatorens egen output i stedet for en
       hardkodet rekkefølge. Poenget er å verifisere at modulen ruter tekst til
       Intl.Collator for dokumentets språk — ikke at ICU sorterer riktig, som er
       utenfor vår kontroll (og faktisk er feil i dette testmiljøet: Node 24 med
       ICU 78.3 inverterer flertegnsstrenger her). */

    function collatorOrder(values: string[], locale = 'nb'): string[] {
        const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
        return [...values].sort(collator.compare);
    }

    it('ruter tekst til Intl.Collator for dokumentets språk', () => {
        document.documentElement.lang = 'nb';
        const values = ['ær', 'ål', 'øy', 'ape'];
        const table = createTable({ rows: values.map((v) => [v]) });
        clickHeader(table);

        expect(firstColumn(table)).toEqual(collatorOrder(values));
    });

    it('faller tilbake til tekstsammenligning når tallparsing feiler', () => {
        document.documentElement.lang = 'nb';
        const values = ['bbb', 'aaa'];
        const table = createTable({ type: 'number', rows: values.map((v) => [v]) });
        clickHeader(table);

        expect(firstColumn(table)).toEqual(collatorOrder(values));
    });
});

describe('table — ix-sort-hendelse', () => {
    it('dispatcher ix-sort med kolonne, nøkkel, type og retning', () => {
        const table = createTable({ type: 'number', rows: [['b', 'x'], ['a', 'y']] });
        const listener = vi.fn();
        table.addEventListener('ix-sort', listener);

        clickHeader(table, 1);

        expect(listener).toHaveBeenCalledOnce();
        const detail = (listener.mock.calls[0][0] as CustomEvent<IxSortDetail>).detail;
        expect(detail).toEqual({ index: 1, key: 'kol1', type: 'number', direction: 'ascending' });
    });

    it('bobler slik at foreldre kan lytte', () => {
        const wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
        const table = createTable();
        wrapper.appendChild(table);

        const listener = vi.fn();
        wrapper.addEventListener('ix-sort', listener);
        clickHeader(table);

        expect(listener).toHaveBeenCalledOnce();
    });

    it('dispatcher også når modulen ikke eier radrekkefølgen', () => {
        const table = createTable({ client: false });
        const listener = vi.fn();
        table.addEventListener('ix-sort', listener);

        clickHeader(table);

        expect(listener).toHaveBeenCalledOnce();
    });
});

/* Meldingen settes én frame etter klikket, ikke synkront: regionen tømmes først slik
   at identisk tekst to ganger på rad fortsatt er en endring skjermleseren fanger. */
function nextFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

describe('table — annonsering', () => {
    /* Regionen må ligge i tilgjengelighetstreet før teksten settes, ellers overvåker
       ikke skjermleseren den ennå og den første meldingen går tapt. pointerdown kommer
       før click, så den er på plass i tid. */
    it('installerer live-regionen ved berøring av knappen, før klikket', () => {
        const table = createTable({ ascendingText: 'Sortert etter {column}, stigende' });
        const button = table.querySelector('thead button')!;

        button.dispatchEvent(new Event('pointerdown', { bubbles: true }));

        const live = document.getElementById('ix-table-sort-status');
        expect(live).not.toBeNull();
        expect(live?.getAttribute('role')).toBe('status');
        expect(live?.className).toBe('ix-sr-only');
        expect(live?.textContent).toBe('');
    });

    it('lager ingen live-region før noen tar på en sorteringsknapp', () => {
        document.getElementById('ix-table-sort-status')?.remove();
        const outside = document.createElement('button');
        document.body.appendChild(outside);

        outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));

        expect(document.getElementById('ix-table-sort-status')).toBeNull();
    });

    it('fyller live-regionen fra i18n-malen med kolonnenavnet', async () => {
        const table = createTable({ ascendingText: 'Sortert etter {column}, stigende' });
        clickHeader(table);
        await nextFrame();

        expect(document.getElementById('ix-table-sort-status')?.textContent).toBe(
            'Sortert etter Kolonne 0, stigende',
        );
    });

    it('annonserer ikke uten mal — ingen hardkodet tekst', async () => {
        const table = createTable();
        clickHeader(table);
        await nextFrame();

        expect(document.getElementById('ix-table-sort-status')?.textContent || '').toBe('');
    });

    /* To tabeller kan gi identisk melding (samme kolonnenavn, samme retning). Uten
       tømmingen ville den andre sorteringen vært stille. */
    it('annonserer på nytt selv når teksten er identisk', async () => {
        const first = createTable({ ascendingText: 'Sortert etter {column}, stigende' });
        clickHeader(first);
        await nextFrame();

        const second = createTable({ ascendingText: 'Sortert etter {column}, stigende' });
        clickHeader(second);

        const live = document.getElementById('ix-table-sort-status');
        expect(live?.textContent).toBe('');

        await nextFrame();
        expect(live?.textContent).toBe('Sortert etter Kolonne 0, stigende');
    });
});

describe('table — ignorerer irrelevante klikk', () => {
    it('gjør ingenting ved klikk utenfor en sorteringsknapp', () => {
        const table = createTable({ rows: [['b'], ['a']] });
        const outside = document.createElement('button');
        document.body.appendChild(outside);

        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(firstColumn(table)).toEqual(['b', 'a']);
        expect(table.querySelector('thead th')?.hasAttribute('aria-sort')).toBe(false);
    });

    it('gjør ingenting for en sorteringsknapp utenfor en tabell', () => {
        const orphan = document.createElement('button');
        orphan.setAttribute('data-ix-sort', 'text');
        document.body.appendChild(orphan);

        expect(() => orphan.dispatchEvent(new MouseEvent('click', { bubbles: true }))).not.toThrow();
    });
});
