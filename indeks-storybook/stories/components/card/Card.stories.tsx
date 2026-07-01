import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Tag, HStack, VStack, Heading, Card } from '@sb1/indeks-react';

const meta = {
    title: 'Layout/Card',
    component: Card,
    tags: ['autodocs'],
    args: { children: 'Card' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
    render: (args) => {
        return (
            <Card padding="md" {...args}>
                <p>Statisk kort</p>
            </Card>
        );
    },
};

export const Dashed: Story = {
    args: { border: 'dashed' },
    render: (args) => {
        return (
            <Card padding="md" {...args}>
                <p>Kort med stiplet kantlinje</p>
            </Card>
        );
    },
};

export const Statusvarianter: Story = {
    args: {},
    render: () => {
        return (
            <VStack gap="md">
                {(['info', 'success', 'warning', 'danger'] as const).map((status) => (
                    <Card key={status} padding="md" status={status}>
                        {status}
                    </Card>
                ))}
            </VStack>
        );
    },
};

export const CardWithAction: Story = {
    args: {},
    render: (args) => {
        return (
            <Card padding="md" {...args}>
                <Card.Action href="https://example.com">Click me</Card.Action>
            </Card>
        );
    },
};

export const CustomChevron: Story = {
    args: { href: 'https://example.com', chevronIcon: 'apne-ekstern' },
    render: (args) => {
        return (
            <Card padding="md" {...args}>
                <Heading as="h3">Eget chevron-ikon</Heading>
                <p>Overstyrt via chevronIcon-propen.</p>
            </Card>
        );
    },
};

export const ClickableVariants: Story = {
    args: {},
    render: () => {
        return (
            <HStack gap="md">
                <Card padding="md" href="https://example.com">
                    <Heading as="h3">Flat (standard)</Heading>
                    <p>Sentrert, litt større chevron. Ingen skygge.</p>
                </Card>
                <Card padding="md" href="https://example.com" className="ix-card--chevron-shadow">
                    <Heading as="h3">Skygge</Heading>
                    <p>Dagens uttrykk, med løft.</p>
                </Card>
            </HStack>
        );
    },
};

export const CardWithContent: Story = {
    args: {},
    render: (args) => {
        return (
            <Card {...args}>
                <HStack className="indeks-align-center">
                    <Heading as="h2">Heading tekst</Heading>
                    <Tag variant="success" type="subtle" className="indeks-ml-auto">
                        Godkjent
                    </Tag>
                </HStack>
                <p>
                    Hurtigløpende elv med dype stryk bare noen få steder. Den hurtigløpende elven renner i et relativt
                    flatt terreng med sandbanker og småøyer.
                </p>
                <HStack justifyContent="end">
                    <Button variant="secondary">Arkiver</Button>
                    <Button variant="primary">Endre</Button>
                </HStack>
            </Card>
        );
    },
};
