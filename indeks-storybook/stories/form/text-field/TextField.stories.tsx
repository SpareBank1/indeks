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
  args: { disabled: true, defaultValue: 'Disabled', prefix: 'Prefix', suffix: 'Suffix' },
  render: (args) => {
    return <TextField {...args} />;
  },
};

export const Required: Story = {
  args: { required: true, label: 'E-postadresse', type: 'email' },
  render: (args) => {
    return <TextField {...args} />;
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'Read Only', prefix: 'Prefix', suffix: 'Suffix' },
  render: (args) => {
    return <TextField {...args} />;
  },
};

export const MinMax: Story = {
  args: { label: 'Antall', type: 'number', min: 1, max: 10 },
  render: (args) => {
    return <TextField {...args} />;
  },
};

export const MinMaxLength: Story = {
  args: { label: 'Brukernavn', description: '3–20 tegn', minLength: 3, maxLength: 20 },
  render: (args) => {
    return <TextField {...args} />;
  },
};

export const MedTooltip: Story = {
  args: {
    tooltip: 'Fullt juridisk navn som det står i passet',
    tooltipLabel: 'Mer informasjon om Navn',
  },
  render: (args) => {
    return <TextField {...args} />;
  },
};

export const TooltipPlassering: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '3rem' }}>
      <TextField label="Top (standard)" tooltip="Tekst over feltet" tooltipPlacement="top" tooltipLabel="Mer informasjon" />
      <TextField label="Bottom" tooltip="Tekst under feltet" tooltipPlacement="bottom" tooltipLabel="Mer informasjon" />
      <TextField label="Left" tooltip="Tekst til venstre" tooltipPlacement="left" tooltipLabel="Mer informasjon" />
      <TextField label="Right" tooltip="Tekst til høyre" tooltipPlacement="right" tooltipLabel="Mer informasjon" />
    </div>
  ),
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
        <input placeholder="Placeholder" />
      </div>
      <span data-field="error">{args.errorMessage}</span>
    </ix-field>;
  },
};