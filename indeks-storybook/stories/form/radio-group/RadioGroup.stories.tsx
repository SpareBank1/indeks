import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioGroup } from '@sb1/indeks-react';

const meta = {
  title: "Form/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    legend: "Velg et alternativ",
    options: [
      { value: "option1", label: "Alternativ 1" },
      { value: "option2", label: "Alternativ 2" },
      { value: "option3", label: "Alternativ 3" },
    ],
    description: "Dette er en beskrivelse av radio-gruppen.",
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};

export const EgendefinertBarn: Story = {
  args: {},
  render: (args) => {
    return <RadioGroup {...args}></RadioGroup>;
  },
};
