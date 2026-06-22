import type { Meta, StoryObj } from "@storybook/react-vite";

import { HStack } from '@sb1/indeks-react';

const meta = {
  title: "Layout/HStack",
  component: HStack,
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
} satisfies Meta<typeof HStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const AlignStart: Story = {
  args: { align: "start" },
  render: (args) => (
    <HStack {...args}>
      <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Lav</div>
      <div className="ix-color-surface-info-default ix-px-md ix-py-lg">Høy</div>
      <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Lav</div>
    </HStack>
  ),
};

export const AlignEnd: Story = {
  args: { align: "end" },
  render: (args) => (
    <HStack {...args}>
      <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Lav</div>
      <div className="ix-color-surface-info-default ix-px-md ix-py-lg">Høy</div>
      <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Lav</div>
    </HStack>
  ),
};

export const HTML: Story = {
  render: () => (
    <div dangerouslySetInnerHTML={{ __html: `
      <ix-stack horizontal gap="md">
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">Element 1</div>
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">Element 2</div>
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">Element 3</div>
      </ix-stack>
    `}} />
  ),
};
