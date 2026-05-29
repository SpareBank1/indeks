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

/**
 * Spinneren arver knappens tekstfarge via `currentcolor`, så den får riktig
 * kontrast i alle varianter — også på fylt primary-bakgrunn.
 */
export const LoadingVariants: Story = {
    name: 'Laster (alle varianter)',
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button loading loadingLabel="Sender...">
                Primary
            </Button>
            <Button variant="secondary" loading loadingLabel="Sender...">
                Secondary
            </Button>
            <Button variant="tertiary" loading loadingLabel="Sender...">
                Tertiary
            </Button>
            <Button danger loading loadingLabel="Sletter...">
                Danger
            </Button>
        </div>
    ),
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

/**
 * Knapp med bare ikon som innhold. `iconOnly` gjør knappen rund og kvadratisk.
 * Bruk alltid `aria-label` for å beskrive handlingen.
 */
export const IconOnly: Story = {
    args: {
        size: 'md',
        iconOnly: true,
        'aria-label': 'Gå til sparing',
    },
    name: 'Ikonknapp',
    render: (args) => (
        <Button {...args}>
            <Icon size={args.size} name="sparing" />
        </Button>
    ),
};
