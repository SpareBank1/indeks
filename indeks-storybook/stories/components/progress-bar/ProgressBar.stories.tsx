import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from '@sb1/indeks-react';

const meta = {
    title: 'Components/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs'],
    args: {
        value: 25,
    },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
    args: { value: 25, 'aria-label': 'Laster opp dokumenter' },
};

export const MedLabel: Story = {
    args: {
        value: 25,
        label: 'Laster opp dokumenter',
        showValue: true,
    },
};

export const MedStøttetekst: Story = {
    args: {
        value: 25,
        label: 'Laster opp dokumenter',
        supportText: 'Ikke lukk vinduet før opplastingen er ferdig.',
        showValue: true,
    },
};

export const Success: Story = {
    args: {
        value: 100,
        state: 'success',
        label: 'Dokumenter lastet opp',
        supportText: 'Alle filene ble lastet opp.',
    },
};

export const Error: Story = {
    args: {
        value: 60,
        state: 'error',
        label: 'Opplasting feilet',
        supportText: 'Noe gikk galt under opplastingen. Prøv igjen.',
    },
};

/**
 * Uten synlig label må komponenten fortsatt ha et tilgjengelig navn — her via
 * `aria-label`. En navnløs `progressbar` er et WCAG 4.1.2-brudd (og web
 * componenten advarer i dev).
 */
export const KunVisuell: Story = {
    args: { value: 40, 'aria-label': 'Laster opp dokumenter' },
};

export const HTML: Story = {
    render: () => (
        <ix-progress-bar
            class="ix-progress-bar"
            value={25}
            label="Laster opp dokumenter"
            data-support-text="Ikke lukk vinduet før opplastingen er ferdig."
            data-show-value=""
        />
    ),
};
