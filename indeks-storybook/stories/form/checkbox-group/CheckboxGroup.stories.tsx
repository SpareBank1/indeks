import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxButton, CheckboxGroup } from '@sb1/indeks-react';

const meta = {
    title: 'Form/CheckboxGroup',
    component: CheckboxGroup,
    tags: ['autodocs'],
    args: {
        legend: 'Hvordan vil du bli kontaktet?',
        name: 'kontakt',
    },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultChildren = (
    <>
        <CheckboxButton value="epost" label="E-post" />
        <CheckboxButton value="sms" label="SMS" />
        <CheckboxButton value="telefon" label="Telefon" />
    </>
);

export const Standard: Story = {
    render: (args) => <CheckboxGroup {...args}>{DefaultChildren}</CheckboxGroup>,
};

export const MedDescription: Story = {
    args: { description: 'Du kan velge flere' },
    render: (args) => <CheckboxGroup {...args}>{DefaultChildren}</CheckboxGroup>,
};

export const Sjekket: Story = {
    args: { value: ['epost', 'sms'] },
    render: (args) => <CheckboxGroup {...args}>{DefaultChildren}</CheckboxGroup>,
};

export const Error: Story = {
    args: { errorMessage: 'Du må velge minst ett alternativ før du kan fortsette' },
    render: (args) => <CheckboxGroup {...args}>{DefaultChildren}</CheckboxGroup>,
};

export const ReadOnly: Story = {
    args: { readOnly: true, value: ['epost'] },
    render: (args) => <CheckboxGroup {...args}>{DefaultChildren}</CheckboxGroup>,
};

/**
 * Disabled-elementer er unntatt fra WCAG 1.4.3 kontrastkrav.
 */
export const Disabled: Story = {
    args: { disabled: true, value: ['epost'] },
    render: (args) => <CheckboxGroup {...args}>{DefaultChildren}</CheckboxGroup>,
};

export const HideLegend: Story = {
    args: { hideLegend: true },
    render: (args) => <CheckboxGroup {...args}>{DefaultChildren}</CheckboxGroup>,
};

export const MedOptions: Story = {
    args: {
        legend: 'Velg interesser',
        name: 'interesser',
        options: [
            { value: 'sport', label: 'Sport' },
            { value: 'musikk', label: 'Musikk' },
            { value: 'reise', label: 'Reise' },
        ],
    },
};

export const HTML: Story = {
    render: () => (
        <ix-checkbox-group name="kontakt-html">
            <span data-field="legend">Hvordan vil du bli kontaktet?</span>
            <p data-field="description">Du kan velge flere</p>
            <div data-field="items">
                <div className="ix-checkbox">
                    <input type="checkbox" value="epost" defaultChecked />
                    <label>E-post</label>
                </div>
                <div className="ix-checkbox">
                    <input type="checkbox" value="sms" />
                    <label>SMS</label>
                </div>
                <div className="ix-checkbox">
                    <input type="checkbox" value="telefon" />
                    <label>Telefon</label>
                </div>
            </div>
            <span data-field="error" aria-live="polite"></span>
        </ix-checkbox-group>
    ),
};
