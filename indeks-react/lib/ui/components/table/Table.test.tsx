import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Table } from './Table';

function BasicTable(props: React.ComponentProps<typeof Table> = {}) {
    return (
        <Table {...props}>
            <Table.Caption>Transaksjoner</Table.Caption>
            <Table.Head>
                <Table.Row>
                    <Table.ColumnHeader sortable sortKey="dato" sortType="date">
                        Dato
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>Beløp</Table.ColumnHeader>
                </Table.Row>
            </Table.Head>
            <Table.Body>
                <Table.Row>
                    <Table.RowHeader>01.09</Table.RowHeader>
                    <Table.Cell sortValue={250.5}>250,50 kr</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    );
}

describe('Table — semantikk', () => {
    it('rendrer en ekte tabell navngitt av caption', () => {
        render(<BasicTable />);

        expect(screen.getByRole('table', { name: 'Transaksjoner' }).tagName).toBe('TABLE');
    });

    it('gir kolonneoverskrifter scope=col og radoverskrifter scope=row', () => {
        render(<BasicTable />);

        expect(screen.getByText('Beløp').closest('th')?.getAttribute('scope')).toBe('col');
        expect(screen.getByText('01.09').closest('th')?.getAttribute('scope')).toBe('row');
    });

    it('legger sortValue på cellen som data-sort-value', () => {
        render(<BasicTable />);

        expect(screen.getByText('250,50 kr').getAttribute('data-sort-value')).toBe('250.5');
    });
});

describe('Table — scroll-region', () => {
    it('navngir regionen fra caption', () => {
        render(<BasicTable />);

        expect(screen.getByRole('region', { name: 'Transaksjoner' })).toBeTruthy();
    });

    it('bruker scrollLabel når tabellen ikke har caption', () => {
        render(
            <Table scrollLabel="Prisliste">
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>a</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>,
        );

        expect(screen.getByRole('region', { name: 'Prisliste' })).toBeTruthy();
    });

    it('lar containeren være tabbbar slik at tastaturbrukere kan scrolle den', () => {
        render(<BasicTable />);

        expect(screen.getByRole('region', { name: 'Transaksjoner' }).getAttribute('tabindex')).toBe('0');
    });

    /* Høydebegrensningen må havne på scroll-containeren selv, ikke på <table>.
       Containeren har overflow-x: auto, og CSS gjør da også overflow-y til auto, så
       den er scroll-containeren i begge retninger — en høyde lenger ut gir
       stickyHeader ingenting å feste seg mot. */
    it('legger scrollStyle på scroll-containeren, ikke på tabellen', () => {
        render(<BasicTable stickyHeader scrollStyle={{ maxHeight: '10rem' }} />);

        const region = screen.getByRole('region', { name: 'Transaksjoner' });
        expect(region.style.maxHeight).toBe('10rem');
        expect(screen.getByRole('table').style.maxHeight).toBe('');
    });

    it('dropper role=region når den ikke kan navngis', () => {
        render(
            <Table>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>a</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>,
        );

        expect(screen.queryByRole('region')).toBeNull();
    });
});

describe('Table — varianter', () => {
    it('speiler varianter til data-attributter', () => {
        render(<BasicTable density="sm" zebra hover stickyHeader stickyColumn />);

        const table = screen.getByRole('table');
        expect(table.getAttribute('data-density')).toBe('sm');
        expect(table.hasAttribute('data-zebra')).toBe(true);
        expect(table.hasAttribute('data-hover')).toBe(true);
        expect(table.hasAttribute('data-sticky-header')).toBe(true);
        expect(table.hasAttribute('data-sticky-column')).toBe(true);
    });

    it('utelater variant-attributter som ikke er satt', () => {
        render(<BasicTable />);

        const table = screen.getByRole('table');
        expect(table.hasAttribute('data-zebra')).toBe(false);
        expect(table.hasAttribute('data-sticky-column')).toBe(false);
    });

    it('merker uthevet kolonne på <col>', () => {
        render(
            <Table scrollLabel="Sammenligning">
                <Table.ColumnGroup>
                    <Table.Column />
                    <Table.Column highlighted />
                </Table.ColumnGroup>
                <Table.Body>
                    <Table.Row>
                        <Table.RowHeader>Pris</Table.RowHeader>
                        <Table.Cell>0 kr</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>,
        );

        const columns = document.querySelectorAll('col');
        expect(columns[0].hasAttribute('data-highlighted')).toBe(false);
        expect(columns[1].hasAttribute('data-highlighted')).toBe(true);
    });
});

