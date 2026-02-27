import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextInput } from './TextInput';

const meta = {
  title: 'Form/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  args: { label: 'test' },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};

export const EgendefinertBarn: Story = {
  args: { prefix: 'Prefix', postfix: 'Postfix' },
  render: (args) => {
    return <TextInput {...args} />;
  },
};
