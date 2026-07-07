import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    CheckboxButton,
    CheckboxGroup,
    Chip,
    RadioButton,
    RadioGroup,
    RemovableChip,
} from '@sb1/indeks-react';

const meta = {
    title: 'Components/Chip',
    component: Chip,
    tags: ['autodocs'],
    args: { children: 'Chip label' },
    parameters: {
        docs: {
            description: {
                component:
                    'Button chip — en interaktiv chip som fungerer som en knapp og trigger en handling. Har ingen vedvarende valgt tilstand. Størrelse settes med `size` (Medium er standard).',
            },
        },
    },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Small: Story = {
    args: { size: 'sm' },
};

export const Disabled: Story = {
    name: 'Deaktivert',
    args: { disabled: true },
};

export const Group: Story = {
    name: 'Gruppe',
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ix-spacing-sm)' }}>
            <Chip>Alle</Chip>
            <Chip>Sparing</Chip>
            <Chip>Lån</Chip>
            <Chip>Forsikring</Chip>
        </div>
    ),
};

export const HTML: Story = {
    render: () => (
        <button type="button" className="ix-chip">
            Chip label
        </button>
    ),
};

export const Removable: Story = {
    name: 'Removable chip',
    render: () => (
        <RemovableChip removeLabel="fjern" onRemove={() => {}}>
            Sparing
        </RemovableChip>
    ),
};

export const RemovableLiten: Story = {
    name: 'Removable chip – liten',
    render: () => (
        <RemovableChip size="sm" removeLabel="fjern" onRemove={() => {}}>
            Sparing
        </RemovableChip>
    ),
};

export const RemovableGruppe: Story = {
    name: 'Removable chip – gruppe',
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ix-spacing-sm)' }}>
            <RemovableChip removeLabel="fjern" onRemove={() => {}}>
                Sparing
            </RemovableChip>
            <RemovableChip removeLabel="fjern" onRemove={() => {}}>
                Lån
            </RemovableChip>
            <RemovableChip removeLabel="fjern" onRemove={() => {}}>
                Forsikring
            </RemovableChip>
        </div>
    ),
};

export const RemovableDeaktivert: Story = {
    name: 'Removable chip – deaktivert',
    render: () => (
        <RemovableChip disabled removeLabel="fjern" onRemove={() => {}}>
            Sparing
        </RemovableChip>
    ),
};

export const RemovableHTML: Story = {
    name: 'Removable chip – HTML',
    render: () => (
        <button type="button" className="ix-chip" data-removable="" aria-label="Sparing fjern">
            Sparing
        </button>
    ),
};

export const RadioChipGruppe: Story = {
    name: 'Radio chip – gruppe',
    render: () => (
        <RadioGroup variant="chip" legend="Velg periode" name="periode" defaultValue="3m">
            <RadioButton value="1m" label="1 måned" />
            <RadioButton value="3m" label="3 måneder" />
            <RadioButton value="12m" label="12 måneder" />
        </RadioGroup>
    ),
};

export const RadioChipLiten: Story = {
    name: 'Radio chip – liten',
    render: () => (
        <RadioGroup variant="chip" legend="Velg periode" name="periode-sm" size="sm" defaultValue="3m">
            <RadioButton value="1m" label="1 måned" />
            <RadioButton value="3m" label="3 måneder" />
            <RadioButton value="12m" label="12 måneder" />
        </RadioGroup>
    ),
};

export const RadioChipDeaktivert: Story = {
    name: 'Radio chip – deaktivert',
    render: () => (
        <RadioGroup variant="chip" legend="Velg periode" name="periode-disabled" defaultValue="3m" disabled>
            <RadioButton value="1m" label="1 måned" />
            <RadioButton value="3m" label="3 måneder" />
            <RadioButton value="12m" label="12 måneder" />
        </RadioGroup>
    ),
};

