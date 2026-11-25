import { afterEach, describe, expect, it, vi } from 'vitest';
import { IxTable } from './IxTable';

if (!customElements.get('ix-table')) {
    customElements.define('ix-table', IxTable);
}

function mount(html: string): IxTable {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    return wrapper.querySelector('ix-table')!;
}

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

function bodyTexts(el: HTMLElement, column = 0): string[] {
    return Array.from(el.querySelectorAll('tbody tr:not(.ix-table__expanded)')).map((row) =>
        (row as HTMLTableRowElement).cells[column].textContent!.trim()
    );
}

const SORTABLE = `
    <ix-table class="ix-table">
        <div class="ix-table__scroll">
            <table aria-label="Betalinger">
                <thead><tr>
                    <th scope="col"><button type="button" class="ix-table__sort">Mottaker</button></th>
                    <th scope="col" data-sort-key="dato"><button type="button" class="ix-table__sort">Dato</button></th>
                    <th scope="col" data-align="end"><button type="button" class="ix-table__sort">Beløp</button></th>
                </tr></thead>
                <tbody>
                    <tr><td>Kafé Torget</td><td>04.11.2026</td><td>-89,00</td></tr>
                    <tr><td>Matbutikken</td><td>06.11.2026</td><td>-684,50</td></tr>
                    <tr><td>Strømleverandør</td><td>05.11.2026</td><td>-1 245,00</td></tr>
                </tbody>
            </table>
        </div>
    </ix-table>
`;

const MULTI = `
    <ix-table class="ix-table">
        <div class="ix-table__selection" hidden><span data-selected-count></span> valgt</div>
        <table aria-label="Regninger">
            <thead><tr>
                <th class="ix-table__control"><div class="ix-checkbox"><input type="checkbox" id="all"><label for="all">Velg alle</label></div></th>
                <th>Mottaker</th>
            </tr></thead>
            <tbody>
                <tr><td class="ix-table__control"><div class="ix-checkbox"><input type="checkbox" id="a" value="a"><label for="a">Velg A</label></div></td><td>A <a href="#">Detaljer</a></td></tr>
                <tr><td class="ix-table__control"><div class="ix-checkbox"><input type="checkbox" id="b" value="b"><label for="b">Velg B</label></div></td><td>B</td></tr>
                <tr><td class="ix-table__control"><div class="ix-checkbox"><input type="checkbox" id="c" value="c"><label for="c">Velg C</label></div></td><td>C</td></tr>
            </tbody>
        </table>
    </ix-table>
`;

const EXPANDABLE = `
    <ix-table class="ix-table">
        <table aria-label="Lån">
            <thead><tr><th class="ix-table__control"></th><th><button type="button" class="ix-table__sort">Lån</button></th><th>Rente</th></tr></thead>
            <tbody>
                <tr><td class="ix-table__control"><button type="button" class="ix-table__expand" aria-label="Vis detaljer for Billån"></button></td><td>Billån</td><td>7,25 %</td></tr>
                <tr class="ix-table__expanded"><td>Billån-detaljer</td></tr>
                <tr><td class="ix-table__control"><button type="button" class="ix-table__expand" aria-label="Vis detaljer for Boliglån"></button></td><td>Boliglån</td><td>5,49 %</td></tr>
                <tr class="ix-table__expanded"><td>Boliglån-detaljer</td></tr>
            </tbody>
        </table>
    </ix-table>
`;

afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

describe('IxTable struktur', () => {
    it('arver data-align fra kolonnens th som data-column-align', () => {
        const el = mount(SORTABLE);
        const cells = Array.from(el.querySelectorAll('tbody tr')).map((r) => (r as HTMLTableRowElement).cells[2]);
        expect(cells.every((c) => c.getAttribute('data-column-align') === 'end')).toBe(true);
        expect(cells.every((c) => !c.hasAttribute('data-align'))).toBe(true);
        expect((el.querySelector('tbody tr') as HTMLTableRowElement).cells[0].hasAttribute('data-column-align')).toBe(
            false
        );
    });

    it('beholder data-align som cellen har satt selv', () => {
        const el = mount(SORTABLE.replace('<td>-89,00</td>', '<td data-align="start">-89,00</td>'));
        expect(el.querySelector('tbody tr')!.querySelector('td:last-child')!.getAttribute('data-align')).toBe('start');
    });

    it('setter colspan på rader som spenner over hele bredden, men ikke over egen colspan', () => {
        const el = mount(`
            <ix-table><table aria-label="T">
                <thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
                <tbody>
                    <tr class="ix-table__empty"><td><p>Ingen treff</p></td></tr>
                    <tr class="ix-table__loading"><td colspan="2">Laster</td></tr>
                </tbody>
            </table></ix-table>
        `);
        expect((el.querySelector('.ix-table__empty td') as HTMLTableCellElement).colSpan).toBe(3);
        expect((el.querySelector('.ix-table__loading td') as HTMLTableCellElement).colSpan).toBe(2);
    });

    it('markerer bare rader med kontroll som interaktive', () => {
        const multi = mount(MULTI);
        expect(multi.querySelectorAll('tbody tr[data-interactive]')).toHaveLength(3);
        document.body.innerHTML = '';
        const basic = mount(SORTABLE);
        expect(basic.querySelectorAll('tbody tr[data-interactive]')).toHaveLength(0);
    });
});

