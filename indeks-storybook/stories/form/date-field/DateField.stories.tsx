import type { Meta, StoryObj } from '@storybook/react-vite';

import { DateField } from '@sb1/indeks-react';

const meta = {
    title: 'Form/DateField',
    component: DateField,
    tags: ['autodocs'],
    args: {
        label: 'Fødselsdato',
        openLabel: 'Åpne kalender',
        placeholder: 'dd.mm.åååå',
        description: 'dd.mm.åååå',
    },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const MedForhåndsvalgtVerdi: Story = {
    args: {
        defaultValue: '1990-05-17',
    },
};

export const MedMinMaks: Story = {
    args: {
        min: '2020-01-01',
        max: '2030-12-31',
        description: 'Velg en dato i 2020-tallet',
    },
};

export const MedFeilmelding: Story = {
    args: {
        errorMessage: 'Du må oppgi en gyldig dato',
    },
};

export const Påkrevd: Story = {
    args: {
        required: true,
    },
};

/**
 * Disabled-elementer er unntatt fra WCAG 1.4.3 kontrastkrav.
 */
export const Deaktivert: Story = {
    args: {
        disabled: true,
        defaultValue: '1990-05-17',
    },
};

export const MedTooltip: Story = {
    args: {
        tooltip: 'Vi bruker fødselsdato for å bekrefte identiteten din',
        tooltipLabel: 'Mer informasjon om Fødselsdato',
    },
};

/**
 * Ren HTML uten React-wrapper. Forfatteren skriver kun `.ix-text-field` med den
 * synlige inputen (`data-format="date"`) — web componenten `<ix-date-field>`
 * genererer selv kalenderknappen og den overlagte native date-inputen.
 */
export const HTML: Story = {
    render: () => (
        <ix-field>
            <label htmlFor="fodt-html">Fødselsdato</label>
            <span data-field="description">dd.mm.åååå</span>
            <ix-date-field class="ix-date-field" data-open-label="Åpne kalender" name="fodt">
                <div className="ix-text-field">
                    <input id="fodt-html" inputMode="numeric" data-format="date" placeholder="dd.mm.åååå" />
                </div>
            </ix-date-field>
            <span data-field="error" aria-live="polite" />
        </ix-field>
    ),
};
