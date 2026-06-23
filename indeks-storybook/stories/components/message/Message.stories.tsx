import type { Meta, StoryObj } from '@storybook/react-vite';

import { LinkText, Message, MessageRegion } from '@sb1/indeks-react';

const meta = {
    title: 'Components/Message',
    component: Message,
    tags: ['autodocs'],
    // Message må ligge i en MessageRegion for å annonseres for skjermlesere.
    // Regionen rendrer ingenting synlig — den eier de stabile live-regionene.
    decorators: [
        (Story) => (
            <MessageRegion>
                <Story />
            </MessageRegion>
        ),
    ],
    args: {
        status: 'info',
        children: 'Vi har mottatt søknaden din og behandler den nå',
    },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Success: Story = {
    args: {
        status: 'success',
        children: 'Endringene dine er lagret',
    },
};

export const Warning: Story = {
    args: {
        status: 'warning',
        children: 'Det er kort tid til fristen for å svare',
    },
};

export const Danger: Story = {
    args: {
        status: 'danger',
        children: 'Vi klarte ikke å gjennomføre betalingen',
    },
};

export const MedTittel: Story = {
    name: 'Med tittel',
    args: {
        status: 'info',
        title: 'Behandling pågår',
        children: 'Vi har mottatt søknaden din og behandler den nå',
    },
};

export const MedLenke: Story = {
    name: 'Med lenke',
    args: {
        status: 'info',
        title: 'Behandling pågår',
        children: (
            <>
                <p>Vi har mottatt søknaden din og behandler den nå</p>
                <LinkText href="#">Les mer om saksbehandling</LinkText>
            </>
        ),
    },
};

export const MedLukkeknapp: Story = {
    name: 'Med lukkeknapp',
    args: {
        status: 'success',
        title: 'Endringene er lagret',
        children: 'Du kan trygt lukke denne meldingen',
        closeLabel: 'Lukk melding',
    },
};

export const Expandable: Story = {
    args: {
        status: 'warning',
        expandable: true,
        title: 'Nye vilkår for kontoen',
        summary: 'Vi har oppdatert vilkårene. Trykk for å lese hva som er endret.',
        defaultOpen: false,
        children: (
            <ul>
                <li>Renten justeres fra 1. juli.</li>
                <li>Gebyret for papirfaktura fjernes.</li>
                <li>Du kan når som helst endre varslingsinnstillingene dine.</li>
            </ul>
        ),
    },
};

/**
 * Utvidbar i åpen tilstand. Headeren (summary) bruker status-`surface` som body,
 * og tones til `surface-hover` ved hover.
 */
export const ExpandableOpen: Story = {
    name: 'Utvidbar (åpen)',
    args: {
        ...Expandable.args,
        defaultOpen: true,
    },
};

/**
 * Ren HTML uten React-wrapper. Status velges med `data-status`, som også kobler
 * fargevariablene (`--ix-color-status-*`) automatisk. ARIA (`role="alert"` eller
 * `aria-live="polite"`) settes manuelt av konsumenten. Statusikonet skrives som
 * `<ix-icon data-badge materialdesignname="…" aria-hidden="true">`; sirkelfargen følger `data-status`.
 */
export const HTML: Story = {
    render: () => (
        <ix-stack>
            <div className="ix-message" data-status="info" aria-live="polite">
                <ix-icon data-badge="" materialdesignname="info_i" aria-hidden="true" />
                <div className="ix-message__body">
                    <strong className="ix-message__title">Behandling pågår</strong>
                    <p>Vi har mottatt søknaden din og behandler den nå</p>
                    <a className="ix-link-text" href="#">
                        Les mer om saksbehandling
                    </a>
                </div>
                <button className="ix-message__close" type="button" aria-label="Lukk melding" />
            </div>

            <details className="ix-message" data-status="warning" data-expandable open>
                <summary className="ix-message__summary">
                    <ix-icon data-badge="" materialdesignname="priority_high" aria-hidden="true" />
                    <div className="ix-message__body">
                        <strong className="ix-message__title">Nye vilkår for kontoen</strong>
                        <p>Vi har oppdatert vilkårene. Trykk for å lese hva som er endret.</p>
                    </div>
                </summary>
                <div className="ix-message__expanded">
                    <ul>
                        <li>Renten justeres fra 1. juli.</li>
                        <li>Gebyret for papirfaktura fjernes.</li>
                    </ul>
                </div>
            </details>
        </ix-stack>
    ),
};
