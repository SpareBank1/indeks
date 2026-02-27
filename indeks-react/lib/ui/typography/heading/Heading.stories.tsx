import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heading } from './Heading';

const meta = {
    title: 'Typography/Overskrift',
    component: Heading,
    tags: ['autodocs'],
    args: { children: 'Overskrift' },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const One: Story = {
    args: { as: 'h1' },
    name: 'Overskrifter',
    render: (args) => {
        return (
            <>
                <Heading {...args} as="h1">
                    Overskrift 1
                </Heading>
                <Heading {...args} as="h2">
                    Overskrift 2
                </Heading>
                <Heading {...args} as="h3">
                    Overskrift 3
                </Heading>
                <Heading {...args} as="h4">
                    Overskrift 4
                </Heading>
                <Heading {...args} as="h5">
                    Overskrift 5
                </Heading>
                <Heading {...args} as="h6">
                    Overskrift 6
                </Heading>
            </>
        );
    },
};

export const Preview: Story = {
    args: { as: 'h1' },
    name: 'Preview',
    render: (args) => {
        return (
            <>
                <Heading {...args}>Dette er en overskrift</Heading>
            </>
        );
    },
};