describe('IxTable sortering', () => {
    it('legger inn alle tre ikonene med en gang, så CSS kan vise riktig uten ny henting', () => {
        const el = mount(SORTABLE);
        const wrapper = el.querySelector('th .ix-table__sort > .ix-table__sort-icon')!;
        expect(wrapper.getAttribute('aria-hidden')).toBe('true');
        expect(
            [...wrapper.querySelectorAll('ix-icon')].map((i) => [
                i.getAttribute('data-sort-icon'),
                i.getAttribute('name'),
            ])
        ).toEqual([
            ['none', 'swap_vert'],
            ['ascending', 'arrow_upward'],
            ['descending', 'arrow_downward'],
        ]);
    });

    it('går ingen → stigende → synkende → ingen, uten å legge til flere ikoner', () => {
        const el = mount(SORTABLE);
        const th = el.querySelector('th')!;
        const button = th.querySelector('button')!;

        button.click();
        expect(th.getAttribute('aria-sort')).toBe('ascending');
        expect(bodyTexts(el)).toEqual(['Kafé Torget', 'Matbutikken', 'Strømleverandør']);

        button.click();
        expect(th.getAttribute('aria-sort')).toBe('descending');
        expect(bodyTexts(el)).toEqual(['Strømleverandør', 'Matbutikken', 'Kafé Torget']);

        button.click();
        expect(th.hasAttribute('aria-sort')).toBe(false);
        expect(button.querySelectorAll('.ix-table__sort-icon')).toHaveLength(1);
        expect(button.querySelectorAll('ix-icon')).toHaveLength(3);
    });

    it('har aria-sort bare på kolonnen som er sortert', () => {
        const el = mount(SORTABLE);
        const [first, second] = Array.from(el.querySelectorAll('th'));
        first.querySelector('button')!.click();
        second.querySelector('button')!.click();
        expect(first.hasAttribute('aria-sort')).toBe(false);
        expect(second.getAttribute('aria-sort')).toBe('ascending');
    });

    it('sorterer norske datoer og tall som tall, og «ingen» gir opprinnelig rekkefølge', () => {
        const el = mount(SORTABLE);
        const [, date, amount] = Array.from(el.querySelectorAll<HTMLButtonElement>('.ix-table__sort'));
        date.click();
        expect(bodyTexts(el, 1)).toEqual(['04.11.2026', '05.11.2026', '06.11.2026']);
        amount.click();
        expect(bodyTexts(el, 2)).toEqual(['-1 245,00', '-684,50', '-89,00']);
        amount.click();
        amount.click();
        expect(bodyTexts(el)).toEqual(['Kafé Torget', 'Matbutikken', 'Strømleverandør']);
    });

    it('bruker data-sort-value foran celleteksten', () => {
        const el = mount(SORTABLE.replace('<td>Kafé Torget</td>', '<td data-sort-value="Å">Kafé Torget</td>'));
        el.querySelector<HTMLButtonElement>('.ix-table__sort')!.click();
        expect(bodyTexts(el)).toEqual(['Matbutikken', 'Strømleverandør', 'Kafé Torget']);
    });

    it('sender sort-change med kolonne, nøkkel og retning', () => {
        const el = mount(SORTABLE);
        const handler = vi.fn();
        el.addEventListener('sort-change', handler);
        el.querySelectorAll<HTMLButtonElement>('.ix-table__sort')[1].click();
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].detail).toEqual({ column: 1, key: 'dato', direction: 'ascending' });
    });

    it('leser opp sorteringen etter at den har endret seg', async () => {
        const el = mount(
            SORTABLE.replace(
                '<ix-table class="ix-table">',
                '<ix-table class="ix-table" sort-ascending-label="Sortert etter {column}, stigende" sort-descending-label="Sortert etter {column}, synkende" sort-none-label="Sortering fjernet">'
            )
        );
        const button = el.querySelector<HTMLButtonElement>('.ix-table__sort')!;
        const status = () => el.querySelector('[data-field="status"]')!.textContent;
        button.click();
        await flush();
        expect(status()).toBe('Sortert etter Mottaker, stigende');
        button.click();
        await flush();
        expect(status()).toBe('Sortert etter Mottaker, synkende');
        button.click();
        await flush();
        expect(status()).toBe('Sortering fjernet');
    });

    it('venter med opplesningen til eieren har satt aria-sort med data-sort-controlled', async () => {
        const el = mount(
            SORTABLE.replace(
                '<ix-table class="ix-table">',
                '<ix-table class="ix-table" data-sort-controlled sort-ascending-label="Sortert etter {column}, stigende" sort-none-label="Sortering fjernet">'
            )
        );
        const th = el.querySelectorAll('th')[1];
        th.querySelector<HTMLButtonElement>('.ix-table__sort')!.click();
        await flush();
        expect(el.querySelector('[data-field="status"]')?.textContent ?? '').toBe('');

        th.setAttribute('aria-sort', 'ascending');
        await flush();
        await flush();
        expect(el.querySelector('[data-field="status"]')!.textContent).toBe('Sortert etter Dato, stigende');
    });

    it('advarer når sorterbare kolonner mangler tekstene for opplesning', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mount(SORTABLE);
        expect(warn.mock.calls.filter(([m]) => String(m).includes('sort-ascending-label'))).toHaveLength(1);
    });

    it('sender sort-change etter at den har sortert selv', () => {
        const el = mount(SORTABLE);
        const handler = vi.fn();
        el.addEventListener('sort-change', (e) => handler((e as CustomEvent).detail, bodyTexts(el)));
        el.querySelector<HTMLButtonElement>('.ix-table__sort')!.click();
        expect(handler).toHaveBeenCalledWith({ column: 0, key: null, direction: 'ascending' }, [
            'Kafé Torget',
            'Matbutikken',
            'Strømleverandør',
        ]);
    });

    it('sender bare sort-request med data-sort-controlled, uten å røre aria-sort eller radene', () => {
        const el = mount(
            SORTABLE.replace('<ix-table class="ix-table">', '<ix-table class="ix-table" data-sort-controlled>')
        );
        const request = vi.fn();
        const change = vi.fn();
        el.addEventListener('sort-request', (e) => request((e as CustomEvent).detail));
        el.addEventListener('sort-change', change);
        el.querySelectorAll<HTMLButtonElement>('.ix-table__sort')[1].click();
        expect(request).toHaveBeenCalledWith({ column: 1, key: 'dato', direction: 'ascending' });
        expect(change).not.toHaveBeenCalled();
        expect(el.querySelectorAll('th')[1].hasAttribute('aria-sort')).toBe(false);
        expect(bodyTexts(el)).toEqual(['Kafé Torget', 'Matbutikken', 'Strømleverandør']);

        // Eieren setter aria-sort, og neste klikk ber om neste retning.
        el.querySelectorAll('th')[1].setAttribute('aria-sort', 'ascending');
        el.querySelectorAll<HTMLButtonElement>('.ix-table__sort')[1].click();
        expect(request).toHaveBeenLastCalledWith({ column: 1, key: 'dato', direction: 'descending' });
    });

    it('følger aria-sort som settes utenfra (kontrollert)', async () => {
        const el = mount(SORTABLE);
        const th = el.querySelectorAll('th')[1];
        th.setAttribute('aria-sort', 'descending');
        await flush();
        expect(th.getAttribute('aria-sort')).toBe('descending');
        expect(th.querySelectorAll('ix-icon')).toHaveLength(3);
    });

    function sortedColumn(values: string[]): string[] {
        const el = mount(`
            <ix-table><table aria-label="T">
                <thead><tr><th><button type="button" class="ix-table__sort">Verdi</button></th></tr></thead>
                <tbody>${values.map((v) => `<tr><td>${v}</td></tr>`).join('')}</tbody>
            </table></ix-table>
        `);
        el.querySelector<HTMLButtonElement>('.ix-table__sort')!.click();
        return bodyTexts(el);
    }

    it('sorterer beløp med fortegn og valuta som tall', () => {
        expect(sortedColumn(['+1 200,00', '+500,00', '−50', '25 kr', 'kr 1 245', '999 NOK', '300,-'])).toEqual([
            '−50',
            '25 kr',
            '300,-',
            '+500,00',
            '999 NOK',
            '+1 200,00',
            'kr 1 245',
        ]);
    });

    it('sorterer dato med klokkeslett på dato og så tid', () => {
        expect(
            sortedColumn(['12.10.2026 14:30', '1.11.2026 08:00', '12.10.2026 09:15', '9.10.2026, kl. 23.59'])
        ).toEqual(['9.10.2026, kl. 23.59', '12.10.2026 09:15', '12.10.2026 14:30', '1.11.2026 08:00']);
    });

    it('legger tall før tekst og tomme celler sist, i begge retninger', () => {
        const el = mount(`
            <ix-table><table aria-label="T">
                <thead><tr><th><button type="button" class="ix-table__sort">Verdi</button></th></tr></thead>
                <tbody>${['Ukjent', '', '20', 'Avtale', '3'].map((v) => `<tr><td>${v}</td></tr>`).join('')}</tbody>
            </table></ix-table>
        `);
        const button = el.querySelector<HTMLButtonElement>('.ix-table__sort')!;
        button.click();
        expect(bodyTexts(el)).toEqual(['3', '20', 'Avtale', 'Ukjent', '']);
        button.click();
        expect(bodyTexts(el)).toEqual(['20', '3', 'Ukjent', 'Avtale', '']);
    });

    it('regner «–» som tom celle, sist i begge retninger', () => {
        const el = mount(`
            <ix-table><table aria-label="T">
                <thead><tr><th><button type="button" class="ix-table__sort">Beløp</button></th></tr></thead>
                <tbody>${['–', '200', '—', '50'].map((v) => `<tr><td>${v}</td></tr>`).join('')}</tbody>
            </table></ix-table>
        `);
        const button = el.querySelector<HTMLButtonElement>('.ix-table__sort')!;
        button.click();
        expect(bodyTexts(el)).toEqual(['50', '200', '–', '—']);
        button.click();
        expect(bodyTexts(el)).toEqual(['200', '50', '–', '—']);
    });

    it('leser punktum som tusenskille når det står foran grupper på tre sifre', () => {
        expect(sortedColumn(['1.250', '999', '1.250,50', '1.5', '12.000.000'])).toEqual([
            '1.5',
            '999',
            '1.250',
            '1.250,50',
            '12.000.000',
        ]);
    });

    it('sorterer ISO-datoer som datoer, også blandet med norske', () => {
        expect(sortedColumn(['2026-11-25', '01.11.2026', '2026-11-25T08:00', '2026-10-03'])).toEqual([
            '2026-10-03',
            '01.11.2026',
            '2026-11-25',
            '2026-11-25T08:00',
        ]);
    });

    it('regner en rad som er lagt til uten sortering, med i den opprinnelige rekkefølgen', async () => {
        const el = mount(SORTABLE);
        const tbody = el.querySelector('tbody')!;
        tbody.insertAdjacentHTML('afterbegin', '<tr><td>Apotek</td><td>01.11.2026</td><td>-120,00</td></tr>');
        await flush();
        const button = el.querySelector<HTMLButtonElement>('.ix-table__sort')!;
        button.click();
        button.click();
        button.click();
        expect(bodyTexts(el)).toEqual(['Apotek', 'Kafé Torget', 'Matbutikken', 'Strømleverandør']);
    });

    it('sorterer inn en rad som legges til mens kolonnen er sortert', async () => {
        const el = mount(SORTABLE);
        const button = el.querySelector<HTMLButtonElement>('.ix-table__sort')!;
        button.click();
        button.click();
        expect(bodyTexts(el)).toEqual(['Strømleverandør', 'Matbutikken', 'Kafé Torget']);

        el.querySelector('tbody')!.insertAdjacentHTML(
            'beforeend',
            '<tr><td>Nettbutikk</td><td>02.11.2026</td><td>-10,00</td></tr>'
        );
        await flush();
        expect(bodyTexts(el)).toEqual(['Strømleverandør', 'Nettbutikk', 'Matbutikken', 'Kafé Torget']);

        button.click();
        expect(bodyTexts(el)).toEqual(['Kafé Torget', 'Matbutikken', 'Strømleverandør', 'Nettbutikk']);
    });

    it('finner riktig kolonne når en overskrift har colspan', () => {
        const el = mount(`
            <ix-table><table aria-label="T">
                <thead><tr>
                    <th colspan="2">Navn</th>
                    <th data-align="end"><button type="button" class="ix-table__sort">Beløp</button></th>
                </tr></thead>
                <tbody>
                    <tr><td>Kari</td><td>Nordmann</td><td>30</td></tr>
                    <tr><td>Ola</td><td>Hansen</td><td>4</td></tr>
                    <tr><td>Per</td><td>Berg</td><td>100</td></tr>
                </tbody>
            </table></ix-table>
        `);
        const handler = vi.fn();
        el.addEventListener('sort-change', handler);
        el.querySelector<HTMLButtonElement>('.ix-table__sort')!.click();
        expect(handler.mock.calls[0][0].detail.column).toBe(2);
        expect(bodyTexts(el, 2)).toEqual(['4', '30', '100']);
        const firstRow = el.querySelector('tbody tr')!;
        expect(firstRow.children[1].hasAttribute('data-column-align')).toBe(false);
        expect(firstRow.children[2].getAttribute('data-column-align')).toBe('end');
    });

    it('tar med innholdet til en ekspanderbar rad som legges til mens kolonnen er sortert', async () => {
        const el = mount(EXPANDABLE);
        const sort = el.querySelector<HTMLButtonElement>('.ix-table__sort')!;
        sort.click();
        el.querySelector('tbody')!.insertAdjacentHTML(
            'beforeend',
            '<tr><td class="ix-table__control"><button type="button" class="ix-table__expand" aria-label="Vis detaljer for Annet lån"></button></td><td>Annet lån</td><td>6,10 %</td></tr>' +
                '<tr class="ix-table__expanded"><td>Annet-detaljer</td></tr>'
        );
        await flush();
        const rows = Array.from(el.querySelectorAll<HTMLTableRowElement>('tbody tr')).map((r) =>
            (r.matches('.ix-table__expanded') ? r.cells[0] : r.cells[1]).textContent!.trim()
        );
        expect(rows).toEqual([
            'Annet lån',
            'Annet-detaljer',
            'Billån',
            'Billån-detaljer',
            'Boliglån',
            'Boliglån-detaljer',
        ]);
        const button = el.querySelector<HTMLButtonElement>('[aria-label="Vis detaljer for Annet lån"]')!;
        expect(button.getAttribute('aria-controls')).toBe(el.querySelectorAll('.ix-table__expanded')[0].id);
    });

    it('tar det ekspanderte innholdet med når radene sorteres', () => {
        const el = mount(EXPANDABLE);
        el.querySelector<HTMLButtonElement>('.ix-table__sort')!.click();
        el.querySelector<HTMLButtonElement>('.ix-table__sort')!.click();
        const texts = Array.from(el.querySelectorAll('tbody tr')).map((r) => r.textContent!.trim());
        expect(texts).toEqual(['Boliglån5,49 %', 'Boliglån-detaljer', 'Billån7,25 %', 'Billån-detaljer']);
    });
});

