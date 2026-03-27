import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from '@sb1/indeks-react';

const meta = {
  title: "Layout/Divider",
  component: Divider,
  tags: ["autodocs"],
  args: { children: "Tekst" },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};

export const EgendefinertBarn: Story = {
  args: {},
  render: (args) => {
    return (
      <Divider {...args}>
        <p>Jeg er et egedefinert barn</p>
      </Divider>
    );
  },
};