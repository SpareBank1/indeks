import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextField } from './TextField';

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
  args: { inputProps: { 'aria-invalid': true }, errorMessage: 'Dette er en feilmelding' },
  render: (args) => {
    return <TextField {...args} />;
  },
};

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
    return <ix-field className="ix-field">
      <label className='ix-label'>Test</label>
      <span className="ix-text-field__description" data-field="description">{args.description}</span>
      <div className='ix-text-field'> 
        <input className="ix-text-field__input" placeholder="Placeholder" {...args.inputProps} />
      </div>
      <span className="ix-text-field__error-message" data-field="error">{args.errorMessage}</span>
    </ix-field>;
  },
};