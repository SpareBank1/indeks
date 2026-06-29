import type { Meta, StoryObj } from '@storybook/react-vite';

import { Chip } from '@sb1/indeks-react';

const meta = {
    title: 'Components/Chip',
    component: Chip,
    tags: ['autodocs'],
    args: { children: 'Chip label' },
    parameters: {
        docs: {
            description: {
                component:
                    'Button chip — en interaktiv chip som fungerer som en knapp og trigger en handling. Har ingen vedvarende valgt tilstand. Størrelse settes med `size` (Medium er standard).',
            },
        },
    },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Small: Story = {
    args: { size: 'sm' },
};

export const Disabled: Story = {
    name: 'Deaktivert',
    args: { disabled: true },
};

export const Group: Story = {
    name: 'Gruppe',
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ix-spacing-sm)' }}>
            <Chip>Alle</Chip>
            <Chip>Sparing</Chip>
            <Chip>Lån</Chip>
            <Chip>Forsikring</Chip>
        </div>
    ),
};

export const HTML: Story = {
    render: () => (
        <button type="button" className="ix-chip">
            Chip label
        </button>
    ),
};
