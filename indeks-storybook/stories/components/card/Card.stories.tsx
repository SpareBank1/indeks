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

export const Emphasis: Story = {
    args: {
        surfaceColor: 'main',
    },
    render: (args) => {
        return (
            <Card {...args}>
                <p>Emphasis</p>
            </Card>
        );
    },
};

export const CardWithAction: Story = {
    args: {
        surfaceColor: 'main',
    },
    render: (args) => {
        return (
            <Card {...args}>
                <Card.Action href="https://example.com">Click me</Card.Action>
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
