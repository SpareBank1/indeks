import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';

import { Button, InteractiveIcon, LinkText, Pagination, Select, Table, Tag, TextField } from '@sb1/indeks-react';
import type { TableSort } from '@sb1/indeks-react';

type Regning = {
    id: string;
    mottaker: string;
    status: { tekst: string; variant: 'success' | 'warning' | 'info' };
    forfall: string;
    belop: string;
};

const regninger: Regning[] = [
    {
        id: 'fjordkraft',
        mottaker: 'Fjordkraft AS',
        status: { tekst: 'Betalt', variant: 'success' },
        forfall: '12.10.2026',
        belop: '1 249,00',
    },
    {
        id: 'gjensidige',
        mottaker: 'Gjensidige',
        status: { tekst: 'Forfaller snart', variant: 'warning' },
        forfall: '18.11.2026',
        belop: '849,00',
    },
    {
        id: 'telenor',
        mottaker: 'Telenor Norge',
        status: { tekst: 'Til behandling', variant: 'info' },
        forfall: '25.11.2026',
        belop: '599,00',
    },
];

function RegningRader({ rader = regninger, handling = true }: { rader?: Regning[]; handling?: boolean }) {
    return rader.map((r) => (
        <Table.Row key={r.id} value={r.id} selectLabel={`Velg ${r.mottaker}`}>
            <Table.Cell>{r.mottaker}</Table.Cell>
            <Table.Cell>
                <Tag variant={r.status.variant} type="subtle" size="sm">
                    {r.status.tekst}
                </Tag>
            </Table.Cell>
            <Table.Cell>{r.forfall}</Table.Cell>
            <Table.Cell>{r.belop}</Table.Cell>
            {handling && (
                <Table.Cell align="end">
                    <InteractiveIcon name="more_vert" size="sm" aria-label={`Flere valg for ${r.mottaker}`} />
                </Table.Cell>
            )}
        </Table.Row>
    ));
}

function RegningHeader({ handling = true }: { handling?: boolean }) {
    return (
        <Table.Header>
            <Table.HeaderCell>Mottaker</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Forfallsdato</Table.HeaderCell>
            <Table.HeaderCell align="end">Beløp</Table.HeaderCell>
            {handling && (
                <Table.HeaderCell>
                    <span className="ix-sr-only">Handlinger</span>
                </Table.HeaderCell>
            )}
        </Table.Header>
    );
}

const meta = {
    title: 'Components/Table',
    component: Table,
    tags: ['autodocs'],
    args: {
        title: 'Regninger',
    },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
    render: (args) => (
        <Table {...args}>
            <RegningHeader />
            <Table.Body>
                <RegningRader />
            </Table.Body>
        </Table>
    ),
};

type Transaksjon = { id: string; dato: string; iso: string; mottaker: string; type: string; belop: number };

const transaksjoner: Transaksjon[] = [
    { id: 't1', dato: '06.11.2026', iso: '2026-11-06', mottaker: 'Matbutikken', type: 'Kortkjøp', belop: -684.5 },
    { id: 't2', dato: '05.11.2026', iso: '2026-11-05', mottaker: 'Strømleverandør', type: 'AvtaleGiro', belop: -1245 },
    { id: 't3', dato: '04.11.2026', iso: '2026-11-04', mottaker: 'Kafé Torget', type: 'Kortkjøp', belop: -89 },
];

const kroner = new Intl.NumberFormat('nb-NO', { minimumFractionDigits: 2 });

/** Table sorterer ikke radene i React. Storyen sorterer dataene ut fra `sort`, slik konsumenten gjør. */
function sorter(rader: Transaksjon[], sort: TableSort | undefined): Transaksjon[] {
    if (!sort) return rader;
    const faktor = sort.direction === 'ascending' ? 1 : -1;
    return [...rader].sort((a, b) => {
        if (sort.key === 'dato') return a.iso.localeCompare(b.iso) * faktor;
        if (sort.key === 'belop') return (a.belop - b.belop) * faktor;
        return a.mottaker.localeCompare(b.mottaker, 'nb') * faktor;
    });
}

/**
 * Kontrollert via args: onSortChange oppdaterer sort, og radene sorteres ut fra
 * den. Første render er alltid sort fra args, så snapshotet er stabilt.
 */
