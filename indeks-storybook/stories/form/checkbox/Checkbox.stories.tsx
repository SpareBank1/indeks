import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox, CheckboxButton, CheckboxGroup } from '@sb1/indeks-react';

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
        <CheckboxGroup legend="Hvordan vil du bli kontaktet?" name="contact" defaultValue={['email']}>
            <CheckboxButton value="email" label="E-post" />
            <CheckboxButton value="sms" label="SMS" />
            <CheckboxButton value="phone" label="Telefon" />
        </CheckboxGroup>
    ),
};

export const HTML: Story = {
    render: () => (
        <ix-field>
            <div className="ix-checkbox">
                <input type="checkbox" id="terms-html" name="terms" />
                <label htmlFor="terms-html">Jeg godtar vilkårene</label>
            </div>
            <span data-field="description">Les vilkårene før du godtar</span>
            <span data-field="error" aria-live="polite"></span>
        </ix-field>
    ),
};
