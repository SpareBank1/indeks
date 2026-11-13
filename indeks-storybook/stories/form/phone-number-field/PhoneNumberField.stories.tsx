import type { Meta, StoryObj } from '@storybook/react-vite';

import { PhoneNumberField } from '@sb1/indeks-react';

const meta = {
    title: 'Form/PhoneNumberField',
    component: PhoneNumberField,
    tags: ['autodocs'],
    args: {
        label: 'Mobilnummer',
        countryLabel: 'Landkode',
        numberLabel: 'Telefonnummer',
        description: 'Norsk format: 123 45 678',
        defaultCountryCode: '47',
    },
} satisfies Meta<typeof PhoneNumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const MedBeskrivelse: Story = {
    args: {
        description: 'Vi bruker nummeret kun til SMS-varsling. Format: 123 45 678',
    },
};

export const MedVerdi: Story = {
    args: {
        defaultValue: '12345678',
    },
};

/**
 * Landkoden vises, men kan ikke endres.
 */
export const LåstLandkode: Story = {
    args: {
        countryCodeReadOnly: true,
    },
};

/**
 * Bare nummerfeltet vises. Landkoden må settes i koden som tar imot verdien.
 */
export const UtenLandkode: Story = {
    args: {
        hideCountryCode: true,
        countryLabel: undefined,
        defaultCountryCode: undefined,
    },
};

export const MedFeilmelding: Story = {
    args: {
        errorMessage: 'Skriv inn et gyldig telefonnummer',
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
        defaultValue: '12345678',
    },
};

/**
 * Rå HTML-anatomi: landkoden og nummeret er hver sitt `<ix-field>` med
 * `.ix-text-field`, og gruppen har én felles feilmelding. `<ix-phone-number-field>`
 * stamper standardattributtene (`inputmode`, `autocomplete`, `type=tel`,
 * `data-format=phone`), fjerner alt annet enn siffer fra landkoden og legger på
 * gruppe-ARIA.
 */
export const HTML: Story = {
    render: () => (
        <ix-phone-number-field class="ix-phone-number-field">
            <span data-field="legend" id="tlf-html-legend">
                Mobilnummer
            </span>
            <div data-field="items">
                <ix-field data-field="country" class="ix-field">
                    <div className="ix-text-field">
                        <div data-field="prefix">+</div>
                        <input id="tlf-html-country" aria-label="Landkode" name="landkode" defaultValue="47" />
                    </div>
                </ix-field>
                <ix-field data-field="number" class="ix-field">
                    <div className="ix-text-field">
                        <input id="tlf-html-number" aria-label="Telefonnummer" name="tlf" />
                    </div>
                </ix-field>
            </div>
            <span data-field="error" />
        </ix-phone-number-field>
    ),
};
