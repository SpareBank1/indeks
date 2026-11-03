import type { Meta, StoryObj } from '@storybook/react-vite';

import { Divider } from '@sb1/indeks-react';

const meta = {
    title: 'Layout/Divider',
    component: Divider,
    tags: ['autodocs'],
    // Divider er generisk (as-prop), så docgen finner ikke variant av seg selv.
    argTypes: {
        variant: { control: 'inline-radio', options: ['default', 'emphasis'] },
    },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Emphasis: Story = {
    args: { variant: 'emphasis' },
};

export const HTML: Story = {
    render: () => (
        <div className="ix-flex ix-flex-col ix-gap-md">
            <hr className="ix-divider" />
            <hr className="ix-divider" data-variant="emphasis" />
        </div>
    ),
};
