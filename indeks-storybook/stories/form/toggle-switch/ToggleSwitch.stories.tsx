import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToggleSwitch } from '@sb1/indeks-react';

const meta = {
    title: 'Form/ToggleSwitch',
    component: ToggleSwitch,
    tags: ['autodocs'],
    args: {
        label: 'Motta varsler',
    },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Paa: Story = {
    name: 'På',
    args: {
        defaultChecked: true,
    },
};

export const LabelTilHoyre: Story = {
    name: 'Label til høyre',
    render: (args) => (
        <div className="ix-flex ix-flex-col">
            <ToggleSwitch {...args} labelPlacement="right" />
            <ToggleSwitch {...args} labelPlacement="right" defaultChecked />
        </div>
    ),
};

export const MedBeskrivelse: Story = {
    tags: ['mobile-chromium'],
    render: (args) => (
        <div className="ix-flex ix-flex-col">
            <ToggleSwitch {...args} description="Vi sender varsel på SMS" defaultChecked />
            <ToggleSwitch {...args} description="Vi sender varsel på SMS" labelPlacement="right" />
        </div>
    ),
};

export const UtenLabel: Story = {
    render: () => (
        <div className="ix-flex ix-gap-md">
            <ToggleSwitch ariaLabel="Wifi" />
            <ToggleSwitch ariaLabel="Bluetooth" defaultChecked />
        </div>
    ),
};

/** Disabled-elementer er unntatt fra kontrastkravene i WCAG 1.4.3 og 1.4.11. */
export const Deaktivert: Story = {
    render: (args) => (
        <div className="ix-flex ix-flex-col">
            <ToggleSwitch {...args} disabled />
            <ToggleSwitch {...args} disabled defaultChecked />
        </div>
    ),
};

export const FullBredde: Story = {
    tags: ['mobile-chromium'],
    render: () => (
        <div className="ix-flex ix-flex-col">
            <ToggleSwitch label="Wifi" className="ix-w-full" defaultChecked />
            <ToggleSwitch label="Bluetooth" className="ix-w-full" />
            <ToggleSwitch label="Flymodus" description="Slår av all trådløs kommunikasjon" className="ix-w-full" />
        </div>
    ),
};

export const LangLabel: Story = {
    tags: ['mobile-chromium'],
    args: {
        label: 'Motta varsler om nye meldinger, betalinger og andre hendelser på kontoen din',
    },
};

export const HTML: Story = {
    render: () => (
        <ix-field>
            {/* Ingen fast id: ix-field genererer en unik id og setter label[for]. En fast
                id blir duplisert når lys/mørk-decoratoren rendrer storyen to ganger. */}
            <div className="ix-toggle-switch">
                <input type="checkbox" role="switch" name="varsler" />
                <label>Motta varsler</label>
                <span data-field="description">Vi sender varsel på SMS</span>
            </div>
        </ix-field>
    ),
};
