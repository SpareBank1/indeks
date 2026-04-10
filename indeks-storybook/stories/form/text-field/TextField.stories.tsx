import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextField } from '@sb1/indeks-react';

const meta = {
  title: 'Form/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'test' },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};

export const Affix: Story = {
  args: { prefix: 'Prefix', suffix: 'Suffix' },
  render: (args) => {
    return <TextField {...args} />;
  },
};

export const Description: Story = {
  args: { description: 'Dette er en beskrivelse av feltet' },
  render: (args) => {
    return <TextField {...args} />;
  },
};

export const Invalid: Story = {
  args: { errorMessage: 'Dette er en feilmelding' },
  render: (args) => {
    return <TextField {...args} />;
  },
};

/**
 * Disabled-elementer er unntatt fra WCAG 1.4.3 kontrastkrav, men
 * kontrasten på prefix/suffix i dark mode er lav (2.64:1).
 * TODO: Vurder om vi likevel ønsker tilstrekkelig kontrast på disabled-felter.
 */
export const Disabled: Story = {
  args: { disabled: true, inputProps: { value: 'Disabled' }, prefix: 'Prefix', suffix: 'Suffix' },
  render: (args) => {
    return <TextField {...args} />;
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, inputProps: { value: 'Read Only' }, prefix: 'Prefix', suffix: 'Suffix' },
  render: (args) => {
    return <TextField {...args} />;
  },
};

export const HTML: Story = {
  args: {
    errorMessage: "Feilmelding",
    description: "Dette er en beskrivelse av feltet"

  },
  render: (args) => {
    return <ix-field>
      <label className='ix-label'>Test</label>
      <span data-field="description">{args.description}</span>
      <div className='ix-text-field'>
        <input className="ix-text-field__input" placeholder="Placeholder" />
      </div>
      <span data-field="error">{args.errorMessage}</span>
    </ix-field>;
  },
};