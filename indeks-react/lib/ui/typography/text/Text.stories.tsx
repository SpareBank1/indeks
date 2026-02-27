import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta = {
    title: 'Typography/Text',
    component: Text,
    tags: ['autodocs'],
    args: {},
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
    args: {},
    name: 'Paragraf',
    render: (args) => {
        return <Text {...args}>Her er et avsnitt med standard tekst.</Text>;
    },
};

export const SmallText: Story = {
    args: { size: 'sm' },
    name: 'Liten tekst',
    render: (args) => {
        return <Text {...args}>Her er litt tekst</Text>;
    },
};

export const EkstraSmallText: Story = {
    args: { size: 'xs' },
    name: 'Ekstra liten tekst',
    render: (args) => {
        return <Text {...args}>Her er litt tekst</Text>;
    },
};
