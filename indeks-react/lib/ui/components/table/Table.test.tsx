import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Table, type TableProps } from './Table';
import type { TableSort } from './TableContext';

const rows = [
    { id: 'strom', mottaker: 'Strømleverandør', belop: '1 245,00' },
    { id: 'mobil', mottaker: 'Mobiloperatør', belop: '399,00' },
    { id: 'borett', mottaker: 'Borettslaget', belop: '4 850,00' },
];

function Regninger(props: Partial<TableProps>) {
    return (
        <Table title="Regninger" {...props}>
            <Table.Header>
                <Table.HeaderCell sortKey="mottaker">Mottaker</Table.HeaderCell>
                <Table.HeaderCell align="end">Beløp</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
                {rows.map((r) => (
                    <Table.Row key={r.id} value={r.id} selectLabel={`Velg ${r.mottaker}`}>
                        <Table.Cell>{r.mottaker}</Table.Cell>
                        <Table.Cell>{r.belop}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

function host(container: HTMLElement): HTMLElement {
    return container.querySelector('ix-table')!;
}

describe('Table', () => {
    it('rendrer ix-table med kort, rulleområde og tabell', () => {
        const { container } = render(<Regninger className="egen" />);
        const el = host(container);
        expect(el.getAttribute('class')).toBe('ix-table egen');
        expect(el.querySelector('.ix-table__frame > .ix-table__scroll > table')).toBeTruthy();
    });

    it('gir tabellen navn fra tittelen, som er h3 som standard', () => {
        render(<Regninger />);
        expect(screen.getByRole('heading', { level: 3, name: 'Regninger' }).className).toBe('ix-table__heading');
        expect(screen.getByRole('table', { name: 'Regninger' })).toBeTruthy();
    });

    it('bruker titleAs, og ariaLabel når tittelen mangler', () => {
        const { rerender } = render(<Regninger titleAs="h2" />);
        expect(screen.getByRole('heading', { level: 2 })).toBeTruthy();
        rerender(<Regninger title={undefined} ariaLabel="Betalinger" />);
        expect(screen.queryByRole('heading')).toBeNull();
        expect(screen.getByRole('table', { name: 'Betalinger' })).toBeTruthy();
    });

    it('setter data-sticky og data-density, og sender ref og native props til ix-table', () => {
        const ref = createRef<HTMLElement>();
        const { container } = render(
            <Table ref={ref} ariaLabel="T" sticky="first" density="compact" data-testid="t">
                <Table.Body />
            </Table>
        );
        const el = host(container);
        expect(el.getAttribute('data-sticky')).toBe('first');
        expect(el.getAttribute('data-density')).toBe('compact');
        expect(el.getAttribute('data-testid')).toBe('t');
        expect(ref.current).toBe(el);
    });

    it('rendrer kolonneoverskrifter med scope, og justering som web componenten arver nedover', () => {
        const { container } = render(<Regninger />);
        const headers = screen.getAllByRole('columnheader');
        expect(headers.every((th) => th.getAttribute('scope') === 'col')).toBe(true);
        expect(headers[1].getAttribute('data-align')).toBe('end');
        expect(container.querySelector('tbody tr td:last-child')!.getAttribute('data-align')).toBe('end');
    });

    it('rendrer footer og paginering bare når de er gitt', () => {
        const { container, rerender } = render(<Regninger />);
        expect(container.querySelector('.ix-table__footer')).toBeNull();
        expect(container.querySelector('.ix-table__pagination')).toBeNull();
        rerender(<Regninger footer={<span>Sum</span>} pagination={<nav>Sider</nav>} />);
        expect(container.querySelector('.ix-table__footer')!.textContent).toBe('Sum');
        expect(container.querySelector('.ix-table__pagination')!.textContent).toBe('Sider');
    });

    it('legger beskrivelse og radoverskrift i cellen', () => {
        render(
            <Table ariaLabel="Kontoer">
                <Table.Body>
                    <Table.Row>
                        <Table.Cell rowHeader description="•••• 12345">
                            Brukskonto
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );
        const cell = screen.getByRole('rowheader');
        expect(cell.getAttribute('scope')).toBe('row');
        expect(cell.querySelector('.ix-table__description')!.textContent).toBe('•••• 12345');
    });
});

describe('Table sortering', () => {
    it('gjør bare kolonner med sortKey til knapper', () => {
        render(<Regninger />);
        const headers = screen.getAllByRole('columnheader');
        expect(within(headers[0]).getByRole('button', { name: 'Mottaker' }).className).toBe('ix-table__sort');
        expect(within(headers[1]).queryByRole('button')).toBeNull();
    });

    it('rapporterer neste sortering uten å flytte radene, ukontrollert', () => {
        const onSortChange = vi.fn();
        const { container } = render(<Regninger onSortChange={onSortChange} />);
        const button = screen.getByRole('button', { name: 'Mottaker' });

        fireEvent.click(button);
        expect(onSortChange).toHaveBeenLastCalledWith({ key: 'mottaker', direction: 'ascending' });
        expect(button.closest('th')!.getAttribute('aria-sort')).toBe('ascending');
        expect(container.querySelector('tbody tr')!.textContent).toContain('Strømleverandør');

        fireEvent.click(button);
        expect(onSortChange).toHaveBeenLastCalledWith({ key: 'mottaker', direction: 'descending' });
        fireEvent.click(button);
        expect(onSortChange).toHaveBeenLastCalledWith(null);
        expect(button.closest('th')!.hasAttribute('aria-sort')).toBe(false);
    });

    it('speiler kontrollert sort som aria-sort og ikon', async () => {
        function Kontrollert() {
            const [sort, setSort] = useState<TableSort>({ key: 'mottaker', direction: 'descending' });
            return <Regninger sort={sort} onSortChange={setSort} />;
        }
        render(<Kontrollert />);
        const th = screen.getAllByRole('columnheader')[0];
        expect(th.getAttribute('aria-sort')).toBe('descending');
        await act(async () => {});
        expect(th.querySelectorAll('.ix-table__sort-icon > ix-icon')).toHaveLength(3);

        fireEvent.click(within(th).getByRole('button'));
        expect(th.hasAttribute('aria-sort')).toBe(false);
    });
});

describe('Table valg', () => {
    it('legger til checkbox i header og rader, med navn fra props', () => {
        render(<Regninger variant="multi-select" selectAllLabel="Velg alle" />);
        expect(screen.getByRole('checkbox', { name: 'Velg alle' })).toBeTruthy();
        expect(screen.getByRole('checkbox', { name: 'Velg Mobiloperatør' })).toBeTruthy();
        expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });

    it('rapporterer valgte nøkler og markerer raden, ukontrollert', () => {
        const onSelectionChange = vi.fn();
        render(
            <Regninger
                variant="multi-select"
                selectAllLabel="Velg alle"
                defaultSelectedKeys={['strom']}
                onSelectionChange={onSelectionChange}
            />
        );
        const strom = screen.getByRole('checkbox', { name: 'Velg Strømleverandør' }) as HTMLInputElement;
        expect(strom.checked).toBe(true);
        expect(strom.closest('tr')!.hasAttribute('data-selected')).toBe(true);

        fireEvent.click(screen.getByRole('checkbox', { name: 'Velg Borettslaget' }));
        expect(onSelectionChange).toHaveBeenLastCalledWith(['strom', 'borett']);
    });

    it('velger alle fra headeren og oppdaterer utvalget i toolbaren', () => {
        const onSelectionChange = vi.fn();
        const { container } = render(
            <Regninger
                variant="multi-select"
                selectAllLabel="Velg alle"
                onSelectionChange={onSelectionChange}
                toolbar={
                    <Table.Toolbar
                        selectionActions={<button type="button">Godkjenn</button>}
                        selectedLabel={(n) => `${n} valgt`}
                    />
                }
            />
        );
        const selection = container.querySelector<HTMLElement>('.ix-table__selection')!;
        expect(selection.hidden).toBe(true);

        fireEvent.click(screen.getByRole('checkbox', { name: 'Velg alle' }));
        expect(onSelectionChange).toHaveBeenLastCalledWith(['strom', 'mobil', 'borett']);
        expect(selection.hidden).toBe(false);
        expect(selection.textContent).toContain('3 valgt');
        expect(container.querySelectorAll('tbody tr[data-selected]')).toHaveLength(3);
    });

    it('leser opp antallet React har rendret etter «velg alle»', async () => {
        render(
            <Regninger
                variant="multi-select"
                selectAllLabel="Velg alle"
                toolbar={
                    <Table.Toolbar
                        selectionActions={<button type="button">Godkjenn</button>}
                        selectedLabel={(n) => `${n} valgt`}
                    />
                }
            />
        );
        fireEvent.click(screen.getByRole('checkbox', { name: 'Velg alle' }));
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });
        expect(screen.getByRole('status').textContent).toBe('3 valgt');
    });

    it('fjerner valg for rader som ikke lenger vises, og sier fra', () => {
        const onSelectionChange = vi.fn();
        function Filtrert({ skjul }: { skjul?: string }) {
            return (
                <Table
                    title="Regninger"
                    variant="multi-select"
                    selectAllLabel="Velg alle"
                    defaultSelectedKeys={['strom', 'mobil']}
                    onSelectionChange={onSelectionChange}
                    toolbar={
                        <Table.Toolbar
                            selectionActions={<button type="button">Godkjenn</button>}
                            selectedLabel={(n) => `${n} valgt`}
                        />
                    }
                >
                    <Table.Body>
                        {rows
                            .filter((r) => r.id !== skjul)
                            .map((r) => (
                                <Table.Row key={r.id} value={r.id} selectLabel={`Velg ${r.mottaker}`}>
                                    <Table.Cell>{r.mottaker}</Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
            );
        }
        const { container, rerender } = render(<Filtrert />);
        expect(onSelectionChange).not.toHaveBeenCalled();

        rerender(<Filtrert skjul="strom" />);
        expect(onSelectionChange).toHaveBeenCalledTimes(1);
        expect(onSelectionChange).toHaveBeenLastCalledWith(['mobil']);
        expect(container.querySelector('.ix-table__selection')!.textContent).toContain('1 valgt');

        rerender(<Filtrert />);
        expect((screen.getByRole('checkbox', { name: 'Velg Strømleverandør' }) as HTMLInputElement).checked).toBe(
            false
        );
        expect((screen.getByRole('checkbox', { name: 'Velg Mobiloperatør' }) as HTMLInputElement).checked).toBe(true);
        expect(onSelectionChange).toHaveBeenCalledTimes(1);
    });

    it('beholder forhåndsvalget mens tabellen laster', () => {
        const onSelectionChange = vi.fn();
        const { rerender } = render(
            <Regninger
                variant="multi-select"
                selectAllLabel="Velg alle"
                loading
                loadingLabel="Laster"
                defaultSelectedKeys={['borett']}
                onSelectionChange={onSelectionChange}
            />
        );
        rerender(
            <Regninger
                variant="multi-select"
                selectAllLabel="Velg alle"
                loadingLabel="Laster"
                defaultSelectedKeys={['borett']}
                onSelectionChange={onSelectionChange}
            />
        );
        expect(onSelectionChange).not.toHaveBeenCalled();
        expect((screen.getByRole('checkbox', { name: 'Velg Borettslaget' }) as HTMLInputElement).checked).toBe(true);
    });

    it('melder en nøkkel uten rad én gang, også når kontrollert state ikke oppdateres', () => {
        const onSelectionChange = vi.fn();
        const { rerender } = render(
            <Regninger
                variant="multi-select"
                selectAllLabel="Velg alle"
                selectedKeys={['mobil', 'finnes-ikke']}
                onSelectionChange={onSelectionChange}
            />
        );
        rerender(
            <Regninger
                variant="multi-select"
                selectAllLabel="Velg alle"
                selectedKeys={['mobil', 'finnes-ikke']}
                onSelectionChange={onSelectionChange}
            />
        );
        expect(onSelectionChange).toHaveBeenCalledTimes(1);
        expect(onSelectionChange).toHaveBeenLastCalledWith(['mobil']);
    });

    it('tåler native selectionchange fra søkefeltet i toolbaren', () => {
        const onSelectionChange = vi.fn();
        render(
            <Regninger
                variant="multi-select"
                selectAllLabel="Velg alle"
                onSelectionChange={onSelectionChange}
                toolbar={<Table.Toolbar filters={<input type="search" aria-label="Søk i tabell" />} />}
            />
        );
        const search = screen.getByRole('searchbox');
        expect(() => search.dispatchEvent(new Event('selectionchange', { bubbles: true }))).not.toThrow();
        expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('viser antallet valgte også uten handlinger for utvalget', () => {
        const { container } = render(
            <Regninger
                variant="multi-select"
                selectAllLabel="Velg alle"
                defaultSelectedKeys={['mobil']}
                toolbar={<Table.Toolbar selectedLabel={(n) => `${n} valgt`} />}
            />
        );
        const selection = container.querySelector<HTMLElement>('.ix-table__selection')!;
        expect(selection.hidden).toBe(false);
        expect(selection.textContent).toBe('1 valgt');
    });

    it('speiler kontrollert utvalg inn i kontrollene og headeren', () => {
        const { rerender } = render(<Regninger variant="multi-select" selectAllLabel="Velg alle" selectedKeys={[]} />);
        rerender(<Regninger variant="multi-select" selectAllLabel="Velg alle" selectedKeys={['mobil']} />);
        const mobil = screen.getByRole('checkbox', { name: 'Velg Mobiloperatør' }) as HTMLInputElement;
        expect(mobil.checked).toBe(true);
        expect(mobil.closest('tr')!.hasAttribute('data-selected')).toBe(true);
        expect((screen.getByRole('checkbox', { name: 'Velg alle' }) as HTMLInputElement).indeterminate).toBe(true);
    });

    it('gir radioene et felles name som overlever re-render, uten name på checkboxer', () => {
        const { rerender } = render(<Regninger variant="single-select" title="A" />);
        const names = () => (screen.getAllByRole('radio') as HTMLInputElement[]).map((r) => r.name);
        const first = names();
        expect(first[0]).not.toBe('');
        expect(new Set(first).size).toBe(1);
        rerender(<Regninger variant="single-select" title="B" />);
        expect(names()).toEqual(first);

        rerender(<Regninger variant="multi-select" selectAllLabel="Velg alle" />);
        expect((screen.getAllByRole('checkbox') as HTMLInputElement[]).every((c) => c.name === '')).toBe(true);
    });

    it('holder kontrollene i takt med selectedKeys når konsumenten avviser et valg', () => {
        const onSelectionChange = vi.fn();
        render(
            <Regninger
                variant="multi-select"
                selectAllLabel="Velg alle"
                selectedKeys={[]}
                onSelectionChange={onSelectionChange}
            />
        );
        const strom = screen.getByRole('checkbox', { name: 'Velg Strømleverandør' }) as HTMLInputElement;
        fireEvent.click(strom);
        expect(onSelectionChange).toHaveBeenLastCalledWith(['strom']);
        expect(strom.checked).toBe(false);
        expect(strom.closest('tr')!.hasAttribute('data-selected')).toBe(false);

        fireEvent.click(screen.getByRole('checkbox', { name: 'Velg alle' }));
        expect(screen.getAllByRole('checkbox').every((c) => !(c as HTMLInputElement).checked)).toBe(true);
    });

    it('krysser ikke av andre rader uten value når én av dem velges', () => {
        render(
            <Table ariaLabel="T" variant="multi-select" selectAllLabel="Velg alle">
                <Table.Body>
                    <Table.Row selectLabel="Velg A">
                        <Table.Cell>A</Table.Cell>
                    </Table.Row>
                    <Table.Row selectLabel="Velg B">
                        <Table.Cell>B</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );
        fireEvent.click(screen.getByRole('checkbox', { name: 'Velg A' }));
        expect((screen.getByRole('checkbox', { name: 'Velg B' }) as HTMLInputElement).checked).toBe(false);
    });

    it('bruker radio med single-select, og name når det er gitt', () => {
        const onSelectionChange = vi.fn();
        render(<Regninger variant="single-select" name="mottaker" onSelectionChange={onSelectionChange} />);
        const radios = screen.getAllByRole('radio') as HTMLInputElement[];
        expect(radios).toHaveLength(3);
        expect(radios.every((r) => r.name === 'mottaker')).toBe(true);
        expect(screen.getAllByRole('columnheader')).toHaveLength(2);

        fireEvent.click(radios[1]);
        expect(onSelectionChange).toHaveBeenLastCalledWith(['mobil']);
    });
});

describe('Table ekspandering', () => {
    function Lan(props: { defaultExpanded?: boolean }) {
        return (
            <Table ariaLabel="Lån" variant="expandable">
                <Table.Header>
                    <Table.HeaderCell>Lån</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    <Table.Row
                        expandLabel="Vis detaljer for Boliglån"
                        expandedContent={<p>Neste forfall</p>}
                        defaultExpanded={props.defaultExpanded}
                    >
                        <Table.Cell>Boliglån</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );
    }

    it('rendrer knapp og skjult innhold koblet med aria-controls', () => {
        const { container } = render(<Lan />);
        const button = screen.getByRole('button', { name: 'Vis detaljer for Boliglån' });
        const content = container.querySelector<HTMLTableRowElement>('.ix-table__expanded')!;
        expect(button.getAttribute('aria-expanded')).toBe('false');
        expect(content.hidden).toBe(true);
        expect(button.getAttribute('aria-controls')).toBe(content.id);
        expect(content.querySelector('td > .ix-table__expanded-content')!.textContent).toBe('Neste forfall');
    });

    it('åpner og lukker via web componenten', () => {
        const { container } = render(<Lan />);
        fireEvent.click(screen.getByRole('button', { name: 'Vis detaljer for Boliglån' }));
        expect(container.querySelector<HTMLTableRowElement>('.ix-table__expanded')!.hidden).toBe(false);
    });

    it('starter åpen med defaultExpanded', () => {
        const { container } = render(<Lan defaultExpanded />);
        expect(container.querySelector<HTMLTableRowElement>('.ix-table__expanded')!.hidden).toBe(false);
    });

    it('gir headeren en tom td som kontrollcelle, ikke en tom th', () => {
        const { container } = render(<Lan />);
        expect(container.querySelector('thead td.ix-table__control')).toBeTruthy();
        expect(screen.getAllByRole('columnheader')).toHaveLength(1);
    });
});

describe('Table tilstander', () => {
    it('viser empty når det ikke er rader', () => {
        render(
            <Table ariaLabel="Treff">
                <Table.Header>
                    <Table.HeaderCell>Mottaker</Table.HeaderCell>
                </Table.Header>
                <Table.Body empty={<Table.Empty title="Ingen treff">Prøv et annet søk.</Table.Empty>}>{[]}</Table.Body>
            </Table>
        );
        expect(screen.getByText('Ingen treff').closest('tr')!.className).toBe('ix-table__empty');
        expect(screen.getByText('Prøv et annet søk.')).toBeTruthy();
    });

    it('viser loading i radområdet, setter aria-busy og leser opp loadingLabel én gang', async () => {
        const { container } = render(<Regninger loading loadingLabel="Laster" />);
        const table = screen.getByRole('table');
        expect(table.getAttribute('aria-busy')).toBe('true');
        expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
        expect(container.querySelector('.ix-table__loading .ix-spinner')!.getAttribute('aria-hidden')).toBe('true');
        expect(screen.getAllByRole('status')).toHaveLength(1);
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 120));
        });
        expect(screen.getByRole('status').textContent).toBe('Laster');
        expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    });

    it('rendrer skeleton med valgfri header', () => {
        const { container } = render(
            <Table ariaLabel="Laster" loading loadingLabel="Laster">
                <Table.Skeleton columns={4} rows={2} header />
            </Table>
        );
        expect(container.querySelectorAll('thead tr.ix-table__skeleton th')).toHaveLength(4);
        expect(container.querySelectorAll('tbody tr.ix-table__skeleton')).toHaveLength(2);
        expect(container.querySelector('tbody tr')!.getAttribute('aria-hidden')).toBe('true');
    });
});
