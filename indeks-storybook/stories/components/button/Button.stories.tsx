import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, Icon } from '@sb1/indeks-react';

const meta = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    args: { onClick: fn(), children: 'Knapp' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Secondary: Story = {
    args: { variant: 'secondary' },
};

export const Tertiary: Story = {
    args: { variant: 'tertiary' },
};

/**
 * Tertiærknapp brukt alene skal alltid kombineres med ikon så den
 * fremstår som en handling og ikke forveksles med vanlig tekst.
 */
export const TertiaryWithIcon: Story = {
    args: { variant: 'tertiary' },
    name: 'Tertiær med ikon',
    render: (args) => (
        <Button {...args}>
            <Icon size={args.size} name="hjem" />
            Rediger
        </Button>
    ),
};

export const Danger: Story = {
    args: { danger: true },
};

export const FullWidth: Story = {
    args: { width: 'full' },
    name: 'Full bredde',
};

/**
 * Disabled-knapper er unntatt fra WCAG 1.4.3 kontrastkrav.
 * Vurder om det er bedre å vise en forklaring til brukeren fremfor å deaktivere knappen.
 */
export const Disabled: Story = {
    args: { disabled: true },
    name: 'Deaktivert',
};

export const Loading: Story = {
    args: { loading: true, loadingLabel: 'Sender inn...' },
    name: 'Laster',
};

export const WithIcon: Story = {
    args: { size: 'md' },
    name: 'Med ikon',
    render: (args) => (
        <Button {...args}>
            <Icon size={args.size} name="sparing" />
            Pålogget
        </Button>
    ),
};

export const IconOnly: Story = {
    args: {
        size: 'md',
        'aria-label': 'Gå til sparing',
    },
    name: 'Ikonknapp',
    render: (args) => (
        <Button {...args}>
            <Icon size={args.size} name="sparing" />
        </Button>
    ),
};
