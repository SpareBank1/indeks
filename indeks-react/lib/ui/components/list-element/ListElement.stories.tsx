import type { Meta, StoryObj } from "@storybook/react-vite";

import { ListElement } from "./ListElement";

const meta = {
  title: "Components/ListElement",
  component: ListElement,
  tags: ["autodocs"],
  args: { children: "Tekst" },
} satisfies Meta<typeof ListElement>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};

export const EgendefinertBarn: Story = {
  args: {},
  render: (args) => {
    return (
      <ListElement {...args}>
        <p>Jeg er et egedefinert barn</p>
      </ListElement>
    );
  },
};