import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select } from '@sb1/indeks-react';

const basicOptions = [
    { value: 'no', label: 'Norge' },
    { value: 'se', label: 'Sverige' },
    { value: 'dk', label: 'Danmark' },
    { value: 'fi', label: 'Finland' },
];

const groupedOptions = [
    {
        label: 'Norden',
        options: [
            { value: 'no', label: 'Norge' },
            { value: 'se', label: 'Sverige' },
            { value: 'dk', label: 'Danmark' },
        ],
    },
    {
        label: 'Europa',
        options: [
            { value: 'de', label: 'Tyskland' },
            { value: 'fr', label: 'Frankrike' },
            { value: 'es', label: 'Spania' },
        ],
    },
];

const meta = {
    title: 'Form/Select',
    component: Select,
    tags: ['autodocs'],
    args: {
        label: 'Land',
        options: basicOptions,
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const MedPlaceholder: Story = {
    args: {
        placeholder: 'Velg et land...',
    },
};

export const MedBeskrivelse: Story = {
    args: {
        description: 'Velg landet du bor i',
    },
};

export const MedGrupper: Story = {
    args: {
        label: 'Velg land',
        placeholder: 'Velg...',
        options: groupedOptions,
    },
};

export const MedFeilmelding: Story = {
    args: {
        errorMessage: 'Du må velge et land',
        placeholder: 'Velg et land...',
    },
};

export const Påkrevd: Story = {
    args: {
        required: true,
        placeholder: 'Velg et land...',
    },
};

/**
 * Disabled-elementer er unntatt fra WCAG 1.4.3 kontrastkrav.
 */
export const Deaktivert: Story = {
    args: {
        disabled: true,
        defaultValue: 'no',
    },
};

export const MedDeaktivertAlternativ: Story = {
    args: {
        placeholder: 'Velg et land...',
        options: [
            { value: 'no', label: 'Norge' },
            { value: 'se', label: 'Sverige', disabled: true },
            { value: 'dk', label: 'Danmark' },
        ],
    },
};

export const MedTooltip: Story = {
    args: {
        tooltip: 'Vi trenger denne informasjonen for å beregne skatt',
        tooltipLabel: 'Mer informasjon om Land',
    },
};

export const HTML: Story = {
    render: () => (
            <label class="ix-label" for="html-select">
            </label>
            <span data-field="description">Velg landet du bor i</span>
            <select id="html-select" name="land" class="ix-select">
                <option value="" disabled>
                    Velg land...
                </option>
                <optgroup label="Norden">
                    <option value="no">Norge</option>
                    <option value="se">Sverige</option>
                    <option value="dk">Danmark</option>
                </optgroup>
                <optgroup label="Europa">
                    <option value="de">Tyskland</option>
                    <option value="fr">Frankrike</option>
                </optgroup>
            </select>
            <span data-field="error" aria-live="polite"></span>
        </ix-field>
    ),
};
