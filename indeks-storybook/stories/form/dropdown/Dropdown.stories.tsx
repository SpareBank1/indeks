import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dropdown } from '@sb1/indeks-react';

const meta = {
  title: 'Form/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: { label: 'Label', placeholder: 'Select an option' },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};
