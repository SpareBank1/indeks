import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box } from '@sb1/indeks-react';

const meta = {
  title: "Layout/Box",
  component: Box,
  tags: ["autodocs"],
  args: { children: "Box" },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Emphasis: Story = {
  args: {},
  render: (args) => {
    return (
      <Box {...args}>
        <p>Emphasis</p>
      </Box>
    );
  },
};
