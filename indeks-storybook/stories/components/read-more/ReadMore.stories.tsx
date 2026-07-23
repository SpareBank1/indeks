import type { Meta, StoryObj } from '@storybook/react-vite';

import { LinkText, ListElement, ReadMore } from '@sb1/indeks-react';

const meta = {
    title: 'Components/ReadMore',
    component: ReadMore,
    tags: ['autodocs'],
    args: {
        label: 'Hva regnes som helsemessige begrensninger?',
        children: (
            <p>
                Med helsemessige begrensninger mener vi funksjonshemming, sykdom eller skade som
                påvirker hverdagen din over tid.
            </p>
        ),
    },
} satisfies Meta<typeof ReadMore>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Én frittstående seksjon. Labelen er klikkflaten — kort og beskrivende, med
 * chevron foran. Innholdet avsløres når brukeren åpner den.
 */
export const Standard: Story = {};

/**
 * Start seksjonen åpen med `defaultOpen`.
 */
export const DefaultOpen: Story = {
    name: 'Åpen som standard',
    args: { defaultOpen: true },
};

/**
 * Innholdet kan bestå av tekst, lister, lenker og andre komponenter.
 */
export const RiktInnhold: Story = {
    name: 'Rikt innhold',
    args: {
        label: 'Hva er inkludert?',
        defaultOpen: true,
        children: (
            <>
                <p>Avtalen inkluderer blant annet:</p>
                <ListElement as="ul">
                    <li>Nettbank og mobilbank</li>
                    <li>Gratis kortbruk i Norge</li>
                    <li>Varsling på SMS</li>
                </ListElement>
                <p>
                    Les mer i <LinkText href="#">vilkårene</LinkText>.
                </p>
            </>
        ),
    },
};

/**
 * Ren HTML uten React-wrapper. Native `<details>/<summary>` gir semantikk og
 * tastatur — ingen JavaScript eller ARIA-attributter er nødvendig.
 */
export const HTML: Story = {
    render: () => (
        <details className="ix-read-more" open>
            <summary>Hva regnes som helsemessige begrensninger?</summary>
            <div className="ix-read-more__content">
                <p>
                    Med helsemessige begrensninger mener vi funksjonshemming, sykdom eller skade som
                    påvirker hverdagen din over tid.
                </p>
            </div>
        </details>
    ),
};
