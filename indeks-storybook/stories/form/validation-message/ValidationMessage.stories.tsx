import type { Meta, StoryObj } from '@storybook/react-vite';
import { ValidationMessage } from '@sb1/indeks-react';

const meta = {
    title: 'Form/ValidationMessage',
    component: ValidationMessage,
    tags: ['autodocs'],
    args: { children: 'Du må fylle inn et gyldig kontonummer' },
} satisfies Meta<typeof ValidationMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const MedId: Story = {
    args: { id: 'min-feil', children: 'Beløpet må være et tall' },
};

export const HTML: Story = {
    render: () => (
        <span data-field="error">Du må velge et alternativ</span>
    ),
};
