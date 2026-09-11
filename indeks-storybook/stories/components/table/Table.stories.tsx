import type { Meta, StoryObj } from '@storybook/react-vite';

import { Table } from '@sb1/indeks-react';

const meta = {
    title: 'Components/Table',
    component: Table,
    tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const transaksjoner = [
    { dato: '01.09.2026', tekst: 'Kiwi Majorstuen', belop: '-249,50' },
    { dato: '28.08.2026', tekst: 'Lønn', belop: '32 500,00' },
    { dato: '15.08.2026', tekst: 'Husleie', belop: '-12 000,00' },
    { dato: '03.08.2026', tekst: 'Ruter', belop: '-853,00' },
];

function Transaksjoner(props: React.ComponentProps<typeof Table>) {
    return (
        <Table {...props}>
            <Table.Caption>Transaksjoner august og september</Table.Caption>
            <Table.Head>
                <Table.Row>
                    <Table.ColumnHeader>Dato</Table.ColumnHeader>
                    <Table.ColumnHeader>Beskrivelse</Table.ColumnHeader>
                    <Table.ColumnHeader>Beløp</Table.ColumnHeader>
                </Table.Row>
            </Table.Head>
            <Table.Body>
                {transaksjoner.map((rad) => (
                    <Table.Row key={rad.dato}>
                        <Table.RowHeader>{rad.dato}</Table.RowHeader>
                        <Table.Cell>{rad.tekst}</Table.Cell>
                        <Table.Cell>{rad.belop} kr</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

/**
 * Tabellen er ren semantisk HTML. CSS-en styler `th` og `td` direkte, så en
 * håndskrevet `<table class="ix-table">` ser riktig ut uten en eneste klasse inni.
 */
export const Standard: Story = {
    render: () => <Transaksjoner />,
};

/** `density="sm"` strammer inn radhøyden for tabeller med mange rader. */
export const Tett: Story = {
    render: () => <Transaksjoner density="sm" />,
};

/** `density="lg"` gir mer luft. Teksten skaleres ikke opp — bare radhøyden endres. */
export const Luftig: Story = {
    render: () => <Transaksjoner density="lg" />,
};

/** Striper gjør det lettere å følge en rad bortover i brede tabeller. */
export const Zebra: Story = {
    render: () => <Transaksjoner zebra hover />,
};

/**
 * Overskriftsraden følger med ved vertikal scroll. Høydebegrensningen må stå på
 * scroll-rammen selv (`scrollStyle`), ikke på en wrapper utenfor: rammen har
 * `overflow-x: auto`, og CSS gjør da også den vertikale aksen til `auto`, så den er
 * scroll-containeren i begge retninger.
 */
export const FestetOverskrift: Story = {
    render: () => <Transaksjoner stickyHeader zebra scrollStyle={{ maxHeight: '8rem' }} />,
};

/**
 * Sorterbare kolonner. `clientSort` lar atferds-modulen flytte radene i DOM-en,
 * som er trygt her fordi radene er statiske. Er radene datadrevet, la `clientSort`
 * stå av og sorter egne data på `onSort` i stedet.
 *
 * Merk `sortValue` på beløpskolonnen: «32 500,00 kr» sorterer ikke som tekst, så
 * den oppgir råverdien.
 */
export const Sorterbar: Story = {
    render: () => (
        <Table
            clientSort
            sortAscendingText="Sortert etter {column}, stigende"
            sortDescendingText="Sortert etter {column}, synkende"
        >
            <Table.Caption>Transaksjoner — klikk en overskrift for å sortere</Table.Caption>
            <Table.Head>
                <Table.Row>
                    <Table.ColumnHeader sortable sortType="date" sortKey="dato">
                        Dato
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable sortKey="tekst">
                        Beskrivelse
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable sortType="number" sortKey="belop">
                        Beløp
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Head>
            <Table.Body>
                {transaksjoner.map((rad) => (
                    <Table.Row key={rad.dato}>
                        <Table.RowHeader sortValue={rad.dato.split('.').reverse().join('-')}>
                            {rad.dato}
                        </Table.RowHeader>
                        <Table.Cell>{rad.tekst}</Table.Cell>
                        <Table.Cell sortValue={rad.belop.replace(/\s/g, '').replace(',', '.')}>
                            {rad.belop} kr
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    ),
};

/**
 * Sammenligningstabell. Den anbefalte kolonnen utheves med `<Table.Column highlighted />`,
 * og `stickyColumn` holder egenskapsnavnene synlige når produktkolonnene scrolles
 * på smal skjerm.
 *
 * Uthevingen kan ikke kombineres med `zebra`, `hover` eller `stickyHeader`: tabeller
 * maler celle- og radbakgrunn over kolonnebakgrunnen, så uthevingen ville forsvunnet.
 */
export const Sammenligning: Story = {
    render: () => (
        <Table stickyColumn>
            <Table.Caption>Sammenlign kontotyper</Table.Caption>
            <Table.ColumnGroup>
                <Table.Column />
                <Table.Column />
                <Table.Column highlighted />
                <Table.Column />
            </Table.ColumnGroup>
            <Table.Head>
                <Table.Row>
                    <Table.ColumnHeader>Egenskap</Table.ColumnHeader>
                    <Table.ColumnHeader>Brukskonto</Table.ColumnHeader>
                    <Table.ColumnHeader>Sparekonto</Table.ColumnHeader>
                    <Table.ColumnHeader>BSU</Table.ColumnHeader>
                </Table.Row>
            </Table.Head>
            <Table.Body>
                <Table.Row>
                    <Table.RowHeader>Rente</Table.RowHeader>
                    <Table.Cell>0,10 %</Table.Cell>
                    <Table.Cell>2,40 %</Table.Cell>
                    <Table.Cell>3,10 %</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.RowHeader>Månedspris</Table.RowHeader>
                    <Table.Cell>0 kr</Table.Cell>
                    <Table.Cell>0 kr</Table.Cell>
                    <Table.Cell>0 kr</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.RowHeader>Frie uttak</Table.RowHeader>
                    <Table.Cell>Ubegrenset</Table.Cell>
                    <Table.Cell>Ubegrenset</Table.Cell>
                    <Table.Cell>Ingen</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    ),
};

/**
 * Brede tabeller scroller i sin egen container i stedet for å presse siden bred
 * (WCAG 1.4.10). Containeren er tabbbar, slik at tastaturbrukere også kan scrolle
 * den (WCAG 2.1.1), og navnet arves fra `<Table.Caption>`.
 */
export const MangeKolonner: Story = {
    render: () => (
        <Table stickyColumn zebra style={{ minWidth: '56rem' }}>
            <Table.Caption>Månedsoversikt</Table.Caption>
            <Table.Head>
                <Table.Row>
                    <Table.ColumnHeader>Konto</Table.ColumnHeader>
                    {['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli'].map((m) => (
                        <Table.ColumnHeader key={m}>{m}</Table.ColumnHeader>
                    ))}
                </Table.Row>
            </Table.Head>
            <Table.Body>
                {['Brukskonto', 'Sparekonto', 'BSU'].map((konto, radIndex) => (
                    <Table.Row key={konto}>
                        <Table.RowHeader>{konto}</Table.RowHeader>
                        {Array.from({ length: 7 }, (_, i) => (
                            <Table.Cell key={i}>{(radIndex + 1) * (i + 1) * 1000} kr</Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    ),
};

/** Tabellen med tfoot for sumrad. */
export const MedSumrad: Story = {
    render: () => (
        <Table>
            <Table.Caption>Gebyrer</Table.Caption>
            <Table.Head>
                <Table.Row>
                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                    <Table.ColumnHeader>Beløp</Table.ColumnHeader>
                </Table.Row>
            </Table.Head>
            <Table.Body>
                <Table.Row>
                    <Table.RowHeader>Årsgebyr kort</Table.RowHeader>
                    <Table.Cell>250,00 kr</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.RowHeader>Uttak utland</Table.RowHeader>
                    <Table.Cell>45,00 kr</Table.Cell>
                </Table.Row>
            </Table.Body>
            <Table.Foot>
                <Table.Row>
                    <Table.RowHeader>Sum</Table.RowHeader>
                    <Table.Cell>295,00 kr</Table.Cell>
                </Table.Row>
            </Table.Foot>
        </Table>
    ),
};

/**
 * Ren HTML uten React. Atferds-modulen i `@sb1/indeks-web` plukker opp
 * `data-ix-sort`-knappene, og `data-ix-sort-client` lar den flytte radene — noe
 * ren HTML trygt kan be om, siden ingen rammeverk eier nodene.
 */
export const HTML: Story = {
    render: () => (
        <div
            className="ix-table-scroll"
            role="region"
            aria-labelledby="html-tabell-caption"
            tabIndex={0}
        >
            <table
                className="ix-table"
                data-zebra=""
                data-ix-sort-client=""
                data-ix-sort-ascending-text="Sortert etter {column}, stigende"
                data-ix-sort-descending-text="Sortert etter {column}, synkende"
            >
                <caption id="html-tabell-caption">Transaksjoner</caption>
                <thead>
                    <tr>
                        <th scope="col">
                            <button type="button" data-ix-sort="date">
                                Dato
                            </button>
                        </th>
                        <th scope="col">
                            <button type="button" data-ix-sort="number">
                                Beløp
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row" data-sort-value="2026-09-01">
                            01.09.2026
                        </th>
                        <td data-sort-value="-249.5">-249,50 kr</td>
                    </tr>
                    <tr>
                        <th scope="row" data-sort-value="2026-08-28">
                            28.08.2026
                        </th>
                        <td data-sort-value="32500">32 500,00 kr</td>
                    </tr>
                    <tr>
                        <th scope="row" data-sort-value="2026-08-15">
                            15.08.2026
                        </th>
                        <td data-sort-value="-12000">-12 000,00 kr</td>
                    </tr>
                </tbody>
            </table>
        </div>
    ),
};
