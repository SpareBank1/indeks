import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Tag, HStack, Heading, Card } from '@sb1/indeks-react';

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
    args: { href: 'https://example.com', openInNewTab: true, chevronIcon: 'open_in_new' },
    render: (args) => {
        return (
            <Card padding="md" {...args}>
                <Heading as="h3">Åpner i ny fane</Heading>
                <p>openInNewTab åpner lenken i ny fane, og chevronen er byttet via chevronIcon-propen.</p>
            </Card>
        );
    },
};

export const Clickable: Story = {
    args: { href: 'https://example.com' },
    render: (args) => {
        return (
            <Card padding="md" {...args}>
                <Heading as="h3">Klikkbart kort</Heading>
                <p>Flat med sentrert chevron som affordanse.</p>
            </Card>
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
