import type { Meta, StoryObj } from "@storybook/react-vite";

import { Form } from '@sb1/indeks-react';

const meta = {
  title: "Form/Form",
  component: Form,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};

export const EgendefinertBarn: Story = {
  args: {},
  render: (args) => {
    return (
      <Form {...args}>
        <p>Jeg er et egedefinert barn</p>
      </Form>
    );
  },
};
