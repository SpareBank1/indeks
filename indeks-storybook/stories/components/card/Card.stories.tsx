import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card, Icon, Tag, VStack } from '@sb1/indeks-react';

// Inline-grafikk (ingen nettverk) slik at skjermbildetestene er deterministiske.
const landskap = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 200"><rect width="350" height="200" fill="#d7dce4"/><circle cx="270" cy="60" r="28" fill="#b5becc"/><path d="M0 200 Q120 90 240 200Z" fill="#a0abbb"/><path d="M140 200 Q260 110 350 170V200Z" fill="#8a95a6"/></svg>'
)}`;

const Illustrasjon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M6 20 20 8l14 12v14H6Z" fill="#b5becc" />
        <rect x="16" y="24" width="8" height="10" fill="#758090" />
    </svg>
);

const meta = {
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
    args: {
        href: '#',
        title: 'Brukskonto',
        subtitle: '1234 56 78901',
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const SmallLeading: Story = {
    name: 'Small med leading',
    render: () => (
        <VStack align="stretch" gap="md">
            <Card href="#" subtitle="1234 56 78901" title="Ikon" leading={<Icon name="account_balance" />} leadingType="icon" />
            <Card
                href="#"
                subtitle="1234 56 78901"
                title="Ikon med bakgrunn"
                leading={<Icon name="account_balance" />}
                leadingType="icon-background"
            />
            <Card href="#" subtitle="1234 56 78901" title="Illustrasjon" leading={<Illustrasjon size={40} />} leadingType="illustration" />
        </VStack>
    ),
};

export const Dashed: Story = {
    args: {
        appearance: 'dashed',
        title: 'Opprett ny sparekonto',
        subtitle: 'Spar på konto, i fond eller til pensjon',
        leading: <Icon name="add_circle" />,
    },
};

export const LargeVertical: Story = {
    name: 'Large vertikal',
    args: {
        variant: 'large-vertical',
        title: 'Boliglån',
        subtitle: 'Fra 4,9 % effektiv rente',
        description: 'Se hva du kan låne, og søk om finansieringsbevis.',
        media: <img src={landskap} alt="" />,
        mediaType: 'image',
        tag: <Tag variant="info">Nyhet</Tag>,
    },
    render: (args) => (
        <div style={{ maxWidth: 350 }}>
            <Card {...args} />
        </div>
    ),
};

export const LargeHorizontal: Story = {
    name: 'Large horisontal',
    args: {
        variant: 'large-horizontal',
        title: 'Forsikring for hjemmet',
        subtitle: 'Innbo og hus',
        description: 'Beskytt det som betyr mest.',
        media: <Illustrasjon size={80} />,
        mediaType: 'illustration',
        tag: <Tag>Anbefalt</Tag>,
    },
};

export const Ekstern: Story = {
    name: 'Ekstern lenke',
    args: {
        href: 'https://www.sparebank1.no',
        title: 'Les mer hos SpareBank 1',
        subtitle: 'sparebank1.no',
        external: true,
        externalLabel: '(åpnes i ny fane)',
    },
};

/** WCAG 1.4.10: alle varianter skal fungere ved 320px uten horisontal scroll. */
export const Mobil320: Story = {
    name: 'Mobil 320px',
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <VStack align="stretch" gap="md">
                <Card
                    href="#"
                    subtitle="1234 56 78901"
                    title="Et langt kontonavn som må brytes over flere linjer"
                    leading={<Icon name="account_balance" />}
                    leadingType="icon-background"
                />
                <Card
                    href="#"
                    variant="large-horizontal"
                    title="Forsikring"
                    subtitle="Innbo og hus"
                    description="Beskytt det som betyr mest."
                    media={<Illustrasjon size={60} />}
                    mediaType="illustration"
                />
            </VStack>
        </div>
    ),
};

export const HTML: Story = {
    render: () => (
        <VStack align="stretch" gap="md">
            <div className="ix-card" data-variant="small">
                <span className="ix-card__leading" data-type="icon-background">
                    <ix-icon name="account_balance"></ix-icon>
                </span>
                <div className="ix-card__content">
                    <div className="ix-card__heading">
                        <h3 className="ix-card__title">
                            <a className="ix-card__link" href="#">
                                Brukskonto
                            </a>
                        </h3>
                        <ix-icon class="ix-card__nav-icon" name="arrow_forward" aria-hidden="true"></ix-icon>
                    </div>
                    <p className="ix-card__subtitle">1234 56 78901</p>
                </div>
            </div>
            <div className="ix-card" data-variant="large-vertical" style={{ maxWidth: 350 }}>
                <div className="ix-card__media" data-type="image">
                    <img src={landskap} alt="" />
                </div>
                <div className="ix-card__content">
                    <div className="ix-card__heading">
                        <h3 className="ix-card__title">
                            <a className="ix-card__link" href="https://www.sparebank1.no" target="_blank" rel="noopener noreferrer">
                                Boliglån <span className="ix-sr-only">(åpnes i ny fane)</span>
                            </a>
                        </h3>
                        <ix-icon class="ix-card__nav-icon" name="open_in_new" aria-hidden="true"></ix-icon>
                    </div>
                    <p className="ix-card__subtitle">Fra 4,9 % effektiv rente</p>
                    <p className="ix-card__description">Se hva du kan låne, og søk om finansieringsbevis.</p>
                    <div className="ix-card__tags">
                        <span className="ix-tag" data-status="info" data-variant="emphasis">
                            Nyhet
                        </span>
                    </div>
                </div>
            </div>
        </VStack>
    ),
};
