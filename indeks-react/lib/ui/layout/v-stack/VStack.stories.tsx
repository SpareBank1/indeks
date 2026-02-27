import type { Meta, StoryObj } from "@storybook/react-vite";

import { VStack } from "./VStack";

const meta = {
  title: "Layout/VStack",
  component: VStack,
  tags: ["autodocs"],
  args: { children: "Tekst" },
} satisfies Meta<typeof VStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};

export const EgendefinertBarn: Story = {
  args: {},
  render: (args) => {
    return (
      <VStack {...args}>
        <p>Jeg er et egedefinert barn</p>
      </VStack>
    );
  },
};
