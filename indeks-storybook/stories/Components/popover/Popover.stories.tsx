import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Popover } from '@sb1/indeks-react';

const meta = {
    title: 'Components/Popover',
    component: Popover,
    tags: ['autodocs'],
    args: {
        placement: 'top',
        arrow: true,
    },
    decorators: [
        (Story) => (
            <div style={{ padding: '8rem', display: 'flex', justifyContent: 'center' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
    render: (args) => (
        <Popover {...args}>
            <Popover.Trigger>
                <Button>Åpne popover</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Heading>Overskrift</Popover.Heading>
                <Popover.Body>Forklarende tekst som gir brukeren kontekst.</Popover.Body>
                <Popover.Actions>
                    <Button variant="secondary" size="sm">
                        Avbryt
                    </Button>
                    <Button size="sm">Bekreft</Button>
                </Popover.Actions>
            </Popover.Content>
        </Popover>
    ),
};

export const BareTekst: Story = {
    name: 'Bare tekst',
    render: (args) => (
        <Popover {...args} >
            <Popover.Trigger>
                <Button>Vis info</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Body>
                    Dette er en enkel informasjonstekst uten overskrift eller handlinger.
                </Popover.Body>
            </Popover.Content>
        </Popover>
    ),
};

export const UtenHandlinger: Story = {
    name: 'Uten handlinger',
    render: (args) => (
        <Popover {...args} >
            <Popover.Trigger>
                <Button>Mer informasjon</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Heading>Viktig informasjon</Popover.Heading>
                <Popover.Body>
                    Denne popoveren inneholder bare informasjon og har ingen handlingsknapper.
                </Popover.Body>
            </Popover.Content>
        </Popover>
    ),
};

export const UtenPil: Story = {
    name: 'Uten pil',
    args: {
        arrow: false,
    },
    render: (args) => (
        <Popover {...args} >
            <Popover.Trigger>
                <Button>Åpne</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Heading>Ingen pil</Popover.Heading>
                <Popover.Body>Denne popoveren vises uten pilmarkør.</Popover.Body>
            </Popover.Content>
        </Popover>
    ),
};

export const PlasseringTop: Story = {
    name: 'Plassering: top',
    args: {
        placement: 'top',
    },
    render: (args) => (
        <Popover {...args} >
            <Popover.Trigger>
                <Button>Top</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Body>Popover plassert over trigger.</Popover.Body>
            </Popover.Content>
        </Popover>
    ),
};

export const PlasseringBottom: Story = {
    name: 'Plassering: bottom',
    args: {
        placement: 'bottom',
    },
    render: (args) => (
        <Popover {...args} >
            <Popover.Trigger>
                <Button>Bottom</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Body>Popover plassert under trigger.</Popover.Body>
            </Popover.Content>
        </Popover>
    ),
};

export const PlasseringLeft: Story = {
    name: 'Plassering: left',
    args: {
        placement: 'left',
    },
    render: (args) => (
        <Popover {...args} >
            <Popover.Trigger>
                <Button>Left</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Body>Popover plassert til venstre for trigger.</Popover.Body>
            </Popover.Content>
        </Popover>
    ),
};

export const PlasseringRight: Story = {
    name: 'Plassering: right',
    args: {
        placement: 'right',
    },
    render: (args) => (
        <Popover {...args} >
            <Popover.Trigger>
                <Button>Right</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Body>Popover plassert til høyre for trigger.</Popover.Body>
            </Popover.Content>
        </Popover>
    ),
};

export const HTML: Story = {
    render: () => (
        <ix-popover placement="top" open>
            <button className="ix-button">Åpne popover</button>
            <div className="ix-popover__content">
                <div className="ix-popover__heading">Overskrift</div>
                <div className="ix-popover__body">
                    Forklarende tekst som gir brukeren kontekst.
                </div>
                <div className="ix-popover__actions">
                    <button className="ix-button" data-variant="secondary" data-size="sm">
                        Avbryt
                    </button>
                    <button className="ix-button" data-size="sm">
                        Bekreft
                    </button>
                </div>
            </div>
        </ix-popover>
    ),
};
