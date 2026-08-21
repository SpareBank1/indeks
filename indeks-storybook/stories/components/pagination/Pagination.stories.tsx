import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Pagination, Icon } from '@sb1/indeks-react';

const meta = {
    title: 'Components/Pagination',
    component: Pagination,
    tags: ['autodocs'],
    args: {
        count: 10,
        previousLabel: 'Forrige',
        nextLabel: 'Neste',
        ariaLabel: 'Sidenavigering',
        pageLabel: (page: number) => `Side ${page}`,
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function PaginationDemo({
    count = 10,
    initialPage = 1,
    prevNextTexts = false,
}: {
    count?: number;
    initialPage?: number;
    prevNextTexts?: boolean;
}) {
    const [page, setPage] = useState(initialPage);
    return (
        <Pagination
            page={page}
            count={count}
            onPageChange={setPage}
            previousLabel="Forrige"
            nextLabel="Neste"
            ariaLabel="Sidenavigering"
            pageLabel={(p) => `Side ${p}`}
            prevNextTexts={prevNextTexts}
        />
    );
}

/**
 * Pagination brukes for å dele inn større mengder innhold i flere sider og gjøre
 * det enklere å navigere mellom dem. Komponenten viser sidetall, forrige/neste-
 * knapper og ellipsis ved mange sider.
 */
export const Standard: Story = {
    render: () => <PaginationDemo />,
};

/**
 * Når brukeren er midt i pagineringen, vises ellipsis (...) for å indikere
 * at det finnes flere sider mellom de synlige sidetallene.
 */
export const MedEllipsis: Story = {
    name: 'Med ellipsis',
    render: () => <PaginationDemo count={20} initialPage={5} />,
};

/**
 * Vis tekst på forrige/neste-knappene ved å sette `prevNextTexts` til `true`.
 * Dette kan være nyttig på desktop hvor det er god plass.
 */
export const MedTekstPaKnapper: Story = {
    name: 'Med tekst på knapper',
    render: () => <PaginationDemo prevNextTexts />,
};

/**
 * Når det er få sider (her 5), vises alle sidetall uten ellipsis.
 */
export const FaSider: Story = {
    name: 'Få sider',
    render: () => <PaginationDemo count={5} />,
};

/**
 * Første side har forrige-knappen deaktivert.
 */
export const ForsteSide: Story = {
    name: 'Første side',
    args: {
        page: 1,
    },
};

/**
 * Siste side har neste-knappen deaktivert.
 */
export const SisteSide: Story = {
    name: 'Siste side',
    args: {
        page: 10,
    },
};

/**
 * Ren HTML uten React-wrapper. Merk at forrige/neste-knapper trenger `data-type`
 * for riktig styling, og aktiv side markeres med `aria-current="page"`.
 */
export const HTML: Story = {
    render: () => (
        <nav className="ix-pagination" aria-label="Sidenavigering">
            <ul className="ix-pagination__list">
                <li>
                    <button
                        type="button"
                        className="ix-pagination__button"
                        data-type="prev"
                        disabled
                        aria-label="Forrige side"
                    >
                        <Icon name="chevron_left" aria-hidden="true" />
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className="ix-pagination__button"
                        aria-current="page"
                        aria-label="Side 1"
                    >
                        1
                    </button>
                </li>
                <li>
                    <button type="button" className="ix-pagination__button" aria-label="Side 2">
                        2
                    </button>
                </li>
                <li>
                    <button type="button" className="ix-pagination__button" aria-label="Side 3">
                        3
                    </button>
                </li>
                <li>
                    <span className="ix-pagination__ellipsis" aria-hidden="true">
                        <Icon name="more_horiz" />
                    </span>
                </li>
                <li>
                    <button type="button" className="ix-pagination__button" aria-label="Side 10">
                        10
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className="ix-pagination__button"
                        data-type="next"
                        aria-label="Neste side"
                    >
                        <Icon name="chevron_right" aria-hidden="true" />
                    </button>
                </li>
            </ul>
        </nav>
    ),
};
