import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '@sb1/indeks-react';

const meta = {
    title: 'Form/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    args: {
        label: 'Jeg godtar vilkårene',
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Avkrysset: Story = {
    args: {
        defaultChecked: true,
    },
};

export const MedBeskrivelse: Story = {
    tags: ['mobile-chromium'],
    args: {
        label: 'Send meg nyhetsbrev',
        description: 'Du kan når som helst melde deg av',
    },
};

export const MedFeilmelding: Story = {
    args: {
        label: 'Jeg godtar vilkårene',
        errorMessage: 'Du må godta vilkårene for å fortsette',
    },
};

export const Indeterminate: Story = {
    args: {
        label: 'Velg alle',
        indeterminate: true,
    },
};

export const Påkrevd: Story = {
    args: {
        label: 'Jeg bekrefter at opplysningene er korrekte',
        required: true,
    },
};

/**
 * Disabled-elementer er unntatt fra WCAG 1.4.3 kontrastkrav.
 */
export const Deaktivert: Story = {
    args: {
        label: 'Ikke tilgjengelig',
        disabled: true,
    },
};

export const DeaktivertAvkrysset: Story = {
    args: {
        label: 'Allerede godtatt',
        disabled: true,
        defaultChecked: true,
    },
};

export const MedTooltip: Story = {
    args: {
        label: 'Lagre betalingsinformasjon',
        tooltip: 'Kortinformasjonen lagres sikkert og kryptert',
        tooltipLabel: 'Mer informasjon om lagring',
    },
};

export const FlereCheckboxer: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Checkbox label="E-post" name="contact" value="email" />
            <Checkbox label="SMS" name="contact" value="sms" />
            <Checkbox label="Telefon" name="contact" value="phone" />
        </div>
    ),
};

export const HTML: Story = {
    render: () => (
        <ix-field>
            <label className="ix-checkbox">
                <input type="checkbox" className="ix-checkbox__input" name="terms" />
                <span className="ix-checkbox__box"></span>
                <span className="ix-checkbox__label">Jeg godtar vilkårene</span>
            </label>
            <span data-field="description">Les vilkårene før du godtar</span>
            <span data-field="error" aria-live="polite"></span>
        </ix-field>
    ),
};
