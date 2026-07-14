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

/**
 * Formatering: feltet formateres når det mister fokus, og viser rå verdi ved
 * fokus slik at brukeren kan redigere fritt (ingen caret-hopp). `format="phone"`
 * bruker den innebygde norske telefon-varianten.
 */
export const FormatTelefon: Story = {
  args: { label: 'Telefonnummer', format: 'phone', defaultValue: '12345678', type: 'tel', inputMode: 'numeric', autoComplete: 'tel-national' },
  render: (args) => <TextField {...args} />,
};

export const FormatBelop: Story = {
  args: { label: 'Beløp', format: 'amount', defaultValue: '1234567', suffix: 'kr', inputMode: 'decimal' },
  render: (args) => <TextField {...args} />,
};

export const FormatFodselsnummer: Story = {
  args: { label: 'Fødselsnummer', format: 'ssn', defaultValue: '01019012345', inputMode: 'numeric' },
  render: (args) => <TextField {...args} />,
};

export const FormatKontonummer: Story = {
  args: { label: 'Kontonummer', format: 'account', defaultValue: '12345678903', inputMode: 'numeric' },
  render: (args) => <TextField {...args} />,
};

export const FormatOrgnr: Story = {
  args: { label: 'Organisasjonsnummer', format: 'orgnr', defaultValue: '123456789', inputMode: 'numeric' },
  render: (args) => <TextField {...args} />,
};

/**
 * `formatPattern` gir formatering uten kode: `0`=siffer, `a`=bokstav, `*`=hva som
 * helst, resten = separatorer. Her et KID-nummer.
 */
export const FormatPattern: Story = {
  args: { label: 'KID-nummer', formatPattern: '0000 0000 0000 000', defaultValue: '1234567890123', inputMode: 'numeric' },
  render: (args) => <TextField {...args} />,
};

/**
 * Egen `{ format, parse }` for logikk som ikke passer et pattern — her store
 * bokstaver.
 */
export const FormatEgenFunksjon: Story = {
  args: {
    label: 'Referanse',
    defaultValue: 'ab-123',
    format: {
      format: (raw: string) => raw.toUpperCase(),
      parse: (display: string) => display.toLowerCase(),
    },
  },
  render: (args) => <TextField {...args} />,
};

/**
 * Ren HTML/web component: `data-format` (eller `data-format-pattern`) på `<ix-field>`
 * gir samme formatering uten React.
 */
export const FormatHTML: Story = {
  render: () => (
    <ix-field data-format="phone">
      <label className="ix-label">Telefonnummer</label>
      <div className="ix-text-field">
        <input defaultValue="12345678" type="tel" inputMode="numeric" />
      </div>
      <span data-field="error"></span>
    </ix-field>
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