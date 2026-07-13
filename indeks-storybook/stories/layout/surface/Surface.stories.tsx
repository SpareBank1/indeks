import type { Meta, StoryObj } from "@storybook/react-vite";

import { Surface } from '@sb1/indeks-react';

const meta = {
  title: "Layout/Surface",
  component: Surface,
  tags: ["autodocs"],
  args: { padding: "md", children: "Surface" },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {},
};

export const MedStatusfarge: Story = {
  args: { status: "info", radius: "md" },
};

export const MedBorder: Story = {
  args: { border: "default", radius: "sm" },
};

export const FlexLayout: Story = {
  args: {
    border: "default",
    radius: "md",
    direction: "row",
    justifyContent: "space-between",
    gap: "sm",
    children: (
      <>
        <span>Første</span>
        <span>Andre</span>
        <span>Tredje</span>
      </>
    ),
  },
};
