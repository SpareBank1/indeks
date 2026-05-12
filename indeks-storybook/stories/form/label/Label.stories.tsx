import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@sb1/indeks-react';

const meta = {
    title: 'Form/Label',
    component: Label,
    tags: ['autodocs'],
    args: { children: 'E-postadresse' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
    args: { htmlFor: 'demo-input' },
    render: (args) => (
        <div>
            <Label {...args} />
            <input id="demo-input" type="text" />
        </div>
    ),
};

export const UtenKobling: Story = {
    args: {},
    render: (args) => <Label {...args} />,
};

export const HTML: Story = {
    render: () => (
        <div>
            <label class="ix-label" for="html-input">Kontonummer</label>
            <input id="html-input" type="text" />
        </div>
    ),
};
