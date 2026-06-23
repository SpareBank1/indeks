import type { Meta, StoryObj } from '@storybook/react-vite';

import { LinkText, MessageRegion, SystemMessage } from '@sb1/indeks-react';

const meta = {
    title: 'Components/SystemMessage',
    component: SystemMessage,
    tags: ['autodocs'],
    // Ikke-kritiske SystemMessage annonseres via en MessageRegion (polite).
    // Regionen rendrer ingenting synlig. Kritiske meldinger (critical) bruker
    // role="alert" og trenger den ikke, men det er trygt å ha den her.
    decorators: [
        (Story) => (
            <MessageRegion>
                <Story />
            </MessageRegion>
        ),
    ],
    args: {
        status: 'info',
        children: 'Vi jobber med en teknisk feil. Du kan oppleve ustabilitet i nettbanken.',
        // Avbrytbare meldinger har en lukkeknapp. Systemkritiske meldinger
        // (critical) er ikke-avbrytbare og overstyrer dette til undefined.
        closeLabel: 'Lukk melding',
    },
} satisfies Meta<typeof SystemMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Success: Story = {
    args: {
        status: 'success',
        children: 'Innstillingene dine er oppdatert.',
    },
};

export const Warning: Story = {
    args: {
        status: 'warning',
        children: 'Vi gjennomfører vedlikehold i kveld. Tjenesten kan være utilgjengelig.',
    },
};

export const Danger: Story = {
    args: {
        status: 'danger',
        children: 'Vi jobber med en teknisk feil. Du kan oppleve ustabilitet i nettbanken.',
    },
};

export const MedLenke: Story = {
    name: 'Med lenke',
    args: {
        status: 'info',
        children: (
            <>
                Vi har oppdatert nettbanken. <LinkText href="#">Se hva som er nytt</LinkText>
            </>
        ),
    },
};

/**
 * Toppmelding (`placement="top"`) ligger flush som en banner øverst på en side
 * eller seksjon — uten runde hjørner og sidekanter.
 */
export const Topp: Story = {
    name: 'Toppmelding',
    args: {
        status: 'warning',
        placement: 'top',
        children: 'Vi gjennomfører vedlikehold i kveld. Tjenesten kan være utilgjengelig.',
    },
};

/**
 * Systemkritisk melding (`critical`). Får `role="alert"` og annonseres
 * umiddelbart (assertivt) av skjermlesere, uten å stjele fokus. Bruk kun for
 * kritisk informasjon — velg ellers lavest mulig alvorlighetsgrad.
 */
export const Kritisk: Story = {
    name: 'Kritisk (assertiv)',
    args: {
        status: 'danger',
        critical: true,
        // Systemkritiske meldinger er ikke-avbrytbare — ingen lukkeknapp.
        closeLabel: undefined,
        children: 'Nettbanken er nede. Vi jobber med å rette feilen.',
    },
};

/**
 * Ren HTML uten React-wrapper. Status velges med `data-status`, som også kobler
 * fargevariablene (`--ix-color-status-*`) automatisk. Plassering settes med
 * `data-placement`. ARIA (`role="alert"` for kritiske, eller `aria-live="polite"`)
 * settes manuelt av konsumenten. Statusikonet skrives som
 * `<ix-icon data-badge materialdesignname="…" aria-hidden="true">`.
 */
export const HTML: Story = {
    render: () => (
        <ix-stack>
            <div className="ix-system-message" data-status="info" data-placement="inline" aria-live="polite">
                <ix-icon data-badge="" materialdesignname="info_i" aria-hidden="true" />
                <div className="ix-system-message__body">
                    <p>
                        Vi har oppdatert nettbanken.{' '}
                        <a className="ix-link-text" href="#">
                            Se hva som er nytt
                        </a>
                    </p>
                </div>
                <button className="ix-system-message__close" type="button" aria-label="Lukk melding" />
            </div>

            <div className="ix-system-message" data-status="danger" data-placement="top" role="alert">
                <ix-icon data-badge="" materialdesignname="priority_high" aria-hidden="true" />
                <div className="ix-system-message__body">
                    <p>Nettbanken er nede. Vi jobber med å rette feilen.</p>
                </div>
            </div>
        </ix-stack>
    ),
};
