import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';
import { fn } from 'storybook/test';

import { InteractiveIcon } from '@sb1/indeks-react';
import type { InteractiveIconStatus } from '@sb1/indeks-react';

const meta = {
    title: 'Components/InteractiveIcon',
    component: InteractiveIcon,
    tags: ['autodocs'],
    args: {
        name: 'home',
        'aria-label': 'Hjem',
        onClick: fn(),
    },
} satisfies Meta<typeof InteractiveIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Statuser: Story = {
    render: (args) => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <InteractiveIcon {...args} status="default" aria-label="Standard" />
            <InteractiveIcon {...args} status="info" aria-label="Info" />
            <InteractiveIcon {...args} status="success" aria-label="Suksess" />
            <InteractiveIcon {...args} status="warning" aria-label="Advarsel" />
            <InteractiveIcon {...args} status="danger" aria-label="Fare" />
        </div>
    ),
};

export const Størrelser: Story = {
    render: (args) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <InteractiveIcon {...args} size="sm" aria-label="Liten" />
            <InteractiveIcon {...args} size="md" aria-label="Medium" />
            <InteractiveIcon {...args} size="lg" aria-label="Stor" />
            <InteractiveIcon {...args} size="xl" aria-label="Ekstra stor" />
        </div>
    ),
};

// Tilstand-matrise: hver status (rad) vist i alle fire tilstandene (kolonne).
// storybook-addon-pseudo-states tvinger hover/active/focus-visible på de
// spesifikke knappene via id-selektorene i `parameters.pseudo` under.
const STATUSER: { status: InteractiveIconStatus; label: string }[] = [
    { status: 'default', label: 'Standard' },
    { status: 'info', label: 'Info' },
    { status: 'success', label: 'Suksess' },
    { status: 'warning', label: 'Advarsel' },
    { status: 'danger', label: 'Fare' },
];

const forcedId = (status: InteractiveIconStatus, state: string) => `ii-${status}-${state}`;

export const Tilstander: Story = {
    // Pin skjermbildet til desktop-chromium (hover er mest relevant på desktop,
    // og matrisen er bred). scanAll-harnessen leser profilnavn som tag-override.
    tags: ['desktop-chromium'],
    parameters: {
        pseudo: {
            hover: STATUSER.map(({ status }) => `#${forcedId(status, 'hover')}`),
            active: STATUSER.map(({ status }) => `#${forcedId(status, 'active')}`),
            focusVisible: STATUSER.map(({ status }) => `#${forcedId(status, 'focus')}`),
        },
    },
    render: (args) => {
        const headerStyle = { fontSize: '12px', color: 'var(--ix-color-foreground-main-subtle)' };
        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto repeat(4, auto)',
                    gap: '12px 24px',
                    alignItems: 'center',
                    justifyItems: 'center',
                }}
            >
                <span />
                <span style={headerStyle}>Passiv</span>
                <span style={headerStyle}>Hover</span>
                <span style={headerStyle}>Trykket</span>
                <span style={headerStyle}>Fokus</span>

                {STATUSER.map(({ status, label }) => (
                    <Fragment key={status}>
                        <span style={{ ...headerStyle, justifySelf: 'start' }}>{label}</span>
                        <InteractiveIcon {...args} status={status} aria-label={`${label} – passiv`} />
                        <InteractiveIcon
                            {...args}
                            status={status}
                            id={forcedId(status, 'hover')}
                            aria-label={`${label} – hover`}
                        />
                        <InteractiveIcon
                            {...args}
                            status={status}
                            id={forcedId(status, 'active')}
                            aria-label={`${label} – trykket`}
                        />
                        <InteractiveIcon
                            {...args}
                            status={status}
                            id={forcedId(status, 'focus')}
                            aria-label={`${label} – fokus`}
                        />
                    </Fragment>
                ))}
            </div>
        );
    },
};

/**
 * Arv fra konteksten. Et ikon uten egen `status` plukker opp status fra nærmeste
 * forelder med `data-status` (f.eks. en Message eller et status-kort), slik at
 * hover/trykk følger omgivelsene. Uten status-kontekst er ikonet nøytralt, og en
 * eksplisitt `status` på ikonet overstyrer arven.
 */
export const ArvFraKontekst: Story = {
    name: 'Arv fra kontekst',
    render: (args) => (
        <div style={{ display: 'flex', gap: '16px' }}>
            <div data-status="info" style={{ padding: '8px' }}>
                <InteractiveIcon {...args} status="default" aria-label="Info-kontekst" />
            </div>
            <div data-status="warning" style={{ padding: '8px' }}>
                <InteractiveIcon {...args} status="default" aria-label="Advarsel-kontekst" />
            </div>
            <div data-status="danger" style={{ padding: '8px' }}>
                <InteractiveIcon {...args} status="default" aria-label="Fare-kontekst" />
            </div>
        </div>
    ),
};

export const HTML: Story = {
    render: () => (
        <button type="button" className="ix-interactive-icon" data-status="info" aria-label="Info">
            <ix-icon name="info_i" aria-hidden="true" class="ix-icon"></ix-icon>
        </button>
    ),
};
