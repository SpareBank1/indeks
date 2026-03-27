import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Icon, Button } from '@sb1/indeks-react';

const meta = {
    title: 'Components/Button',
    component: Button,
    args: { onClick: fn(), children: 'Button' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
    args: { variant: 'secondary' },
};

export const Tertiary: Story = {
    args: { variant: 'tertiary' },
};

export const Danger: Story = {
    args: { danger: true },
};

export const FullWidth: Story = {
    args: { width: 'full' },
    name: 'Full bredde',
};

export const WithIcon: Story = {
    args: {
        size: 'md',
    },
    name: 'Med ikon',
    render: (args) => {
        return (
            <div>
                <Button {...args}>
                    <Icon size={args.size} name="sparing" />
                    Pålogget
                </Button>
            </div>
        );
    },
};

export const IconOnly: Story = {
    args: {
        size: 'md',
        ariaLabel: 'Last opp vedlegg',
    },
    name: 'Ikonknapp',
    render: (args) => {
        return (
            <div>
                <Button {...args}>
                    <Icon size={args.size} name="sparing" />
                </Button>
            </div>
        );
    },
};
