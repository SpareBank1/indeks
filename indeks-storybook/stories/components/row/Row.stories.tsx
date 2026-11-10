import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button, LinkText, Row, Tag, VStack } from '@sb1/indeks-react';

// Inline-grafikk (ingen nettverk) slik at skjermbildetestene er deterministiske.
const portrett = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#d7dce4"/><circle cx="20" cy="15" r="7" fill="#8a95a6"/><path d="M6 40c2-9 8-13 14-13s12 4 14 13Z" fill="#8a95a6"/></svg>'
)}`;

const illustrasjon = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M6 20 20 8l14 12v14H6Z" fill="#b5becc"/><rect x="16" y="24" width="8" height="10" fill="#758090"/></svg>'
)}`;

const meta = {
    title: 'Components/Row',
    component: Row,
    tags: ['autodocs'],
    args: {
        title: 'Brukskonto',
        subtitle: '1234.56.78901',
    },
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Lenke: Story = {
    args: {
        href: '#',
        navigation: 'internal',
        leading: <Row.Leading variant="icon" icon="account_balance" />,
        trailing: <Row.TrailingLabel label="12 345,00 kr" subtitle="Disponibelt" />,
    },
};

export const EksternLenke: Story = {
    name: 'Ekstern lenke',
    args: {
        title: 'Skattemeldingen',
        subtitle: 'Skatteetaten',
        href: '#',
        navigation: 'external',
        externalLabel: '(åpnes i ny fane)',
    },
};

export const Knapp: Story = {
    args: {
        title: 'Varslingsinnstillinger',
        subtitle: undefined,
        onClick: fn(),
        navigation: 'internal',
    },
};

export const MedBeskrivelse: Story = {
    name: 'Med beskrivelse',
    args: {
        title: 'Felleskonto',
        subtitle: 'Delt med Kari Nordmann',
        description: 'Brukes til faste regninger og felles innkjøp hver måned.',
        href: '#',
        navigation: 'internal',
        trailing: <Row.TrailingLabel label="4 200,00 kr" />,
    },
};

export const Leading: Story = {
    render: () => (
        <VStack align="stretch" gap="sm">
            <Row title="Ikon" subtitle="1234.56.78901" leading={<Row.Leading variant="icon" icon="account_balance" />} />
            <Row
                title="Ikon på flate"
                subtitle="1234.56.78901"
                leading={<Row.Leading variant="icon-background" icon="account_balance" />}
            />
            <Row
                title="Ikon på flate med badge"
                subtitle="Delt konto"
                leading={<Row.Leading variant="icon-background" icon="account_balance" badgeIcon="group" />}
            />
            <Row title="Illustrasjon" subtitle="Boliglån" leading={<Row.Leading variant="illustration" src={illustrasjon} alt="" />} />
            <Row title="Kari Nordmann" subtitle="Bilde" leading={<Row.Leading variant="image" src={portrett} alt="" />} />
        </VStack>
    ),
};

export const Trailing: Story = {
    render: () => (
        <VStack align="stretch" gap="sm">
            <Row title="Brukskonto" trailing={<Row.TrailingLabel label="12 345,00 kr" subtitle="Disponibelt" />} />
            <Row
                title="Strømregning"
                subtitle="Forfaller 20. november"
                trailing={<Row.TrailingLabel label="1 240,00 kr" tag={<Tag size="sm" type="subtle">Til godkjenning</Tag>} />}
            />
            <Row
                title="Kontonummer"
                subtitle="1234.56.78901"
                titleId="kontonummer"
                trailingControl={
                    <LinkText as="button" type="button" aria-describedby="kontonummer">
                        Kopier
                    </LinkText>
                }
            />
            <Row title="Fast trekk" subtitle="Ikke satt opp" trailingControl={<Button size="sm" variant="secondary">Legg til</Button>} />
        </VStack>
    ),
};

/** Lang tekst bryter over flere linjer. Blir raden for trang, legger Trailing seg under innholdet. */
export const LangTekst: Story = {
    name: 'Lang tekst',
    // Mobil, så skjermbildet viser at Trailing legger seg under innholdet.
    tags: ['mobile-chromium'],
    args: {
        title: 'Betaling til Sparebank 1 Kredittkort med en lang mottakertekst',
        subtitle: 'Forfaller 20. november 2026, trekkes fra brukskontoen',
        href: '#',
        navigation: 'internal',
        leading: <Row.Leading variant="icon-background" icon="credit_card" />,
        trailing: <Row.TrailingLabel label="-12 345 678,90 kr" subtitle="Til betaling" />,
    },
};

export const HTML: Story = {
    render: () => (
        <VStack align="stretch" gap="sm">
            <div className="ix-row">
                <span className="ix-row__leading" data-variant="icon">
                    <ix-icon name="account_balance" aria-hidden="true" />
                </span>
                <div className="ix-row__body">
                    <div className="ix-row__content">
                        <p className="ix-row__title">
                            <a className="ix-row__action" href="#">
                                Brukskonto
                            </a>
                        </p>
                        <p className="ix-row__subtitle">1234.56.78901</p>
                    </div>
                    <div className="ix-row__trailing">
                        <span className="ix-row__trailing-label">12 345,00 kr</span>
                        <span className="ix-row__trailing-subtitle">Disponibelt</span>
                    </div>
                </div>
                <ix-icon class="ix-row__nav-icon" name="keyboard_arrow_right" aria-hidden="true" />
            </div>
            <div className="ix-row">
                <div className="ix-row__body">
                    <div className="ix-row__content">
                        <p className="ix-row__title">Fast trekk</p>
                        <p className="ix-row__subtitle">Ikke satt opp</p>
                    </div>
                </div>
                <div className="ix-row__control">
                    <button type="button" className="ix-button" data-variant="secondary" data-size="sm">
                        Legg til
                    </button>
                </div>
            </div>
        </VStack>
    ),
};