describe('IxTable valg', () => {
    it('velger bare synlige rader med «velg alle», og teller bare dem', () => {
        const el = mount(MULTI);
        const handler = vi.fn();
        el.addEventListener('selection-change', handler);
        el.querySelector<HTMLTableRowElement>('#b')!.closest('tr')!.hidden = true;
        el.refresh();

        const all = el.querySelector<HTMLInputElement>('#all')!;
        all.click();
        expect(el.querySelector<HTMLInputElement>('#b')!.checked).toBe(false);
        expect(all.checked).toBe(true);
        expect(all.indeterminate).toBe(false);
        expect(el.querySelector('[data-selected-count]')!.textContent).toBe('2');
        expect(handler.mock.calls.at(-1)![0].detail).toEqual({ selected: ['a', 'c'] });
    });

    it('beholder valget når en valgt rad skjules, og teller den med', async () => {
        const el = mount(MULTI);
        const handler = vi.fn();
        el.addEventListener('selection-change', handler);
        const a = el.querySelector<HTMLInputElement>('#a')!;
        a.click();
        el.querySelector<HTMLInputElement>('#c')!.click();
        handler.mockClear();

        a.closest('tr')!.hidden = true;
        await flush();
        expect(a.checked).toBe(true);
        expect(el.querySelector('[data-selected-count]')!.textContent).toBe('2');
        expect(handler).not.toHaveBeenCalled();
        // «Velg alle» gjelder radene som vises: C er valgt, B ikke.
        expect(el.querySelector<HTMLInputElement>('#all')!.indeterminate).toBe(true);
    });

    it('husker valget for en rad som fjernes og kommer tilbake, som ved bytte av side', async () => {
        const el = mount(MULTI);
        const tbody = el.querySelector('tbody')!;
        el.querySelector<HTMLInputElement>('#b')!.click();
        const row = el.querySelector('#b')!.closest('tr')!;
        row.remove();
        await flush();
        expect(el.selection).toEqual(['b']);
        expect(el.querySelector('[data-selected-count]')!.textContent).toBe('1');

        // Samme rad rendres på nytt, uten avkrysning i markupen.
        tbody.insertAdjacentHTML(
            'beforeend',
            '<tr><td class="ix-table__control"><div class="ix-checkbox"><input type="checkbox" id="b2" value="b"><label for="b2">Velg B</label></div></td><td>B</td></tr>'
        );
        await flush();
        expect(el.querySelector<HTMLInputElement>('#b2')!.checked).toBe(true);
    });

    it('setter og tømmer utvalget fra koden uten selection-change', () => {
        const el = mount(MULTI);
        const handler = vi.fn();
        el.addEventListener('selection-change', handler);
        el.setSelection(['a', 'c', 'finnes-ikke']);
        expect(el.querySelector<HTMLInputElement>('#a')!.checked).toBe(true);
        expect(el.querySelector<HTMLInputElement>('#b')!.checked).toBe(false);
        expect(el.querySelector('[data-selected-count]')!.textContent).toBe('3');
        expect(el.selection).toEqual(['a', 'c', 'finnes-ikke']);

        el.clearSelection();
        expect(el.querySelectorAll('tbody input:checked')).toHaveLength(0);
        expect(el.querySelector<HTMLElement>('.ix-table__selection')!.hidden).toBe(true);
        expect(handler).not.toHaveBeenCalled();
    });

    it('lar «velg alle» stå for rader som ikke vises', () => {
        const el = mount(MULTI);
        el.setSelection(['x']);
        el.querySelector<HTMLInputElement>('#all')!.click();
        expect(el.selection).toEqual(['x', 'a', 'b', 'c']);
        el.querySelector<HTMLInputElement>('#all')!.click();
        expect(el.selection).toEqual(['x']);
    });

    it('sender ikke selection-change når en rad uten valg skjules', async () => {
        const el = mount(MULTI);
        const handler = vi.fn();
        el.addEventListener('selection-change', handler);
        el.querySelector('#b')!.closest('tr')!.hidden = true;
        await flush();
        expect(handler).not.toHaveBeenCalled();
    });

    it('speiler valgt kontroll som data-selected og teller antallet', () => {
        const el = mount(MULTI);
        el.querySelector<HTMLInputElement>('#b')!.click();
        expect(el.querySelectorAll('tbody tr')[1].hasAttribute('data-selected')).toBe(true);
        expect(el.querySelector('[data-selected-count]')!.textContent).toBe('1');
        expect(el.querySelector<HTMLElement>('.ix-table__selection')!.hidden).toBe(false);
    });

    it('viser indeterminate i headeren når noen, men ikke alle, er valgt', () => {
        const el = mount(MULTI);
        const all = el.querySelector<HTMLInputElement>('#all')!;
        el.querySelector<HTMLInputElement>('#a')!.click();
        expect(all.indeterminate).toBe(true);
        expect(all.checked).toBe(false);
        el.querySelector<HTMLInputElement>('#b')!.click();
        el.querySelector<HTMLInputElement>('#c')!.click();
        expect(all.indeterminate).toBe(false);
        expect(all.checked).toBe(true);
    });

    it('velger og opphever alle fra headeren, men ikke disabled rader', () => {
        const el = mount(MULTI.replace('id="c" value="c"', 'id="c" value="c" disabled'));
        const handler = vi.fn();
        el.addEventListener('selection-change', handler);
        const all = el.querySelector<HTMLInputElement>('#all')!;

        all.click();
        expect(el.querySelectorAll('tbody tr[data-selected]')).toHaveLength(2);
        expect(el.querySelector<HTMLInputElement>('#c')!.checked).toBe(false);
        expect(all.checked).toBe(true);
        expect(handler.mock.calls[0][0].detail).toEqual({ selected: ['a', 'b'] });

        all.click();
        expect(el.querySelectorAll('tbody tr[data-selected]')).toHaveLength(0);
        expect(el.querySelector<HTMLElement>('.ix-table__selection')!.hidden).toBe(true);
    });

    it('gir radioene felles name, og beholder name som er satt', () => {
        const el = mount(`
            <ix-table><table aria-label="Konto">
                <tbody>
                    <tr><td class="ix-table__control"><input type="radio" aria-label="Velg brukskonto" value="1"></td><td>Brukskonto</td></tr>
                    <tr><td class="ix-table__control"><input type="radio" aria-label="Velg sparekonto" value="2"></td><td>Sparekonto</td></tr>
                </tbody>
            </table></ix-table>
        `);
        const radios = Array.from(el.querySelectorAll<HTMLInputElement>('input'));
        expect(radios[0].name).toBeTruthy();
        expect(radios[0].name).toBe(radios[1].name);

        radios[0].click();
        radios[1].click();
        expect(Array.from(el.querySelectorAll('tbody tr')).map((r) => r.hasAttribute('data-selected'))).toEqual([
            false,
            true,
        ]);

        document.body.innerHTML = '';
        const named = mount(`
            <ix-table><table aria-label="Konto"><tbody>
                <tr><td class="ix-table__control"><input type="radio" name="konto" aria-label="Velg"></td><td>A</td></tr>
            </tbody></table></ix-table>
        `);
        expect(named.querySelector<HTMLInputElement>('input')!.name).toBe('konto');
    });

    it('tar med rader som er avkrysset i markupen når de dukker opp', () => {
        const el = mount(MULTI.replace('id="a" value="a"', 'id="a" value="a" checked'));
        expect(el.selection).toEqual(['a']);
        expect(el.querySelectorAll('tbody tr')[0].hasAttribute('data-selected')).toBe(true);
        expect(el.querySelector<HTMLInputElement>('#all')!.indeterminate).toBe(true);
    });

    it('lar én radio erstatte den andre, også fra koden', () => {
        const el = mount(`
            <ix-table><table aria-label="Konto"><tbody>
                <tr><td class="ix-table__control"><input type="radio" id="r1" value="bruk" aria-label="Velg bruk"></td><td>Bruk</td></tr>
                <tr><td class="ix-table__control"><input type="radio" id="r2" value="spare" aria-label="Velg spare"></td><td>Spare</td></tr>
            </tbody></table></ix-table>
        `);
        el.querySelector<HTMLInputElement>('#r1')!.click();
        el.querySelector<HTMLInputElement>('#r2')!.click();
        expect(el.selection).toEqual(['spare']);
        el.setSelection(['bruk', 'spare']);
        expect(el.selection).toEqual(['bruk']);
        expect(el.querySelector<HTMLInputElement>('#r1')!.checked).toBe(true);
    });
});

