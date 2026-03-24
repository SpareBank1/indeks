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
  args: { },
  render: (args) => {
    return <div className='ix-field'>
      <label htmlFor="testhtml" className='ix-text-field__label'>Test</label>
      <div className='ix-text-field'> 
        <input className="ix-text-field__input" placeholder="Placeholder" id="testhtml" {...args.inputProps} />
      </div>
    </div>;
  },
};