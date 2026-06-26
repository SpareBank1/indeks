import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { InteractiveIcon } from '@sb1/indeks-react';

const meta = {
    title: 'Components/InteractiveIcon',
    component: InteractiveIcon,
    tags: ['autodocs'],
    args: {
        name: 'hjem',
        'aria-label': 'Hjem',
        onClick: fn(),
    },
} satisfies Meta<typeof InteractiveIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Statuser: Story = {
    render: (args) => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <InteractiveIcon {...args} status="default" aria-label="Standard" />
            <InteractiveIcon {...args} status="info" aria-label="Info" />
            <InteractiveIcon {...args} status="success" aria-label="Suksess" />
            <InteractiveIcon {...args} status="warning" aria-label="Advarsel" />
            <InteractiveIcon {...args} status="danger" aria-label="Fare" />
        </div>
    ),
};

export const Størrelser: Story = {
    render: (args) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <InteractiveIcon {...args} size="sm" aria-label="Liten" />
            <InteractiveIcon {...args} size="md" aria-label="Medium" />
            <InteractiveIcon {...args} size="lg" aria-label="Stor" />
            <InteractiveIcon {...args} size="xl" aria-label="Ekstra stor" />
        </div>
    ),
};

export const HTML: Story = {
    render: () => (
        <button type="button" className="ix-interactive-icon" data-status="info" aria-label="Info">
            <ix-icon name="info" aria-hidden="true" class="ix-icon"></ix-icon>
        </button>
    ),
};
