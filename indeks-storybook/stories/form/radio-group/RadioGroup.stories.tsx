import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioButton, RadioGroup } from '@sb1/indeks-react';

const meta = {
    title: 'Form/RadioGroup',
    component: RadioGroup,
    tags: ['autodocs'],
    args: {
        legend: 'Velg kundetype',
        name: 'kundetype',
    },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultChildren = (
    <>
        <RadioButton value="privat" label="Privat" description="Kun for privatpersoner" />
        <RadioButton value="bedrift" label="Bedrift" />
        <RadioButton value="annet" label="Annet" />
    </>
);

export const Standard: Story = {
    render: (args) => <RadioGroup {...args}>{DefaultChildren}</RadioGroup>,
};

export const MedDescription: Story = {
    args: { description: 'Velg hvilken kundetype som passer best for deg' },
    render: (args) => <RadioGroup {...args}>{DefaultChildren}</RadioGroup>,
};

export const Horisontal: Story = {
    args: { orientation: 'horizontal' },
    render: (args) => (
        <RadioGroup {...args}>
            <RadioButton value="ja" label="Ja" />
            <RadioButton value="nei" label="Nei" />
            <RadioButton value="vet-ikke" label="Vet ikke" />
        </RadioGroup>
    ),
};

export const Sjekket: Story = {
    args: { value: 'privat' },
    render: (args) => <RadioGroup {...args}>{DefaultChildren}</RadioGroup>,
};

export const Error: Story = {
    args: { errorMessage: 'Du må velge et alternativ før du kan fortsette' },
    render: (args) => <RadioGroup {...args}>{DefaultChildren}</RadioGroup>,
};

export const ReadOnly: Story = {
    args: { readOnly: true, value: 'bedrift' },
    render: (args) => <RadioGroup {...args}>{DefaultChildren}</RadioGroup>,
};

/**
 * Disabled-elementer er unntatt fra WCAG 1.4.3 kontrastkrav.
 * TODO: Vurder om vi likevel ønsker tilstrekkelig kontrast på deaktiverte radioknapper.
 */
export const Disabled: Story = {
    args: { disabled: true },
    render: (args) => <RadioGroup {...args}>{DefaultChildren}</RadioGroup>,
};

export const HideLegend: Story = {
    args: { hideLegend: true },
    render: (args) => <RadioGroup {...args}>{DefaultChildren}</RadioGroup>,
};

export const HTML: Story = {
    render: () => (
        <ix-radio-group name="kundetype-html">
            <span data-field="legend" class="ix-radio-group__legend">Velg kundetype</span>
            <p data-field="description" class="ix-radio-group__description">
                Velg hvilken kundetype som passer best
            </p>
            <div class="ix-radio-group__items">
                <div class="ix-radio-button">
                    <input type="radio" class="ix-radio-button__input" id="html-privat" name="kundetype-html" value="privat" checked />
                    <label class="ix-radio-button__label" htmlFor="html-privat">
                        Privat
                        <span class="ix-radio-button__description">Kun for privatpersoner</span>
                    </label>
                </div>
                <div class="ix-radio-button">
                    <input type="radio" class="ix-radio-button__input" id="html-bedrift" name="kundetype-html" value="bedrift" />
                    <label class="ix-radio-button__label" htmlFor="html-bedrift">Bedrift</label>
                </div>
                <div class="ix-radio-button">
                    <input type="radio" class="ix-radio-button__input" id="html-annet" name="kundetype-html" value="annet" />
                    <label class="ix-radio-button__label" htmlFor="html-annet">Annet</label>
                </div>
            </div>
            <span data-field="error"></span>
        </ix-radio-group>
    ),
};
