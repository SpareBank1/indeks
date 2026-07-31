import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, DropdownMenu, Icon } from '@sb1/indeks-react';

const meta = {
    title: 'Components/DropdownMenu',
    component: DropdownMenu,
    tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenu.Trigger>
                <Button variant="secondary">Handlinger</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => alert('Rediger')}>Rediger</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => alert('Dupliser')}>Dupliser</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => alert('Del')}>Del</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};

export const WithIcons: Story = {
    name: 'Med ikoner',
    render: () => (
        <DropdownMenu>
            <DropdownMenu.Trigger>
                <Button variant="secondary">Handlinger</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item icon={<Icon name="edit" />} onSelect={() => alert('Rediger')}>
                    Rediger
                </DropdownMenu.Item>
                <DropdownMenu.Item icon={<Icon name="copy" />} onSelect={() => alert('Dupliser')}>
                    Dupliser
                </DropdownMenu.Item>
                <DropdownMenu.Item icon={<Icon name="share" />} onSelect={() => alert('Del')}>
                    Del
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};

export const WithDanger: Story = {
    name: 'Med farlig handling',
    render: () => (
        <DropdownMenu>
            <DropdownMenu.Trigger>
                <Button variant="secondary">Handlinger</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => alert('Rediger')}>Rediger</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => alert('Dupliser')}>Dupliser</DropdownMenu.Item>
                <DropdownMenu.Divider />
                <DropdownMenu.Item danger onSelect={() => alert('Slett')}>
                    Slett
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};

export const WithDivider: Story = {
    name: 'Med gruppering',
    render: () => (
        <DropdownMenu>
            <DropdownMenu.Trigger>
                <Button variant="secondary">Handlinger</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => alert('Klipp')}>Klipp ut</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => alert('Kopier')}>Kopier</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => alert('Lim')}>Lim inn</DropdownMenu.Item>
                <DropdownMenu.Divider />
                <DropdownMenu.Item onSelect={() => alert('Angre')}>Angre</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => alert('Gjør om')}>Gjør om</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};

export const WithSubmenu: Story = {
    name: 'Med submeny',
    render: () => (
        <DropdownMenu>
            <DropdownMenu.Trigger>
                <Button variant="secondary">Handlinger</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => alert('Rediger')}>Rediger</DropdownMenu.Item>
                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>Eksporter som</DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                        <DropdownMenu.Item onSelect={() => alert('PDF')}>PDF</DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={() => alert('CSV')}>CSV</DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={() => alert('Excel')}>Excel</DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Divider />
                <DropdownMenu.Item danger onSelect={() => alert('Slett')}>
                    Slett
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};

/**
 * Disabled-elementer er unntatt fra WCAG 1.4.3 kontrastkrav.
 */
export const Disabled: Story = {
    name: 'Med deaktiverte elementer',
    render: () => (
        <DropdownMenu>
            <DropdownMenu.Trigger>
                <Button variant="secondary">Handlinger</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => alert('Rediger')}>Rediger</DropdownMenu.Item>
                <DropdownMenu.Item disabled>Dupliser (ikke tilgjengelig)</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => alert('Del')}>Del</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    ),
};

export const Placements: Story = {
    name: 'Plasseringer',
    render: () => (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', padding: '4rem' }}>
            <DropdownMenu placement="bottom-start">
                <DropdownMenu.Trigger>
                    <Button variant="secondary">bottom-start</Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item>Item 1</DropdownMenu.Item>
                    <DropdownMenu.Item>Item 2</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>

            <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                    <Button variant="secondary">bottom-end</Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item>Item 1</DropdownMenu.Item>
                    <DropdownMenu.Item>Item 2</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>

            <DropdownMenu placement="top-start">
                <DropdownMenu.Trigger>
                    <Button variant="secondary">top-start</Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item>Item 1</DropdownMenu.Item>
                    <DropdownMenu.Item>Item 2</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>

            <DropdownMenu placement="top-end">
                <DropdownMenu.Trigger>
                    <Button variant="secondary">top-end</Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item>Item 1</DropdownMenu.Item>
                    <DropdownMenu.Item>Item 2</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>
        </div>
    ),
};

/**
 * Viser hvordan komponenten kan brukes med ren HTML og web component.
 */
export const HTML: Story = {
    render: () => (
        <ix-dropdown>
            <button className="ix-button" data-variant="secondary">
                Handlinger
            </button>
            <div className="ix-dropdown__menu" role="menu">
                <button className="ix-dropdown__item" role="menuitem">
                    Rediger
                </button>
                <button className="ix-dropdown__item" role="menuitem">
                    Dupliser
                </button>
                <hr className="ix-dropdown__divider" role="separator" />
                <button className="ix-dropdown__item" role="menuitem" data-danger="">
                    Slett
                </button>
            </div>
        </ix-dropdown>
    ),
};
