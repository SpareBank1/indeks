import type { Meta, StoryObj } from "@storybook/react-vite";

import { VStack } from '@sb1/indeks-react';

const meta = {
  title: "Layout/VStack",
  component: VStack,
  tags: ["autodocs"],
  args: {
    gap: "md",
    children: (
      <>
        <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Element 1</div>
        <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Element 2</div>
        <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Element 3</div>
      </>
    ),
  },
} satisfies Meta<typeof VStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const AlignCenter: Story = {
  args: { align: "center" },
};

export const AlignEnd: Story = {
  args: { align: "end" },
};

export const HTML: Story = {
  render: () => (
    <div dangerouslySetInnerHTML={{ __html: `
      <ix-stack gap="md">
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">Element 1</div>
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">Element 2</div>
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">Element 3</div>
      </ix-stack>
    `}} />
  ),
};
