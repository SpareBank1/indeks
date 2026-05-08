import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressBar } from '@sb1/indeks-react';

const meta = {
    title: 'Components/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs'],
    args: {
        value: 65,
        state: 'active',
        label: 'Laster opp dokumenter',
        supportText: '65 % fullført',
    },
    argTypes: {
        state: {
            control: { type: 'select' },
            options: ['active', 'success', 'error'],
        },
        value: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
        },
    },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Success: Story = {
    args: {
        state: 'success',
        value: 100,
        supportText: 'Alle dokumenter er lastet opp',
    },
    name: 'Fullført',
};

export const Error: Story = {
    args: {
        state: 'error',
        value: 40,
        supportText: 'Opplastingen feilet. Prøv igjen.',
    },
    name: 'Feilet',
};

export const UtenLabel: Story = {
    args: {
        value: 30,
        label: undefined,
        supportText: undefined,
        'aria-label': 'Laster inn innhold',
    },
    name: 'Uten label',
};

export const HTML: Story = {
    render: () => (
        <ix-progress-bar
            value="65"
            data-state="active"
            label="Laster opp dokumenter"
            data-support-text="65 % fullført"
        />
    ),
};
