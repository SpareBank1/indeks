import type { Meta, StoryObj } from '@storybook/react-vite';

import { Combobox } from '@sb1/indeks-react';

const landOptions = [
    { value: '47', label: 'Norge', description: '+47' },
    { value: '46', label: 'Sverige', description: '+46' },
    { value: '45', label: 'Danmark', description: '+45' },
    { value: '358', label: 'Finland', description: '+358' },
    { value: '354', label: 'Island', description: '+354' },
    { value: '49', label: 'Tyskland', description: '+49' },
    { value: '33', label: 'Frankrike', description: '+33' },
];

const meta = {
    title: 'Form/Combobox',
    component: Combobox,
    tags: ['autodocs'],
    args: {
        label: 'Land',
        options: landOptions,
        placeholder: 'Søk etter land …',
        noHitsText: 'Ingen treff',
        toggleLabel: 'Vis alternativer',
    },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const MedForhåndsvalgtVerdi: Story = {
    args: {
        defaultValue: '47',
    },
};

export const MedBeskrivelse: Story = {
    args: {
        description: 'Søk og velg landet du bor i',
    },
};

export const Flervalg: Story = {
    args: {
        multiple: true,
        removeChipLabel: 'fjern',
        arrowHintText: 'Bruk piltastene for å navigere mellom valgte alternativer',
    },
};

export const FlervalgMedForhåndsvalgte: Story = {
    args: {
        multiple: true,
        removeChipLabel: 'fjern',
        arrowHintText: 'Bruk piltastene for å navigere mellom valgte alternativer',
        defaultValue: ['47', '46'],
    },
};

export const MedFeilmelding: Story = {
    args: {
        errorMessage: 'Du må velge et land',
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
        defaultValue: '47',
    },
};

export const MedDeaktivertAlternativ: Story = {
    args: {
        options: [
            { value: '47', label: 'Norge', description: '+47' },
            { value: '46', label: 'Sverige', description: '+46', disabled: true },
            { value: '45', label: 'Danmark', description: '+45' },
        ],
    },
};

export const MedTooltip: Story = {
    args: {
        tooltip: 'Vi trenger landet ditt for å beregne fraktkostnad',
        tooltipLabel: 'Mer informasjon om Land',
    },
};

export const HTML: Story = {
    render: () => (
        <ix-field>
            <label htmlFor="land-html">Land</label>
            <ix-combobox class="ix-combobox" data-no-hits-text="Ingen treff" name="land">
                <div className="ix-text-field">
                    <input
                        id="land-html"
                        className="ix-text-field__input"
                        placeholder="Søk etter land …"
                    />
                    <button type="button" className="ix-combobox__toggle" aria-label="Vis alternativer" />
                </div>
                <div className="ix-combobox__listbox" hidden>
                    <div className="ix-combobox__option" data-value="47">
                        <span className="ix-combobox__option-check" aria-hidden="true" />
                        <span className="ix-combobox__option-label">Norge</span>
                        <span className="ix-combobox__option-description">+47</span>
                    </div>
                    <div className="ix-combobox__option" data-value="46">
                        <span className="ix-combobox__option-check" aria-hidden="true" />
                        <span className="ix-combobox__option-label">Sverige</span>
                        <span className="ix-combobox__option-description">+46</span>
                    </div>
                    <div className="ix-combobox__option" data-value="45">
                        <span className="ix-combobox__option-check" aria-hidden="true" />
                        <span className="ix-combobox__option-label">Danmark</span>
                        <span className="ix-combobox__option-description">+45</span>
                    </div>
                </div>
                <div className="ix-combobox__no-hits" role="status" hidden>
                    Ingen treff
                </div>
                <select data-field="native" name="land" hidden />
            </ix-combobox>
            <span data-field="error" aria-live="polite" />
        </ix-field>
    ),
};
