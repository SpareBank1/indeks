import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressBar } from '@sb1/indeks-react';

const meta = {
    title: 'Components/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs'],
    args: {
        value: 65,
        label: 'Laster opp dokumenter',
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
    },
    name: 'Fullført',
};

export const Error: Story = {
    args: {
        state: 'error',
        value: 40,
    },
    name: 'Feilet',
};

export const UtenLabel: Story = {
    args: {
        value: 30,
        label: undefined,
        'aria-label': 'Laster inn innhold',
    },
    name: 'Uten label',
};

export const HTML: Story = {
    render: () => (
        <ix-progress-bar>
            <label>Laster opp dokumenter</label>
            <progress value="65" max="100"></progress>
        </ix-progress-bar>
    ),
};
