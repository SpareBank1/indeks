import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextArea } from '@sb1/indeks-react';

const meta = {
  title: 'Form/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  args: { label: 'test' },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Description: Story = {
  args: { description: 'Maks 500 tegn' },
  render: (args) => {
    return <TextArea {...args} />;
  },
};

export const Invalid: Story = {
  args: { errorMessage: 'Feltet er påkrevd' },
  render: (args) => {
    return <TextArea {...args} />;
  },
};

/**
 * Disabled-elementer er unntatt fra WCAG 1.4.3 kontrastkrav.
 * TODO: Vurder om vi likevel ønsker tilstrekkelig kontrast på disabled-felter.
 */
export const Disabled: Story = {
  args: { disabled: true, inputProps: { value: 'Disabled innhold' } },
  render: (args) => {
    return <TextArea {...args} />;
  },
};

export const Required: Story = {
  args: { required: true, label: 'Tilbakemelding' },
  render: (args) => {
    return <TextArea {...args} />;
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, inputProps: { value: 'Read only innhold' } },
  render: (args) => {
    return <TextArea {...args} />;
  },
};

export const HTML: Story = {
  args: {
    errorMessage: 'Feilmelding',
    description: 'Dette er en beskrivelse av feltet',
  },
  render: (args) => {
    return (
      <ix-field>
        <label class="ix-label">Test</label>
        <span data-field="description">{args.description}</span>
        <div class="ix-text-area">
          <textarea placeholder="Placeholder" />
        </div>
        <span data-field="error">{args.errorMessage}</span>
      </ix-field>
    );
  },
};