describe('IxTable radklikk', () => {
    it('aktiverer kontrollen når raden klikkes', () => {
        const el = mount(MULTI);
        (el.querySelectorAll('tbody tr')[1] as HTMLTableRowElement).cells[1].click();
        expect(el.querySelector<HTMLInputElement>('#b')!.checked).toBe(true);
    });

    it('aktiverer ikke raden når klikket kommer fra en lenke i raden', () => {
        const el = mount(MULTI);
        el.querySelector<HTMLAnchorElement>('tbody a')!.click();
        expect(el.querySelector<HTMLInputElement>('#a')!.checked).toBe(false);
    });

    it('aktiverer ikke raden mens brukeren markerer tekst', () => {
        const el = mount(MULTI);
        vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => 'B' } as Selection);
        (el.querySelectorAll('tbody tr')[1] as HTMLTableRowElement).cells[1].click();
        expect(el.querySelector<HTMLInputElement>('#b')!.checked).toBe(false);
    });

    it('ekspanderer når en ekspanderbar rad klikkes', () => {
        const el = mount(EXPANDABLE);
        (el.querySelector('tbody tr') as HTMLTableRowElement).cells[1].click();
        expect(el.querySelector('.ix-table__expand')!.getAttribute('aria-expanded')).toBe('true');
    });
});

