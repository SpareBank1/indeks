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

export const Default: Story = {
  args: {},
};

export const MedSurfaceFarge: Story = {
  args: { surfaceColor: "info", radius: "md" },
};

export const MedBorder: Story = {
  args: { border: "default", radius: "sm" },
};

export const FlexLayout: Story = {
  args: {
    surfaceColor: "main",
    border: "default",
    radius: "md",
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
