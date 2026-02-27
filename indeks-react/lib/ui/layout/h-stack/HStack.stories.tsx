import type { Meta, StoryObj } from "@storybook/react-vite";

import { HStack } from "./HStack";

const meta = {
  title: "Layout/HStack",
  component: HStack,
  tags: ["autodocs"],
  args: { children: "Tekst" },
} satisfies Meta<typeof HStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};

export const EgendefinertBarn: Story = {
  args: {},
  render: (args) => {
    return (
      <HStack {...args}>
        <p>Jeg er et egedefinert barn</p>
      </HStack>
    );
  },
};