describe('IxTable ekspandering', () => {
    it('kobler knappen til raden rett etter og skjuler den', () => {
        const el = mount(EXPANDABLE);
        const button = el.querySelector('.ix-table__expand')!;
        const content = el.querySelector<HTMLTableRowElement>('.ix-table__expanded')!;
        expect(button.getAttribute('aria-controls')).toBe(content.id);
        expect(button.getAttribute('aria-expanded')).toBe('false');
        expect(content.hidden).toBe(true);
        expect((content.cells[0] as HTMLTableCellElement).colSpan).toBe(3);
    });

    it('veksler aria-expanded og hidden, og sender expand-change', () => {
        const el = mount(EXPANDABLE);
        const handler = vi.fn();
        el.addEventListener('expand-change', handler);
        const button = el.querySelector<HTMLButtonElement>('.ix-table__expand')!;
        const row = button.closest('tr')!;
        const content = el.querySelector<HTMLTableRowElement>('.ix-table__expanded')!;

        button.click();
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(content.hidden).toBe(false);
        expect(handler.mock.calls[0][0].detail).toEqual({ row, expanded: true });

        button.click();
        expect(content.hidden).toBe(true);
    });

    it('setter data-animate bare mens en rad åpnes, etter at stilen er beregnet', () => {
        const el = mount(EXPANDABLE);
        const button = el.querySelector<HTMLButtonElement>('.ix-table__expand')!;
        const content = el.querySelector<HTMLTableRowElement>('.ix-table__expanded')!;
        const seen: boolean[] = [];
        content.getAnimations = vi.fn(() => {
            seen.push(content.hasAttribute('data-animate') && !content.hidden);
            return [];
        });

        button.click();
        expect(seen).toEqual([true]);
        expect(content.hasAttribute('data-animate')).toBe(false);

        button.click();
        expect(seen).toEqual([true]);
    });

    it('animerer ikke åpne rader som flyttes ved sortering', () => {
        const el = mount(EXPANDABLE);
        const contents = el.querySelectorAll<HTMLTableRowElement>('.ix-table__expanded');
        el.querySelector<HTMLButtonElement>('.ix-table__expand')!.click();
        const spies = [...contents].map((row) => (row.getAnimations = vi.fn(() => [])));

        el.querySelector<HTMLButtonElement>('.ix-table__sort')!.click();
        expect(spies.every((spy) => spy.mock.calls.length === 0)).toBe(true);
    });

    it('skjuler innholdet når raden filtreres bort, og viser det igjen når raden kommer tilbake', async () => {
        const el = mount(EXPANDABLE);
        const button = el.querySelector<HTMLButtonElement>('.ix-table__expand')!;
        const row = button.closest('tr')!;
        const content = el.querySelector<HTMLTableRowElement>('.ix-table__expanded')!;
        button.click();
        expect(content.hidden).toBe(false);

        row.hidden = true;
        await flush();
        expect(content.hidden).toBe(true);
        expect(button.getAttribute('aria-expanded')).toBe('true');

        row.hidden = false;
        await flush();
        expect(content.hidden).toBe(false);
    });

    it('respekterer aria-controls og id som er satt', () => {
        const el = mount(`
            <ix-table><table aria-label="Lån"><tbody>
                <tr><td class="ix-table__control"><button class="ix-table__expand" aria-controls="egen" aria-expanded="true" aria-label="Vis"></button></td><td>A</td></tr>
                <tr class="ix-table__expanded" id="egen"><td>Innhold</td></tr>
            </tbody></table></ix-table>
        `);
        expect(el.querySelector('.ix-table__expanded')!.id).toBe('egen');
        expect(el.querySelector<HTMLTableRowElement>('#egen')!.hidden).toBe(false);
    });
});

