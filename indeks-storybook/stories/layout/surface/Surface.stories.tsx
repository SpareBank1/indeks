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

export const BorderMedStatusfarge: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ix-spacing-md)" }}>
      {(["neutral", "info", "success", "warning", "danger"] as const).map((status) => (
        <Surface key={status} {...args} status={status} border="default" radius="md">
          {status}
        </Surface>
      ))}
    </div>
  ),
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
