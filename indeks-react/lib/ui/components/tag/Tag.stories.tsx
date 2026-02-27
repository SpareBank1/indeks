import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '../../icons';
import { Tag } from './Tag';

const meta = {
    title: 'Components/Tag',
    component: Tag,
    args: { children: 'Tekst' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const WithIcon: Story = {
    args: {},
    name: 'Med ikon',
    render: (args) => {
        return (
            <Tag {...args}>
                <Icon size="sm" name="sparing" />
                Pålogget
            </Tag>
        );
    },
};