describe('IxTable rulling', () => {
    function mockScroll(scroll: HTMLElement, scrollWidth: number, clientWidth: number, scrollLeft = 0): void {
        Object.defineProperty(scroll, 'scrollWidth', { configurable: true, value: scrollWidth });
        Object.defineProperty(scroll, 'clientWidth', { configurable: true, value: clientWidth });
        Object.defineProperty(scroll, 'scrollLeft', { configurable: true, writable: true, value: scrollLeft });
    }

    it('gjør rulleområdet fokuserbart og navngitt bare når det ruller', () => {
        const el = mount(SORTABLE.replace('aria-label="Betalinger"', 'aria-labelledby="h"'));
        const scroll = el.querySelector<HTMLElement>('.ix-table__scroll')!;
        expect(scroll.hasAttribute('tabindex')).toBe(false);

        mockScroll(scroll, 600, 300);
        scroll.dispatchEvent(new Event('scroll'));
        expect(scroll.getAttribute('tabindex')).toBe('0');
        expect(scroll.getAttribute('role')).toBe('region');
        expect(scroll.getAttribute('aria-labelledby')).toBe('h');
        expect(scroll.hasAttribute('data-overflow-start')).toBe(false);
        expect(scroll.hasAttribute('data-overflow-end')).toBe(true);

        mockScroll(scroll, 600, 300, 300);
        scroll.dispatchEvent(new Event('scroll'));
        expect(scroll.hasAttribute('data-overflow-start')).toBe(true);
        expect(scroll.hasAttribute('data-overflow-end')).toBe(false);

        mockScroll(scroll, 300, 300);
        scroll.dispatchEvent(new Event('scroll'));
        expect(scroll.hasAttribute('tabindex')).toBe(false);
        expect(scroll.hasAttribute('role')).toBe(false);
    });

    it('rydder sine egne attributter også etter at tabellen er flyttet', () => {
        const el = mount(SORTABLE);
        const scroll = el.querySelector<HTMLElement>('.ix-table__scroll')!;
        mockScroll(scroll, 600, 300);
        scroll.dispatchEvent(new Event('scroll'));
        expect(scroll.getAttribute('tabindex')).toBe('0');

        const parent = el.parentElement!;
        el.remove();
        parent.append(el);
        mockScroll(scroll, 300, 300);
        scroll.dispatchEvent(new Event('scroll'));
        expect(scroll.hasAttribute('tabindex')).toBe(false);
        expect(scroll.hasAttribute('role')).toBe(false);
        expect(scroll.hasAttribute('aria-label')).toBe(false);
    });

    it('navngir rulleområdet etter captionen når tabellen bare har caption', () => {
        const el = mount(SORTABLE.replace('<table aria-label="Betalinger">', '<table><caption>Betalinger</caption>'));
        const scroll = el.querySelector<HTMLElement>('.ix-table__scroll')!;
        mockScroll(scroll, 600, 300);
        scroll.dispatchEvent(new Event('scroll'));
        const caption = el.querySelector('caption')!;
        expect(caption.id).not.toBe('');
        expect(scroll.getAttribute('aria-labelledby')).toBe(caption.id);
    });

    it('rører ikke tabindex som konsumenten har satt', () => {
        const el = mount(SORTABLE.replace('class="ix-table__scroll"', 'class="ix-table__scroll" tabindex="-1"'));
        const scroll = el.querySelector<HTMLElement>('.ix-table__scroll')!;
        mockScroll(scroll, 600, 300);
        scroll.dispatchEvent(new Event('scroll'));
        expect(scroll.getAttribute('tabindex')).toBe('-1');
    });
});

