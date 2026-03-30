import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from '@sb1/indeks-react';

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: { loadingText: 'Laster...' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const WithoutLoadingText: Story = {
  args: { loadingText: undefined },
  render: (args) => {
    return (
      <Spinner {...args} />
    );
  },
};
