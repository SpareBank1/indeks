import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from '@sb1/indeks-react';

const meta = {
  title: "Form/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { label: "Label" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};

export const EgendefinertBarn: Story = {
  args: {},
  render: (args) => {
    return <Checkbox {...args}></Checkbox>;
  },
};
