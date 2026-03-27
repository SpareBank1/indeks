import type { Meta, StoryObj } from "@storybook/react-vite";

import { LinkText } from '@sb1/indeks-react';

const meta = {
  title: "Typography/LinkText",
  component: LinkText,
 tags: ["autodocs"],
  args: { },
} satisfies Meta<typeof LinkText>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {
  args: {
    href: "#",
    underline: true
  }, 
  render: (args) => {
    return (
      <LinkText {...args}>
        Lenke
      </LinkText>
    );
  }
};