describe('Table — sortering', () => {
    it('rendrer sorterbar overskrift som knapp med komparator og nøkkel', () => {
        render(<BasicTable />);

        const button = screen.getByRole('button', { name: 'Dato' });
        expect(button.getAttribute('data-ix-sort')).toBe('date');
        expect(button.getAttribute('data-sort-key')).toBe('dato');
    });

    it('lar overskrifter uten sortable være ren tekst', () => {
        render(<BasicTable />);

        expect(screen.queryByRole('button', { name: 'Beløp' })).toBeNull();
    });

    /* Sorteringsknappen er et ekte <button type="button">, ikke en klikkbar <th>.
       Det er dét som gir tastaturaktivering og fokus gratis, så det er verdt å
       feste — en <th onClick> ville sett identisk ut visuelt. */
    it('bruker et ekte button-element med type=button', () => {
        render(<BasicTable />);

        const button = screen.getByRole('button', { name: 'Dato' });
        expect(button.tagName).toBe('BUTTON');
        expect(button.getAttribute('type')).toBe('button');
    });

    it('speiler kontrollert sortDirection til aria-sort', () => {
        render(
            <Table scrollLabel="t">
                <Table.Head>
                    <Table.Row>
                        <Table.ColumnHeader sortable sortDirection="descending">
                            Dato
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Head>
            </Table>,
        );

        expect(screen.getByRole('columnheader').getAttribute('aria-sort')).toBe('descending');
    });

    it('kaller onSort med detaljen fra ix-sort', () => {
        const onSort = vi.fn();
        render(<BasicTable onSort={onSort} />);

        screen.getByRole('table').dispatchEvent(
            new CustomEvent('ix-sort', {
                bubbles: true,
                detail: { index: 0, key: 'dato', type: 'date', direction: 'ascending' },
            }),
        );

        expect(onSort).toHaveBeenCalledWith({
            index: 0,
            key: 'dato',
            type: 'date',
            direction: 'ascending',
        });
    });

    it('slutter å lytte når komponenten unmountes', () => {
        const onSort = vi.fn();
        const { unmount } = render(<BasicTable onSort={onSort} />);
        const table = screen.getByRole('table');
        unmount();

        table.dispatchEvent(new CustomEvent('ix-sort', { bubbles: true, detail: {} }));

        expect(onSort).not.toHaveBeenCalled();
    });

    it('setter ikke data-ix-sort-client som standard — React eier radene', () => {
        render(<BasicTable />);

        expect(screen.getByRole('table').hasAttribute('data-ix-sort-client')).toBe(false);
    });

    it('melder seg på klient-sortering når clientSort er satt', () => {
        render(<BasicTable clientSort />);

        expect(screen.getByRole('table').hasAttribute('data-ix-sort-client')).toBe(true);
    });

    it('sender annonseringsmalene videre som data-attributter', () => {
        render(
            <BasicTable
                sortAscendingText="Sortert etter {column}, stigende"
                sortDescendingText="Sortert etter {column}, synkende"
            />,
        );

        const table = screen.getByRole('table');
        expect(table.getAttribute('data-ix-sort-ascending-text')).toBe(
            'Sortert etter {column}, stigende',
        );
        expect(table.getAttribute('data-ix-sort-descending-text')).toBe(
            'Sortert etter {column}, synkende',
        );
    });
});

describe('Table — komposisjon', () => {
    it('rendrer tfoot', () => {
        render(
            <Table scrollLabel="t">
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>1</Table.Cell>
                    </Table.Row>
                </Table.Body>
                <Table.Foot>
                    <Table.Row>
                        <Table.RowHeader>Sum</Table.RowHeader>
                    </Table.Row>
                </Table.Foot>
            </Table>,
        );

        expect(screen.getByText('Sum').closest('tfoot')).not.toBeNull();
    });

    it('videresender ref til <table>', () => {
        const ref = { current: null as HTMLTableElement | null };
        render(<BasicTable ref={ref} />);

        expect(ref.current?.tagName).toBe('TABLE');
    });

    it('slår sammen className med ix-table', () => {
        render(<BasicTable className="egen" />);

        const table = screen.getByRole('table');
        expect(table.classList.contains('ix-table')).toBe(true);
        expect(table.classList.contains('egen')).toBe(true);
    });
});
