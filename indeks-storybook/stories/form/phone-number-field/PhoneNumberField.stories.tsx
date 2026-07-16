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
        noHitsText: 'Ingen treff',
        toggleLabel: 'Vis landkoder',
        resultsText: '{n} alternativer',
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

export const MedForhåndsvalgtLand: Story = {
    args: {
        defaultCountryCode: '46',
        defaultValue: '701234567',
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

export const EngelskLandliste: Story = {
    args: {
        locale: 'en',
        label: 'Mobile number',
        description: 'Format: 123 45 678',
        countryLabel: 'Country code',
        numberLabel: 'Phone number',
        noHitsText: 'No matches',
        toggleLabel: 'Show country codes',
    },
};

/**
 * Rå HTML-anatomi: `<ix-phone-number-field>` binder sammen en eksisterende
 * `<ix-combobox>` (landkode) og et `<ix-field>`-tekstfelt (nummer) under én
 * felles legend og én felles valideringsmelding. Nummerfeltet slår på
 * `data-format="phone"` for norsk 8-sifret formatering.
 */
export const HTML: Story = {
    render: () => (
        <ix-phone-number-field class="ix-phone-number-field">
            <span data-field="legend" id="tlf-html-legend">
                Mobilnummer
            </span>
            <div data-field="items">
                <div data-field="country">
                    <ix-combobox class="ix-combobox" data-no-hits-text="Ingen treff" name="landkode">
                        <div className="ix-text-field">
                            <input
                                id="tlf-html-country"
                                className="ix-text-field__input"
                                aria-label="Landkode"
                            />
                            <button type="button" className="ix-combobox__toggle" aria-label="Vis landkoder" />
                        </div>
                        <div className="ix-combobox__listbox" hidden>
                            <div className="ix-combobox__option" data-value="47">
                                <span className="ix-combobox__option-check" aria-hidden="true" />
                                <span className="ix-combobox__option-label">+47</span>
                                <span className="ix-combobox__option-description">Norge</span>
                            </div>
                            <div className="ix-combobox__option" data-value="46">
                                <span className="ix-combobox__option-check" aria-hidden="true" />
                                <span className="ix-combobox__option-label">+46</span>
                                <span className="ix-combobox__option-description">Sverige</span>
                            </div>
                            <div className="ix-combobox__option" data-value="45">
                                <span className="ix-combobox__option-check" aria-hidden="true" />
                                <span className="ix-combobox__option-label">+45</span>
                                <span className="ix-combobox__option-description">Danmark</span>
                            </div>
                        </div>
                        <div className="ix-combobox__no-hits" role="status" hidden>
                            Ingen treff
                        </div>
                        <select data-field="native" name="landkode" hidden />
                    </ix-combobox>
                </div>
                <div data-field="number">
                    <ix-field class="ix-field">
                        <div className="ix-text-field">
                            <input
                                id="tlf-html-number"
                                className="ix-text-field__input"
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel-national"
                                aria-label="Telefonnummer"
                                data-format="phone"
                                name="tlf"
                            />
                        </div>
                    </ix-field>
                </div>
            </div>
            <span data-field="error" />
        </ix-phone-number-field>
    ),
};
