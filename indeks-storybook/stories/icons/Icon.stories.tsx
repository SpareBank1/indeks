import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon, COMMON_ICON_NAMES } from '@sb1/indeks-react';

const meta = {
  title: 'Icons/Icon',
  component: Icon,
  tags: [],
  parameters: {
    docs: {
      description: {
        component:
          'Ikon-komponent. `name` er Material Design-ikonnavnet direkte. Vanlige SB1-ikoner autofullføres; alle andre MD-navn godtas også.',
      },
    },
  },
  argTypes: {
    name: {
      description: 'Material Design-ikonnavn. Listen viser de vanligste SB1-ikonene — alle MD-navn godtas.',
      control: { type: 'select' },
      options: COMMON_ICON_NAMES,
      table: {
        type: { summary: 'IconName' },
      },
    },
  },
  args: {
    name: 'home',
    size: 'md',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const XLarge: Story = {
  args: {
    size: 'xl',
  },
};

export const HTML: Story = {
  name: 'HTML (web component)',
  render: () => (
    // @ts-expect-error ix-icon er en custom element — JSX-typer er deklarert i indeks-web
    <ix-icon name="home" aria-label="Hjem" />
  ),
};