export const Sortable: Story = {
    name: 'Sorterbar',
    args: {
        title: 'Transaksjoner',
        sort: { key: 'dato', direction: 'ascending' },
        sortLabels: {
            ascending: 'Sortert etter {column}, stigende',
            descending: 'Sortert etter {column}, synkende',
            none: 'Sortering fjernet',
        },
    },
    render: function Render(args) {
        const [, updateArgs] = useArgs();
        return (
            <Table {...args} onSortChange={(sort) => updateArgs({ sort })}>
                <Table.Header>
                    <Table.HeaderCell sortKey="dato">Dato</Table.HeaderCell>
                    <Table.HeaderCell sortKey="mottaker">Mottaker</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell sortKey="belop" align="end">
                        Beløp
                    </Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    {sorter(transaksjoner, args.sort).map((t) => (
                        <Table.Row key={t.id}>
                            <Table.Cell>{t.dato}</Table.Cell>
                            <Table.Cell>{t.mottaker}</Table.Cell>
                            <Table.Cell>{t.type}</Table.Cell>
                            <Table.Cell>{kroner.format(t.belop)}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    },
};

const kontoer = [
    { id: 'bruk', navn: 'Brukskonto', nummer: '•••• •• 12345', type: 'Daglig bruk', saldo: '24 850,00' },
    { id: 'spare', navn: 'Sparekonto', nummer: '•••• •• 67890', type: 'Sparing', saldo: '156 200,00' },
    { id: 'regning', navn: 'Regningskonto', nummer: '•••• •• 24680', type: 'Betaling', saldo: '18 450,00' },
];

export const SingleSelect: Story = {
    name: 'Single select',
    args: {
        title: 'Velg konto',
        variant: 'single-select',
        name: 'konto',
        defaultSelectedKeys: ['bruk'],
    },
    render: (args) => (
        <Table {...args}>
            <Table.Header>
                <Table.HeaderCell>Konto</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell align="end">Saldo</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
                {kontoer.map((k) => (
                    <Table.Row key={k.id} value={k.id} selectLabel={`Velg ${k.navn}`}>
                        <Table.Cell description={k.nummer}>{k.navn}</Table.Cell>
                        <Table.Cell>{k.type}</Table.Cell>
                        <Table.Cell>{k.saldo}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    ),
};

const verktoylinje = (
    <Table.Toolbar
        filters={
            <>
                <TextField ariaLabel="Søk i tabell" type="search" />
                <Select
                    ariaLabel="Filtrer på status"
                    options={[
                        { value: 'alle', label: 'Alle' },
                        { value: 'betalt', label: 'Betalt' },
                    ]}
                />
            </>
        }
        selectedLabel={(n) => `${n} valgt`}
        selectionActions={
            <>
                <Button variant="tertiary" size="sm">
                    Godkjenn
                </Button>
                <Button variant="tertiary" size="sm">
                    Avvis
                </Button>
            </>
        }
        actions={<InteractiveIcon name="more_vert" size="sm" aria-label="Flere handlinger" />}
    />
);

export const MultiSelect: Story = {
    name: 'Multi select',
    args: {
        variant: 'multi-select',
        selectAllLabel: 'Velg alle regninger',
        defaultSelectedKeys: ['gjensidige'],
        toolbar: verktoylinje,
    },
    render: (args) => (
        <Table {...args}>
            <RegningHeader />
            <Table.Body>
                <RegningRader />
            </Table.Body>
        </Table>
    ),
};

const lan = [
    { id: 'bolig', navn: 'Boliglån', restgjeld: '2 450 000,00', rente: '5,49 %', termin: '14 850,00' },
    { id: 'bil', navn: 'Billån', restgjeld: '185 000,00', rente: '7,25 %', termin: '3 950,00' },
    { id: 'hytte', navn: 'Hyttelån', restgjeld: '780 000,00', rente: '5,79 %', termin: '5 420,00' },
];

export const Expandable: Story = {
    name: 'Ekspanderbar',
    args: {
        title: 'Lån',
        variant: 'expandable',
    },
    render: (args) => (
        <Table {...args}>
            <Table.Header>
                <Table.HeaderCell>Lån</Table.HeaderCell>
                <Table.HeaderCell align="end">Restgjeld</Table.HeaderCell>
                <Table.HeaderCell align="end">Rente</Table.HeaderCell>
                <Table.HeaderCell align="end">Terminbeløp</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
                {lan.map((l, i) => (
                    <Table.Row
                        key={l.id}
                        expandLabel={`Vis detaljer for ${l.navn}`}
                        defaultExpanded={i === 0}
                        expandedContent={
                            <div className="ix-flex ix-flex-col ix-gap-sm ix-items-start">
                                <span>
                                    Betalingsfrekvens:{' '}
                                    <Tag variant="info" type="subtle" size="sm">
                                        Månedlig betaling
                                    </Tag>
                                </span>
                                <span>Neste forfall: 15. desember 2026</span>
                                <Button size="sm">Endre forfallsdato</Button>
                                <LinkText href="#">Slik fungerer renter og avdrag</LinkText>
                            </div>
                        }
                    >
                        <Table.Cell>{l.navn}</Table.Cell>
                        <Table.Cell>{l.restgjeld}</Table.Cell>
                        <Table.Cell>{l.rente}</Table.Cell>
                        <Table.Cell>{l.termin}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    ),
};

/**
 * Høyere enn viewporten i mobile-chromium (320 × 780), og der blir
 * elementskjermbildet forskjøvet. WebKit tar det riktig, så storyen beholder
 * mobildekningen der.
 */
export const FooterOgPaginering: Story = {
    name: 'Footer og paginering',
    tags: ['mobile-webkit'],
    args: {
        footer: (
            <>
                <span>Totalt</span>
                <span>2 697,00</span>
            </>
        ),
        pagination: (
            <Pagination
                page={2}
                count={10}
                onPageChange={() => {}}
                ariaLabel="Sider med regninger"
                previousLabel="Forrige side"
                nextLabel="Neste side"
                pageLabel={(p) => `Side ${p}`}
            />
        ),
    },
    render: Standard.render,
};

export const IngenTreff: Story = {
    name: 'Ingen treff',
    args: {
        toolbar: (
            <Table.Toolbar
                filters={<TextField ariaLabel="Søk i tabell" type="search" defaultValue="glassmagasinet" />}
            />
        ),
    },
    render: (args) => (
        <Table {...args}>
            <RegningHeader handling={false} />
            <Table.Body
                empty={<Table.Empty title="Ingen treff">Prøv et annet søk eller endre filtrene.</Table.Empty>}
            />
        </Table>
    ),
};

export const Loading: Story = {
    name: 'Laster',
    args: {
        loading: true,
        loadingLabel: 'Laster',
    },
    render: Standard.render,
};

/** Når hele tabellen lastes og kolonnene ikke er kjent ennå. */
export const Skeleton: Story = {
    args: {
        loading: true,
        loadingLabel: 'Laster regninger',
    },
    render: (args) => (
        <Table {...args}>
            <Table.Skeleton columns={4} rows={3} header />
        </Table>
    ),
};

export const Tetthet: Story = {
    render: (args) => (
        <div className="ix-flex ix-flex-col ix-gap-xl">
            {(['compact', undefined, 'comfortable'] as const).map((density) => (
                <Table
                    key={density ?? 'default'}
                    {...args}
                    title={`Tetthet: ${density ?? 'default'}`}
                    density={density}
                >
                    <RegningHeader />
                    <Table.Body>
                        <RegningRader />
                    </Table.Body>
                </Table>
            ))}
        </div>
    ),
};

/** Smal flate: tabellen ruller vannrett, og første kolonne står fast. */
export const FastKolonne: Story = {
    name: 'Fast første kolonne',
    args: {
        sticky: 'first',
    },
    render: (args) => (
        <div style={{ maxWidth: '20rem' }}>
            <Table {...args}>
                <RegningHeader />
                <Table.Body>
                    <RegningRader />
                </Table.Body>
            </Table>
        </div>
    ),
};

export const HTML: Story = {
    render: () => (
        <ix-table
            class="ix-table"
            loading-label="Laster"
            sort-ascending-label="Sortert etter {column}, stigende"
            sort-descending-label="Sortert etter {column}, synkende"
            sort-none-label="Sortering fjernet"
        >
            <h2 className="ix-table__heading" id="html-regninger">
                Regninger
            </h2>
            <div className="ix-table__frame">
                <div className="ix-table__toolbar">
                    <div className="ix-table__actions">
                        <div className="ix-table__selection" hidden>
                            <span data-field="selected-label">
                                <span data-selected-count></span> valgt
                            </span>
                            <button type="button" className="ix-button" data-variant="tertiary" data-size="sm">
                                Godkjenn
                            </button>
                        </div>
                        <button
                            type="button"
                            className="ix-interactive-icon"
                            data-size="sm"
                            aria-label="Flere handlinger"
                        >
                            <ix-icon name="more_vert" data-size="sm" aria-hidden="true"></ix-icon>
                        </button>
                    </div>
                </div>
                <div className="ix-table__scroll">
                    <table aria-labelledby="html-regninger">
                        <thead>
                            <tr>
                                <th scope="col" className="ix-table__control">
                                    <div className="ix-checkbox">
                                        <input type="checkbox" id="html-alle" />
                                        <label htmlFor="html-alle">
                                            <span className="ix-sr-only">Velg alle regninger</span>
                                        </label>
                                    </div>
                                </th>
                                <th scope="col">
                                    <button type="button" className="ix-table__sort">
                                        Mottaker
                                    </button>
                                </th>
                                <th scope="col" aria-sort="ascending">
                                    <button type="button" className="ix-table__sort">
                                        Forfallsdato
                                    </button>
                                </th>
                                <th scope="col" data-align="end">
                                    Beløp
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {regninger.map((r) => (
                                <tr key={r.id}>
                                    <td className="ix-table__control">
                                        <div className="ix-checkbox">
                                            <input type="checkbox" id={`html-${r.id}`} value={r.id} />
                                            <label htmlFor={`html-${r.id}`}>
                                                <span className="ix-sr-only">Velg {r.mottaker}</span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>{r.mottaker}</td>
                                    <td>{r.forfall}</td>
                                    <td>{r.belop}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="ix-table__footer">
                    <span>Totalt</span>
                    <span>2 697,00</span>
                </div>
            </div>
        </ix-table>
    ),
};