describe('IxTable loading', () => {
    it('skriver loading-label i én status mens tabellen laster, og tømmer den etterpå', async () => {
        const el = mount(`
            <ix-table loading-label="Laster betalinger"><table aria-label="T" aria-busy="true">
                <tbody><tr class="ix-table__loading"><td>…</td></tr></tbody>
            </table></ix-table>
        `);
        const status = el.querySelector('[data-field="status"]')!;
        expect(status.getAttribute('role')).toBe('status');
        // Statusen settes inn tom og får teksten litt etter, så den leses opp.
        expect(status.textContent).toBe('');
        await new Promise((resolve) => setTimeout(resolve, 120));
        expect(status.textContent).toBe('Laster betalinger');

        el.querySelector('table')!.removeAttribute('aria-busy');
        await flush();
        expect(el.querySelectorAll('[data-field="status"]')).toHaveLength(1);
        expect(status.textContent).toBe('');

        // Når statusen allerede finnes, skrives teksten med en gang.
        el.querySelector('table')!.setAttribute('aria-busy', 'true');
        await flush();
        expect(status.textContent).toBe('Laster betalinger');
    });

    it('skriver ikke loading-label hvis lastingen er over før statusen er klar', async () => {
        const el = mount(`
            <ix-table loading-label="Laster"><table aria-label="T" aria-busy="true">
                <tbody><tr class="ix-table__loading"><td>…</td></tr></tbody>
            </table></ix-table>
        `);
        el.querySelector('table')!.removeAttribute('aria-busy');
        await new Promise((resolve) => setTimeout(resolve, 120));
        expect(el.querySelector('[data-field="status"]')!.textContent).toBe('');
    });

    it('leser opp teksten om utvalget etter et valg', async () => {
        const el = mount(
            MULTI.replace(
                '<span data-selected-count></span> valgt',
                '<span data-field="selected-label"><span data-selected-count></span> valgt</span>'
            )
        );
        el.querySelector<HTMLInputElement>('#all')!.click();
        await flush();
        expect(el.querySelector('[data-field="status"]')!.textContent).toBe('3 valgt');

        el.querySelector<HTMLInputElement>('#a')!.click();
        await flush();
        expect(el.querySelector('[data-field="status"]')!.textContent).toBe('2 valgt');
    });

    it('lar meldingen om utvalget stå når tabellen synker på nytt', async () => {
        const el = mount(
            MULTI.replace(
                '<span data-selected-count></span> valgt',
                '<span data-field="selected-label"><span data-selected-count></span> valgt</span>'
            )
        );
        el.querySelector<HTMLInputElement>('#b')!.click();
        await flush();
        el.refresh();
        expect(el.querySelector('[data-field="status"]')!.textContent).toBe('1 valgt');
    });

    it('advarer når tabellen laster uten loading-label', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mount('<ix-table><table aria-label="T" aria-busy="true"><tbody></tbody></table></ix-table>');
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('loading-label'));
    });
});