export const RadioChipFeilmelding: Story = {
    name: 'Radio chip – feilmelding',
    render: () => (
        <RadioGroup
            variant="chip"
            legend="Velg periode"
            name="periode-error"
            errorMessage="Du må velge en periode"
        >
            <RadioButton value="1m" label="1 måned" />
            <RadioButton value="3m" label="3 måneder" />
            <RadioButton value="12m" label="12 måneder" />
        </RadioGroup>
    ),
};

export const RadioChipKunLesing: Story = {
    name: 'Radio chip – skrivebeskyttet',
    render: () => (
        <RadioGroup variant="chip" legend="Velg periode" name="periode-readonly" defaultValue="3m" readOnly>
            <RadioButton value="1m" label="1 måned" />
            <RadioButton value="3m" label="3 måneder" />
            <RadioButton value="12m" label="12 måneder" />
        </RadioGroup>
    ),
};

export const RadioChipJaNei: Story = {
    name: 'Radio chip – ja/nei',
    render: () => (
        <RadioGroup variant="chip" legend="Ønsker du nyhetsbrev?" name="nyhetsbrev">
            <RadioButton value="ja" label="Ja" />
            <RadioButton value="nei" label="Nei" />
        </RadioGroup>
    ),
};

export const RadioChipHTML: Story = {
    name: 'Radio chip – HTML',
    render: () => (
        <ix-radio-group data-variant="chip" name="periode-html">
            <span data-field="legend">Velg periode</span>
            <div data-field="items">
                <div className="ix-radio-button">
                    <input type="radio" id="periode-1m" value="1m" />
                    <label htmlFor="periode-1m">1 måned</label>
                </div>
                <div className="ix-radio-button">
                    <input type="radio" id="periode-3m" value="3m" defaultChecked />
                    <label htmlFor="periode-3m">3 måneder</label>
                </div>
                <div className="ix-radio-button">
                    <input type="radio" id="periode-12m" value="12m" />
                    <label htmlFor="periode-12m">12 måneder</label>
                </div>
            </div>
            <span data-field="error" aria-live="polite"></span>
        </ix-radio-group>
    ),
};

export const CheckboxChipGruppe: Story = {
    name: 'Checkbox chip – gruppe',
    render: () => (
        <CheckboxGroup variant="chip" legend="Velg interesser" name="interesser" defaultValue={['sport']}>
            <CheckboxButton value="sport" label="Sport" />
            <CheckboxButton value="musikk" label="Musikk" />
            <CheckboxButton value="reise" label="Reise" />
        </CheckboxGroup>
    ),
};

export const CheckboxChipLiten: Story = {
    name: 'Checkbox chip – liten',
    render: () => (
        <CheckboxGroup variant="chip" legend="Velg interesser" name="interesser-sm" size="sm" defaultValue={['sport']}>
            <CheckboxButton value="sport" label="Sport" />
            <CheckboxButton value="musikk" label="Musikk" />
            <CheckboxButton value="reise" label="Reise" />
        </CheckboxGroup>
    ),
};

export const CheckboxChipHTML: Story = {
    name: 'Checkbox chip – HTML',
    render: () => (
        <ix-checkbox-group data-variant="chip" name="interesser-html">
            <span data-field="legend">Velg interesser</span>
            <div data-field="items">
                <div className="ix-checkbox">
                    <input type="checkbox" id="int-sport" value="sport" defaultChecked />
                    <label htmlFor="int-sport">Sport</label>
                </div>
                <div className="ix-checkbox">
                    <input type="checkbox" id="int-musikk" value="musikk" />
                    <label htmlFor="int-musikk">Musikk</label>
                </div>
                <div className="ix-checkbox">
                    <input type="checkbox" id="int-reise" value="reise" />
                    <label htmlFor="int-reise">Reise</label>
                </div>
            </div>
            <span data-field="error" aria-live="polite"></span>
        </ix-checkbox-group>
    ),
};
