import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from '@sb1/indeks-react';

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: { size: 'md' },
};

export const MedTekst: Story = {
  args: { size: 'md', label: 'Laster inn data...' },
};

export const Liten: Story = {
  args: { size: 'sm' },
};

export const Stor: Story = {
  args: { size: 'lg' },
};

export const HTML: Story = {
  render: () => (
    <div
      className="ix-spinner"
      role="status"
      aria-label="Laster..."
      data-size="md"
    />
  ),
};
