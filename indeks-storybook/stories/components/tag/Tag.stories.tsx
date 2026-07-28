import type { Meta, StoryObj } from '@storybook/react-vite';

import { HStack, Icon, Tag, VStack } from '@sb1/indeks-react';

const meta = {
    title: 'Components/Tag',
    component: Tag,
    tags: ['autodocs'],
    args: {
        children: 'Label',
        variant: 'neutral',
        type: 'emphasis',
        size: 'md',
    },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Info: Story = {
    args: { variant: 'info' },
};

export const Success: Story = {
    args: { variant: 'success' },
};

export const Warning: Story = {
    args: { variant: 'warning' },
};

export const Danger: Story = {
    args: { variant: 'danger' },
};

export const Subtle: Story = {
    args: { variant: 'info', type: 'subtle' },
};

export const MedVenstreIkon: Story = {
    name: 'Med venstre ikon',
    render: (args) => (
        <Tag {...args}>
            <Icon size="sm" name="home" />
            Label
        </Tag>
    ),
};

export const MedHoyreIkon: Story = {
    name: 'Med høyre ikon',
    render: (args) => (
        <Tag {...args}>
            Label
            <Icon size="sm" name="home" />
        </Tag>
    ),
};

/** Alle statuser × emphasis/subtle, i standardstørrelse. */
export const Oversikt: Story = {
    render: () => {
        const statuses = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
        return (
            <VStack gap="lg">
                {(['emphasis', 'subtle'] as const).map((type) => (
                    <HStack key={type} gap="sm">
                        {statuses.map((variant) => (
                            <Tag key={variant} variant={variant} type={type}>
                                Label
                            </Tag>
                        ))}
                    </HStack>
                ))}
            </VStack>
        );
    },
};

/**
 * Ren HTML uten React-wrapper. Status velges med `data-status` (kobler
 * fargevariablene automatisk), profil med `data-variant`, størrelse med
 * `data-size`. Ikon skrives som `<ix-icon>` med `class="ix-icon"`.
 */
export const HTML: Story = {
    render: () => (
        <HStack gap="sm">
            <span className="ix-tag" data-status="info" data-variant="emphasis">
                Label
            </span>
            <span className="ix-tag" data-status="info" data-variant="subtle">
                <ix-icon name="home" aria-hidden="true" class="ix-icon" />
                Label
            </span>
            <span className="ix-tag" data-status="danger" data-variant="subtle" data-size="sm">
                Label
            </span>
        </HStack>
    ),
};