describe('IxTable justering og colspan', () => {
    it('rører aldri data-align som konsumenten setter på cellen', () => {
        const el = mount(SORTABLE);
        const cell = el.querySelector('tbody tr')!.children[2];
        cell.setAttribute('data-align', 'start');
        el.refresh();
        expect(cell.getAttribute('data-align')).toBe('start');
        expect(cell.getAttribute('data-column-align')).toBe('end');

        cell.removeAttribute('data-align');
        el.refresh();
        expect(cell.hasAttribute('data-align')).toBe(false);
    });

    it('følger justering som endres på kolonnens th', async () => {
        const el = mount(SORTABLE);
        el.querySelectorAll('th')[2].removeAttribute('data-align');
        await flush();
        expect(el.querySelector('tbody tr')!.children[2].hasAttribute('data-column-align')).toBe(false);
    });

    it('gir slipp på colspan som konsumenten endrer senere', () => {
        const el = mount(EXPANDABLE);
        const cell = el.querySelector<HTMLTableRowElement>('.ix-table__expanded')!.cells[0];
        expect(cell.colSpan).toBe(3);
        cell.colSpan = 2;
        el.refresh();
        expect(cell.colSpan).toBe(2);
    });

    it('gjør ikke en rad med deaktivert kontroll interaktiv', () => {
        const el = mount(MULTI.replace('id="b" value="b"', 'id="b" value="b" disabled'));
        expect(el.querySelector('#b')!.closest('tr')!.hasAttribute('data-interactive')).toBe(false);
        expect(el.querySelector('#a')!.closest('tr')!.hasAttribute('data-interactive')).toBe(true);
    });
});

describe('IxTable observer', () => {
    it('synker ikke for endringer i toolbaren, men for utvalget når det legges inn', async () => {
        const el = mount(
            MULTI.replace(
                '<div class="ix-table__selection" hidden><span data-selected-count></span> valgt</div>',
                '<div class="ix-table__toolbar"></div>'
            )
        );
        const refresh = vi.spyOn(el, 'refresh');
        el.querySelector('.ix-table__toolbar')!.append(document.createElement('span'));
        await flush();
        expect(refresh).not.toHaveBeenCalled();

        el.querySelector<HTMLInputElement>('#a')!.click();
        el.querySelector('.ix-table__toolbar')!.insertAdjacentHTML(
            'beforeend',
            '<div class="ix-table__selection"><span data-selected-count></span> valgt</div>'
        );
        await flush();
        expect(refresh).toHaveBeenCalled();
        expect(el.querySelector('[data-selected-count]')!.textContent).toBe('1');
    });
});

describe('IxTable advarsler', () => {
    it('advarer når en valgkontroll i raden mangler value', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mount(MULTI.replace(' value="b"', ''));
        expect(warn.mock.calls.some(([m]) => String(m).includes('mangler value'))).toBe(true);
        expect(warn.mock.calls.filter(([m]) => String(m).includes('mangler value'))).toHaveLength(1);
    });

    it('advarer om tabell og kontroller uten navn, én gang per element', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const el = mount(`
            <ix-table><table>
                <tbody><tr><td class="ix-table__control"><input type="checkbox" value="a"></td><td>A</td></tr></tbody>
            </table></ix-table>
        `);
        expect(warn).toHaveBeenCalledTimes(2);
        el.refresh();
        expect(warn).toHaveBeenCalledTimes(2);
    });

    it('advarer om ugyldig data-sticky', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mount(SORTABLE.replace('<ix-table class="ix-table">', '<ix-table class="ix-table" data-sticky="both">'));
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('data-sticky="both"'));
    });

    it('krasjer ikke uten table', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        expect(() => mount('<ix-table></ix-table>')).not.toThrow();
        expect(warn).toHaveBeenCalled();
    });
});

describe('IxTable livssyklus', () => {
    it('synker rader som legges til etterpå', async () => {
        const el = mount(MULTI);
        const row = document.createElement('tr');
        row.innerHTML =
            '<td class="ix-table__control"><input type="checkbox" value="d" aria-label="Velg D" checked></td><td>D</td>';
        el.querySelector('tbody')!.append(row);
        await flush();
        expect(row.hasAttribute('data-interactive')).toBe(true);
        expect(row.hasAttribute('data-selected')).toBe(true);
        expect(el.querySelector('[data-selected-count]')!.textContent).toBe('1');
    });

    it('slutter å reagere når elementet er fjernet', async () => {
        const el = mount(SORTABLE);
        const button = el.querySelector<HTMLButtonElement>('.ix-table__sort')!;
        el.remove();
        button.click();
        expect(el.querySelector('th')!.hasAttribute('aria-sort')).toBe(false);

        const row = document.createElement('tr');
        row.innerHTML = '<td>X</td><td>Y</td><td>Z</td>';
        el.querySelector('tbody')!.append(row);
        await flush();
        expect(row.cells[2].hasAttribute('data-align')).toBe(false);
    });

    it('virker igjen etter remount, uten doble lyttere', () => {
        const el = mount(SORTABLE);
        const parent = el.parentElement!;
        el.remove();
        parent.append(el);
        const handler = vi.fn();
        el.addEventListener('sort-change', handler);
        el.querySelector<HTMLButtonElement>('.ix-table__sort')!.click();
        expect(handler).toHaveBeenCalledTimes(1);
        expect(el.querySelector('th')!.getAttribute('aria-sort')).toBe('ascending');
    });
});
