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

export const UtenIkon: Story = {
    args: { showIcon: false, children: 'Du må fylle inn et gyldig kontonummer' },
};

export const Success: Story = {
    args: { status: 'success', children: 'Kontonummeret er gyldig' },
};

export const MedId: Story = {
    args: { id: 'min-feil', children: 'Beløpet må være et tall' },
};

export const HTML: Story = {
    render: () => (
        <span data-field="error">
            <ix-icon data-badge="" data-status="danger" name="close" aria-hidden="true" />
            Du må velge et alternativ
        </span>
    ),
};

export const HTMLSuccess: Story = {
    name: 'HTML – success',
    render: () => (
        <span data-field="error" data-status="success">
            <ix-icon data-badge="" data-status="success" name="check" aria-hidden="true" />
            Kontonummeret er gyldig
        </span>
    ),
};
