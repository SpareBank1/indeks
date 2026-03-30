import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon, ICON_NAMES, availableMaterialDesignIconNames } from '@sb1/indeks-react';

// Hent tilgjengelige ikonnavn fra ICON_NAMES-objektet
const availableIconNames = Object.keys(ICON_NAMES) as Array<keyof typeof ICON_NAMES>;

const meta = {
  title: 'Icons/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          'Ikon-komponent som støtter to gjensidig utelukkende ikonsystemer: Indeks-ikoner/aliaser (name) og Material Design-ikoner (materialDesignName).',
      },
    },
  },
  argTypes: {
    name: {
      description: 'Tilpasset Indeks ikonnavn',
      control: { type: 'select' },
      options: [undefined, ...availableIconNames],
      table: {
        type: { summary: 'IconName' },
        defaultValue: { summary: 'undefined' },
      },
    },
    materialDesignName: {
      description: 'Material Design ikonnavn (viser vanlige ikoner - full liste har 3000+ alternativer)',
      control: { type: 'select' },
      options: [undefined, ...availableMaterialDesignIconNames],
      table: {
        type: { summary: 'MaterialDesignIconName' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  args: {
    name: 'hjem',
    size: 'md',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mer om å skrive stories med args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};
export const Medium: Story = {
  args: {
    size: 'md',
  },
};
export const Large: Story = {
  args: {
    size: 'lg',
  },
};
